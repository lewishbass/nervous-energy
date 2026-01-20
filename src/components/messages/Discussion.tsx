'use client';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowRotateRight, FaPlus, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { useAuth } from '@/context/AuthContext';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import the plugin
import relTimeFormat from '@/scripts/relativetime';

const THREADS_ROUTE = "/.netlify/functions/thread";

interface DiscussionProps {
  baseThreadID: string;
  baseThreadTitle?: string;
  baseThreadContent?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Discussion({ baseThreadID, baseThreadTitle = 'Discussions', baseThreadContent = '', className = '', style = {} }: DiscussionProps) {
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

  const today = new Date();

  useEffect(() => {
    const toFetch = [];
    for (const threadID in threadData) {
      if (!usernameDict[threadData[threadID].creatorId]) {
        toFetch.push(threadData[threadID].creatorId);
      }
    }

    if (toFetch.length > 0 && isLoggedIn && username && token) {
      fetchUsernames(toFetch);
    }
  }, [threadData, usernameDict, username, token, isLoggedIn]);

  useEffect(() => {
    // if some are already loaded, refresh instead
    if (Object.keys(threadData).length > 0) {
      refreshAllThreads();
    } else {
      fetchThreadData(baseThreadID, isLoggedIn ? username : null, isLoggedIn ? token : null, 1);
    }
  }, [baseThreadID, isLoggedIn, username, token]);

  const fetchThreadData = async (threadID: string, username: string | null, token: string | null, depth: number = 2) => {
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
          depth: depth,
        }),
      });
      if (!response.ok && response.status === 403) {
        setLoadingState('loaded');
        setLoadingText('Base Thread Not Found');
        return;
      }

      if (!response.ok) throw new Error(`Error fetching submission statuses: ${response.statusText}`);
      const data = await response.json();

      const threadDict: Record<string, any> = {};
      data.allThreads.forEach((thread: any) => {
        threadDict[thread.id] = thread;
        if (threadData[thread.id]) {
          if (Object.keys(threadData[thread.id]).includes('expanded')) {
            threadDict[thread.id].expanded = threadData[thread.id].expanded;
          } else {
            threadDict[thread.id].expanded = true;
          }
        } else {
          threadDict[thread.id].expanded = true;
        }
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
      setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
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
      setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
      setLoadingText('Vote Recorded');
    } catch (error) {
      console.error('Error voting thread:', error);
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  }

  const handleReplySubmit = (parentID: string) => {
    if (!replyContent.trim()) {
      setLoadingText('Content is required');
      return;
    }

    const newThreadID = `${parentID}-reply-${Date.now()}`;
    createThread(newThreadID, username, token, parentID, replyTitle, replyContent);

    setReplyTitle('');
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleEditSubmit = async (threadID: string) => {
    if (!editingContent.trim()) {
      setLoadingText('Content is required');
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

      setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));

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

      if (data.thread === null) {
        setThreadData(prev => {
          const newData = { ...prev };
          delete newData[threadID];

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
        setThreadData(prev => ({ ...prev, [data.thread.id]: data.thread }));
        setLoadingText('Thread Deleted (Soft)');
      }

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

  const refreshAllThreads = async () => {
    setLoadingState('loading');
    setLoadingText('Refreshing All Discussions...');

    try {
      // Get all currently loaded thread IDs
      const currentThreadIds = Object.keys(threadData).filter(id => id !== baseThreadID);

      // Fetch base tree with depth 1
      const baseTreePromise = fetch(THREADS_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getThreadTree',
          rootId: baseThreadID,
          username: isLoggedIn ? username : null,
          token: isLoggedIn ? token : null,
          depth: 1,
        }),
      });

      // Fetch all currently loaded threads
      const allThreadsPromise = currentThreadIds.length > 0
        ? fetch(THREADS_ROUTE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getThreads',
            idArray: currentThreadIds,
            username: isLoggedIn ? username : null,
            token: isLoggedIn ? token : null,
          }),
        })
        : Promise.resolve(null);

      const [baseTreeResponse, allThreadsResponse] = await Promise.all([
        baseTreePromise,
        allThreadsPromise,
      ]);

      if (!baseTreeResponse.ok && baseTreeResponse.status == 403) {
        setLoadingState('loaded');
        setLoadingText('Base Thread Not Found');
        return;
      }

      if (!baseTreeResponse.ok) {
        throw new Error(`Error fetching base tree: ${baseTreeResponse.statusText}`);
      }

      const baseTreeData = await baseTreeResponse.json();
      const threadDict: Record<string, any> = {};

      // Add base tree threads
      baseTreeData.allThreads.forEach((thread: any) => {
        threadDict[thread.id] = thread;
        if (threadData[thread.id]) {
          if (Object.keys(threadData[thread.id]).includes('expanded')) {
            threadDict[thread.id].expanded = threadData[thread.id].expanded;
          } else {
            threadDict[thread.id].expanded = true;
          }
        } else {
          threadDict[thread.id].expanded = true;
        }
      });

      // Add updated threads if any were fetched
      if (allThreadsResponse && allThreadsResponse.ok) {
        const allThreadsData = await allThreadsResponse.json();
        if (allThreadsData.threads) {
          allThreadsData.threads.forEach((thread: any) => {
            threadDict[thread.id] = thread;
            if (threadData[thread.id]) {
              if (Object.keys(threadData[thread.id]).includes('expanded')) {
                threadDict[thread.id].expanded = threadData[thread.id].expanded;
              } else {
                threadDict[thread.id].expanded = true;
              }
            } else {
              threadDict[thread.id].expanded = true;
            }
          });
        }
      }

      setThreadData(threadDict);
      setLoadingState('loaded');
      setLoadingText('All Discussions Refreshed');
    } catch (error) {
      console.error('Error refreshing threads:', error);
      setLoadingState('error');
      setLoadingText((error instanceof Error) ? error.message : 'Unknown error');
    }
  };

  const toggleThreadLoaded = (threadId: string) => {
    const thread = threadData[threadId];
    if (!thread || !thread.children || thread.children.length === 0) return;
    const anyChildLoaded = thread.children.some((childID: string) => threadData[childID]);
    if (anyChildLoaded) {
      unloadThread(threadId);
    } else {
      loadThread(threadId);
    }
  }

  const toggleThreadExpanded = (threadID: string) => {
    const thread = threadData[threadID];
    if (!thread) return;
    if (thread.expanded && thread.expanded === true) {
      console.log('collapsing thread', threadID);
      setThreadData(prev => ({
        ...prev,
        [threadID]: {
          ...prev[threadID],
          expanded: false,
        },
      }));
    } else {
      console.log('expanding thread', threadID);
      setThreadData(prev => ({
        ...prev,
        [threadID]: {
          ...prev[threadID],
          expanded: true,
        },
      }));
    }
  };

  const renderThread = (threadID: string, depth: number = 0, isBase: boolean = false) => {
    const thread = threadData[threadID];
    if (!thread) return null;

    const childrenLoaded = thread.children && thread.children.some((childID: string) => threadData[childID]);

    const thumbstyle = "hover:scale-110 active:scale-90 cursor-pointer transition-all duration-300 absolute w-[100%] h-[100%] ";

    if (isBase) {
      return (
        <div key={threadID} className="mb-6">

          <div className="flex items-center gap-3 mb-3 align-middle">

            <p className="text-lg mb-4 tc2 mr-auto">{thread.content}</p>
            {isLoggedIn && userId === thread.creatorId && (
              <>
                <button
                  onClick={() => setDeleting(deleting === threadID ? null : threadID)}
                  className="text-sm px-3 py-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  {deleting === threadID ? 'Cancel' : 'Delete'}
                </button>
                {deleting === threadID && (
                  <button
                    onClick={() => deleteThread(threadID, username, token, 'hard')}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 active:bg-red-800 transition-colors"
                  >
                    Confirm
                  </button>
                )}
              </>
            )}
          </div>

          {isLoggedIn && (
            <div
              className="mb-4 p-4 border border-dashed border-gray-400 rounded tc1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setReplyingTo(threadID)}
            >
              <FaPlus className="inline mr-2" />
              New Topic
            </div>
          )}

          {replyingTo === threadID && (
            <div className="mt-1 mb-4 p-4 border border-blue-300 dark:border-blue-700 rounded bg-blue-50 dark:bg-blue-900/20">
              <input
                type="text"
                placeholder="Discussion title..."
                value={replyTitle}
                onChange={(e) => setReplyTitle(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 tc1"
                maxLength={100}
              />
              <textarea
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 tc1"
                maxLength={2000}
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReplySubmit(threadID)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700"
                >
                  Submit Discussion
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyTitle('');
                    setReplyContent('');
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 active:bg-gray-500 dark:active:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {thread.children && thread.children.map((childID: string) => renderThread(childID, depth + 1, false))}
        </div>
      );
    }

    return (<div key={threadID} className={`relative border border-gray-300 rounded dark:border-gray-700 p-2 pl-6 mb-4 overflow-hidden min-h-8`}>
      <div className="absolute w-4 h-full top-0 left-0 bg2 border-r border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-70 transition-opacity duration-200 flex-row items-center justify-center text-center tc3"
        onClick={() => toggleThreadExpanded(threadID)}>
        <div className="tc3 select-none">{thread.expanded ? '-' : '+'}</div>
      </div>

      {thread.expanded ? <div className="flex flex-row">
        <div className="flex flex-col items-center mr-4 tc2">
          <div className="w-6 h-6 relative">
            <FaThumbsUp className={`text-blue-500 ${thumbstyle} ${thread.isUpvoted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => voteThread(threadID, username, token, 'clear', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
            <FaRegThumbsUp className={`${thumbstyle} ${thread.isUpvoted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => voteThread(threadID, username, token, 'upvote', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
          </div>
          <div className="text-lg font-bold">{thread.score}</div>
          <div className="w-6 h-6 relative">
            <FaThumbsUp className={`text-orange-500 rotate-180 ${thumbstyle} ${thread.isDownvoted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => voteThread(threadID, username, token, 'clear', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
            <FaRegThumbsUp className={`rotate-180 ${thumbstyle} ${thread.isDownvoted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => voteThread(threadID, username, token, 'downvote', thread.isUpvoted ? 'upvote' : thread.isDownvoted ? 'downvote' : 'clear')} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold tc1">{thread.title || ''}
            <span className="font-normal tc3 text-xs ml-2">{usernameDict[thread.creatorId] || thread.creatorId}</span>
          </h3>
          <p className="mb-2 tc2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {thread.content}
            </ReactMarkdown>
          </p>
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
              <span className="select-none text-red-500 mr-1 hover:underline cursor-pointer" onClick={() => deleteThread(threadID, username, token, 'soft')}>
                soft
              </span>)</>
            }

            | {relTimeFormat(today, new Date(thread.timestamp))} | {thread.children ? thread.children.length : 0} replies
            {!childrenLoaded && thread.children && thread.children.length > 0 &&
              <span className="ml-1">
                |
                <span className="hover:underline cursor-pointer mr-1 select-none ml-1" onClick={() => toggleThreadLoaded(threadID)}>
                  load replies
                </span>
              </span>
            }
          </div>
        </div>

      </div>
        :
        <div className="flex flex-col align-center">
          <p className="text-sm tc3 line-clamp-1 text-ellipsis break-all">{usernameDict[thread.creatorId] || thread.creatorId} - {relTimeFormat(today, new Date(thread.timestamp))} - {(thread.title && thread.title.trim().length > 0) ? thread.title : thread.content}</p>
        </div>
      }
      {editing === threadID && (
        <div className="mt-1 mb-2 p-4 border border-green-300 dark:border-green-700 rounded bg-green-50 dark:bg-green-900/20">
          <input
            type="text"
            placeholder="Edit title..."
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 tc1"
            maxLength={50}
          />
          <textarea
            placeholder="Edit content..."
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 tc1"
            rows={4}
            maxLength={2000}
          />
          <button
            onClick={() => handleEditSubmit(threadID)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      )}
      {replyingTo === threadID && (
        <div className="mt-1 mb-2 p-4 border border-blue-300 dark:border-blue-700 rounded bg-blue-50 dark:bg-blue-900/20">
          <input
            type="text"
            placeholder="Reply title..."
            value={replyTitle}
            onChange={(e) => setReplyTitle(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 tc1"
            maxLength={50}
          />
          <textarea
            placeholder="Reply content..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 tc1"
            rows={4}
            maxLength={2000}
          />
          <button
            onClick={() => handleReplySubmit(threadID)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700"
          >
            Submit Reply
          </button>
        </div>
      )}
      {thread.children && thread.expanded && thread.children.map((childID: string) => renderThread(childID, depth + 1, false))}
    </div>
    );
  }



  return (
    <div className={className} style={style}>
      <div className="flex-row flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tc1 mr-auto">{baseThreadTitle || "Discussions"}</h2>
        <span className={`${stateTextColors[loadingState]} mr-3`}>{loadingText}</span>
        <FaArrowRotateRight
          className="mr-2 cursor-pointer text-xl tc1 hover:opacity-70 active:-rotate-360 duration-1000 active:duration-0 active:opacity-50 transition-transform"
          title="Refresh Discussions"
          onClick={refreshAllThreads}
        />
      </div>

      {loadingState === 'loaded' && Object.keys(threadData).length === 0 && (
        <div className="p-4 border border-dashed border-gray-400 rounded tc1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => createThread(baseThreadID, isLoggedIn ? username : null, isLoggedIn ? token : null, null, baseThreadTitle || "Discussions", baseThreadContent || "Discuss with your classmates here!")}>
          <FaPlus className="inline mr-2" />
          Create Base Thread
        </div>
      )}

      {loadingState !== 'unloaded' && Object.keys(threadData).length > 0 && renderThread(baseThreadID, 0, true)}
    </div>
  );
}