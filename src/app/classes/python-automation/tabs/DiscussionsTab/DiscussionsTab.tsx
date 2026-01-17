'use client';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowRotateRight, FaPlus, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { useAuth } from '@/context/AuthContext';
import { threadId } from 'worker_threads';
import { get } from 'http';


const THREAD_NAME = "python-automation-discussions";
const THREADS_ROUTE = "/.netlify/functions/thread";

export default function DiscussionsTab() {

  const baseThreadID = useMemo(() => {
    if (typeof window !== 'undefined') {
      return THREAD_NAME.toLowerCase().replace(/\s+/g, '-') + '-' + window.location.pathname.replace(/\/+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }
    return THREAD_NAME.toLowerCase().replace(/\s+/g, '-');
  }, [THREAD_NAME]);

  const [threadData, setThreadData] = useState<Record<string, any>>({});
  const [loadingState, setLoadingState] = useState<'unloaded' | 'loading' | 'loaded' | 'error'>('unloaded');
  const [loadingText, setLoadingText] = useState<string>('unloaded');

  const [usernameDict, setUsernameDict] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTitle, setReplyTitle] = useState<string>('');
  const [replyContent, setReplyContent] = useState<string>('');

  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [editingTitle, setEditingTitle] = useState<string>('');

  const stateTextColors: Record<string, string> = {
    'unloaded': 'tc3',
    'loading': 'text-yellow-500',
    'loaded': 'text-green-500',
    'error': 'text-red-500',
  };

  const { username, token, isLoggedIn, userId } = useAuth();

  useEffect(() => {
    const toFetch = [];
    for (const threadID in threadData) {
      if (!usernameDict[threadData[threadID].creatorId]) {
        toFetch.push(threadData[threadID].creatorId);
      }
    }
    
    // Fetch usernames for any unknown user IDs
    if (toFetch.length > 0 && isLoggedIn && username && token) {
      fetchUsernames(toFetch);
    }
  }, [threadData, usernameDict, username, token, isLoggedIn]);

  useEffect(() => {
    // Initial fetch of base thread
    fetchThreadData(baseThreadID, isLoggedIn ? username : null, isLoggedIn ? token : null);
  }, [baseThreadID, isLoggedIn, username, token]);


  const fetchThreadData = async (threadID: string, username: string | null, token: string | null) => {
    setLoadingState('loading');
    setLoadingText('Loading Discussions...');
    try {
      const response = await fetch(THREADS_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getThreadTree',
          rootId: threadID,
          username,
          token,
          depth: 2,
        }),
      });

      if (!response.ok && response.statusText === 'Not Found' && threadID === baseThreadID) {
        setLoadingState('loaded');
        setLoadingText('Base Thread Not Found');
        return;
      }

      if (!response.ok) throw new Error(`Error fetching submission statuses: ${response.statusText}`);
      const data = await response.json();
      console.log("Fetched thread data:", data);

      const threadDict: Record<string, any> = {};
      data.allThreads.forEach((thread: any) => {
        threadDict[thread.id] = thread;
      });

      setThreadData(prev => ({ ...prev, ...threadDict }));
      setLoadingState('loaded');
      setLoadingText('Discussions Loaded');

    } catch (error) {
      console.error('Error fetching thread data:', error);
      setLoadingState('error');
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  };

  const createThread = async (threadID: string, username: string | null, token: string | null, parentID: string | null, title: string, content: string) => {
    if (!isLoggedIn || !username || !token) {
      setLoadingState('error');
      setLoadingText('You must be logged in to create a thread');
      return;
    }
    setLoadingState('loading');
    setLoadingText('Creating Thread...');
    try {
      const response = await fetch(THREADS_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createThread',
          id: threadID,
          username,
          token,
          parentMessageId: parentID,
          title,
          content,
        }),
      });

      if (!response.ok) throw new Error(`api error: ${response.statusText}`);
      const data = await response.json();
      console.log("Created thread:", data);
      // append new thread to threadData
      setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
      // append to parents children if parentID exists
      if (parentID && threadData[parentID]) {
        setThreadData(prev => ({
          ...prev,
          [parentID]: {
            ...prev[parentID],
            children: [...(prev[parentID].children || []), data.thread.id],
          },
        }));
      }
      setLoadingState('loaded');
      setLoadingText('Thread Created');
    } catch (error) {
      console.error('Error creating thread:', error);
      setLoadingState('error');
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  }

  const fetchUsernames = async (userIds: string[]) => {
    if (!username || !token) return;
    
    try {
      const response = await fetch('/.netlify/functions/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get',
          username,
          token,
          toFetch: userIds,
          isId: true
        }),
      });

      const profileData = await response.json();

      // Update usernameDict with fetched names
      if (Array.isArray(profileData)) {
        const updatedDict = { ...usernameDict };
        profileData.forEach(user => {
          if (user.id && user.username) {
            updatedDict[user.id] = user.profile?.firstName
              ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
              : user.username;
          }
        });
        setUsernameDict(updatedDict);
      }
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  const voteThread = async (threadId: string, username: string, token: string | null, voteType: 'upvote' | 'downvote' | 'clear', oldVote: 'upvote' | 'downvote' | 'clear') => {
    if (!isLoggedIn || !username || !token) {
      setLoadingText('You must be logged in to vote');
      return;
    }
    setLoadingText(voteType + '...');
    try {
      const response = await fetch(THREADS_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'voteThread',
          threadId,
          username,
          token,
          voteType,
          oldVote,
        }),
      });

      if (!response.ok) throw new Error(`api error: ${response.statusText}`);
      const data = await response.json();
      // update threadData with new vote info

      console.log("Voted thread:", data.thread);
      setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
      setLoadingText('Vote Recorded');
    } catch (error) {
      console.error('Error voting thread:', error);
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  }

  const handleReplySubmit = (parentID: string) => {
    if (!replyTitle.trim() || !replyContent.trim()) {
      setLoadingText('Title and content are required');
      return;
    }
    
    const newThreadID = `${parentID}-reply-${Date.now()}`;
    createThread(newThreadID, username, token, parentID, replyTitle, replyContent);
    
    // Clear form and close reply
    setReplyTitle('');
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleEditSubmit = async (threadID: string) => {
    if (!editingTitle.trim() || !editingContent.trim()) {
      setLoadingText('Title and content are required');
      return;
    }
    
    if (!isLoggedIn || !username || !token) {
      setLoadingState('error');
      setLoadingText('You must be logged in to edit a thread');
      return;
    }
    
    setLoadingText('Updating Thread...');
    
    try {
      const response = await fetch(THREADS_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'editThread',
          threadId: threadID,
          username,
          token,
          title: editingTitle,
          content: editingContent,
        }),
      });

      if (!response.ok) throw new Error(`api error: ${response.statusText}`);
      const data = await response.json();
      console.log("Edited thread:", data);
      
      // Update thread in threadData
      setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
      
      // Clear form and close edit
      setEditingTitle('');
      setEditingContent('');
      setEditing(null);
      setLoadingText('Thread Updated');
    } catch (error) {
      console.error('Error editing thread:', error);
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  };

  const deleteThread = async (threadID: string, username: string, token: string | null, deleteType: 'hard' | 'soft') => {
    if (!isLoggedIn || !username || !token) {
      setLoadingText('You must be logged in to delete a thread');
      return;
    }
    setLoadingText('Deleting Thread...');
    
    try {
      const response = await fetch(THREADS_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteThread',
          threadId: threadID,
          username,
          token,
          deleteType,
        }),
      });

      if (!response.ok) throw new Error(`api error: ${response.statusText}`);
      const data = await response.json();
      console.log("Deleted thread:", data);

      // If hard delete (thread is null), remove from threadData
      if (data.thread === null) {
        setThreadData(prev => {
          const newData = { ...prev };
          delete newData[threadID];
          
          // Also remove this thread from its parent's children array
          for (const parentID in newData) {
            if (newData[parentID].children?.includes(threadID)) {
              newData[parentID] = {
                ...newData[parentID],
                children: newData[parentID].children.filter((id: string) => id !== threadID),
              };
            }
          }
          
          return newData;
        });
        setLoadingText('Thread Permanently Deleted');
      } else {
        // Soft delete - update thread with deleted content
        setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
        setLoadingText('Thread Deleted (Soft)');
      }
      
      // Clear delete confirmation state
      setDeleting(null);
    } catch (error) {
      console.error('Error deleting thread:', error);
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  }

  const getChildrenIds = (threadID: string): string[] => {
    const thread = threadData[threadID];
    if (!thread || !thread.children) return [];
    let allChildren: string[] = [];
    thread.children.forEach((childID: string) => {
      allChildren.push(childID);
      allChildren = allChildren.concat(getChildrenIds(childID));
    });
    return allChildren;
  }

  const unloadThread = (threadId: string) => {
    const toRemove = [...getChildrenIds(threadId)];

    setThreadData(prev => {
      const newData = { ...prev };
      toRemove.forEach(id => {
        delete newData[id];
      });
      return newData;
    });
  }
  const loadThread = (threadId: string) => {
    fetchThreadData(threadId, isLoggedIn ? username : null, isLoggedIn ? token : null);
  }
  const toggleThreadLoaded = (threadId: string) => {
    const thread = threadData[threadId];
    if (!thread || !thread.children || thread.children.length === 0) return;
    const anyChildLoaded = thread.children.some((childID: string) => threadData[childID]);
    if (anyChildLoaded) {
      console.log("Unloading thread:", threadId);
      unloadThread(threadId);
    } else {
      console.log("Loading thread:", threadId);
      loadThread(threadId);
    }
  }

  const renderThread = (threadID: string, depth: number = 0) => {
    const thread = threadData[threadID];
    if (!thread) return null;

    const expanded = thread.children && thread.children.some((childID: string) => threadData[childID]);

    const thumbstyle = "hover:scale-110 active:scale-90 cursor-pointer transition-all duration-300 absolute w-[100%] h-[100%] ";
    
    return (<div key={threadID} className={`relative border border-gray-300 rounded dark:border-gray-700 p-2 pl-6 mb-4 ml-${2} overflow-hidden`}>

      {/*collapse button*/}
      <div className="absolute w-4 h-full top-0 left-0 bg2 border-r border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-70 transition-opacity duration-200 flex-row items-center justify-center text-center tc3"
      onClick={() => toggleThreadLoaded(threadID)}>
        <div className="tc3">{thread.children.length > 0 && (expanded ? '-' : '+')}</div>
      </div>

      <div className="flex flex-row">
        {/* vote display */}
        <div className="flex flex-col items-center mr-4 tc2">
          <div className="w-6 h-6 relative">
            <FaThumbsUp className={`text-blue-500 ${thumbstyle} ${thread.isUpvoted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => voteThread(threadID, username, token, 'clear', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
            <FaRegThumbsUp className={`${thumbstyle} ${thread.isUpvoted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => voteThread(threadID, username, token, 'upvote', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
          </div>
          <div className="text-lg font-bold">{thread.score}</div>
          <div className="w-6 h-6 relative">
            <FaThumbsUp className={`text-orange-500 rotate-180 ${thumbstyle} ${thread.isDownvoted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => voteThread(threadID, username, token, 'clear', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
            <FaRegThumbsUp className={`rotate-180 ${thumbstyle} ${thread.isDownvoted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => voteThread(threadID, username, token, 'downvote', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
          </div>        </div>
        {/* thread content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2 tc1">{thread.title || ''}
            <span className="font-normal tc3 text-xs ml-2">{usernameDict[thread.creatorId] || thread.creatorId}</span>
          </h3>
          <p className="mb-2 tc2">{thread.content}</p>
          <div className="text-sm tc3 mb-2">
            {isLoggedIn && <span
              className="hover:underline cursor-pointer mr-1 select-none"
              onClick={() => setReplyingTo(replyingTo === threadID ? null : threadID)}
            >
              {replyingTo === threadID ? 'cancel' : 'reply'}
            </span>}
            {isLoggedIn && userId === thread.creatorId && <>
              <span
                className="hover:underline cursor-pointer mr-1 select-none"
                onClick={() => {
                  if (editing === threadID) {
                    setEditing(null);
                    setEditingTitle('');
                    setEditingContent('');
                  } else {
                    setEditing(threadID);
                    setEditingTitle(thread.title || '');
                    setEditingContent(thread.content || '');
                  }
                }}
              >
              {editing === threadID ? 'cancel' : 'edit'}
              </span>
              <span
              className="hover:underline cursor-pointer mr-1 select-none"
              onClick={() => setDeleting(deleting === threadID ? null : threadID)}
            >
              {deleting === threadID ? 'cancel' : 'delete'}
              </span>
            </>}
            {deleting === threadID && <>
            (<span className="select-none text-red-500 mr-1 hover:underline cursor-pointer ml-1" onClick={() => deleteThread(threadID, username, token, 'hard')}>
              hard
            </span>
            <span className="select-none text-red-500 mr-1 hover:underline cursor-pointer"  onClick={() => deleteThread(threadID, username, token, 'soft')}>
              soft
            </span>)</>
            }

            | {new Date(thread.lastUpdated).toLocaleString()} | {thread.children ? thread.children.length : 0} replies
          </div>
          
          
        </div>
      </div>
      {/* Edit form */}
      {editing === threadID && (
        <div className="mt-1 mb-2 ml-4 p-4 border border-green-300 rounded bg-green-50">
          <input
            type="text"
            placeholder="Edit title..."
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Edit content..."
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            rows={4}
          />
          <button
            onClick={() => handleEditSubmit(threadID)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      )}
      {/* Reply form */}
      {replyingTo === threadID && (
        <div className="mt-1 mb-2 ml-4 p-4 border border-blue-300 rounded bg-blue-50">
          <input
            type="text"
            placeholder="Reply title..."
            value={replyTitle}
            onChange={(e) => setReplyTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Reply content..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            rows={4}
          />
          <button
            onClick={() => handleReplySubmit(threadID)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700"
          >
            Submit Reply
          </button>
        </div>
      )}
      {/* Render children threads */}
      {thread.children && thread.children.map((childID: string) => renderThread(childID, depth + 1))}
    </div>
    );

  }

  return (
    <div>
      <div className="flex-row flex items-center justify-between mb-4 mb-4">
        <h2 className="text-2xl font-bold tc1 mr-auto">Class Discussions</h2>
        <span className={`${stateTextColors[loadingState]} mr-3`}>{loadingText}</span>
        <FaArrowRotateRight
          className="mr-2 cursor-pointer text-xl tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform"
          title="Refresh Discussions"
          onClick={() => fetchThreadData(baseThreadID, isLoggedIn ? username : null, isLoggedIn ? token : null)}
        />
      </div>

      {/* Create base thread button */}
      {
        loadingState === 'loaded' && Object.keys(threadData).length === 0 && (
          <div className="p-4 border border-dashed border-gray-400 rounded tc1 cursor-pointer hover:bg-gray-100" onClick={() => createThread(baseThreadID, isLoggedIn ? username : null, isLoggedIn ? token : null, null, "Python-Automation Discussions", "Discuss Python and automation techniques with your classmates here!")}>
            <FaPlus className="inline mr-2" />
            Create Base Thread
          </div>
        )
      }

      {/* Render thread data */}
      {
        loadingState !== 'unloaded' && Object.keys(threadData).length > 0 && renderThread(baseThreadID)
      }




    </div>
  );
}
