import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import { validateUser, sendNotification } from '../lib/backendutils';
import User from '../models/User';
import { ThreadModel } from '../models/Thread';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event) => {
	console.log('thread handler called');
	// Only allow POST method
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: 'Method not allowed' }),
		};
	}

	// Parse request body
	let requestBody;
	try {
		requestBody = JSON.parse(event.body || '{}');
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Invalid JSON payload' }),
		};
	}
	try {
		// Connect to MongoDB
		console.log('Connecting to MongoDB...');
		const mongoose = await connectMongoDB();
		console.log('MongoDB connection established');

		//route to appropriate handler based on action
		if(requestBody.action === 'createThread') {
			console.log('Handling create thread action');
			return await handleCreateThread(requestBody);
		}else if(requestBody.action === 'getThreads') {
			console.log('Handling get threads action');
			return await handleGetThreads(requestBody);
		} else if (requestBody.action === 'getThreadTree') {
			console.log('Handling getThreadTree action');
			return await handleGetThreadTree(requestBody);
		} else if (requestBody.action === 'voteThread') {
			console.log('Handling voteThread action');
			return await handleVoteThread(requestBody);
		} else if (requestBody.action === 'editThread') {
			console.log('Handling editThread action');
			return await handleEditThread(requestBody);
		} else if (requestBody.action === 'deleteThread') {
			console.log('Handling deleteThread action');
			return await handleDeleteThread(requestBody);
		}

		return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Path not found' }),
    };
	} catch (error) {
		console.error('Error:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: 'Internal server error',
				message: error instanceof Error ? error.message : 'Unknown error'
			}),
		};
	}

};

const handleCreateThread = async (body: any) => {
	const { username, token, id, parentMessageId, title, content } = body;

	// Validate required fields
	if (!username || !token ) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing required fields' }),
		};
	}

	// Validate user
	const validation = await validateUser(username, token);
	if (validation.error !== 'OK') {
		console.error('User validation failed:', validation.error);
		return{
			statusCode: 401,
			body: JSON.stringify({ error: validation.error }),
		};
	}

	const user = validation.user;

	// Create new thread
	const newThread = new ThreadModel({
		id: id || uuidv4(),
		creatorId: user.id,
		parentMessageId: parentMessageId || null,
		title: title || '',
		content: content || '',
	});

	try{
		await newThread.save();
	} catch (error) {
		console.error('Error saving new thread:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Error saving new thread' + (error instanceof Error ? error.message : 'Unknown error') }),
		};
	}

	// append to parent's children if parentMessageId is provided
	if (parentMessageId) {
		const parentThread = await ThreadModel.findOne({ id: parentMessageId });
		if (parentThread) {
			parentThread.children.push(newThread.id);
			await parentThread.save();
		} else {
			console.error('Parent thread not found:', parentMessageId);
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'Parent thread not found' }),
			}
		}
	}

	notifyReply(
		parentMessageId,
		user.id,
		user.username,
		content
	);

	return {
		statusCode: 200,
		body: JSON.stringify({ success: true, thread: newThread }),
	};

}

const handleGetThreads = async (body: any) => {
	const { idArray, username, token } = body;

	// Validate required fields
	if (!idArray || !Array.isArray(idArray)) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing or invalid idArray' }),
		};
	}

	let userId: string | null = null;
	
	// Optionally validate user if credentials provided
	if (username && token) {
		const validation = await validateUser(username, token);
		if (validation.error === 'OK') {
			userId = validation.user.id;
		}
	}

	// Fetch threads with conditional user voting status
	const threads = await ThreadModel.aggregate([
		{ $match: { id: { $in: idArray } } },
		{
			$project: {
				id: 1,
				creatorId: 1,
				parentMessageId: 1,
				timestamp: 1,
				lastUpdated: 1,
				lastDirtied: 1,
				title: 1,
				content: 1,
				children: 1,
				score: 1,
				...(userId && {
					isUpvoted: { $in: [userId, '$upvotes'] },
					isDownvoted: { $in: [userId, '$downvotes'] }
				})
			}
		}
	]);

	return {
		statusCode: 200,
		body: JSON.stringify({ success: true, threads }),
	};
}

const handleGetThreadTree = async (body: any) => {
	const { rootId, depth, username, token } = body;

	// Validate required fields
	if (!rootId) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing rootId' }),
		};
	}

	// sanitize depth
	let maxDepth = depth && typeof depth === 'number' && depth > 0 ? depth : 0;

	let userId: string | null = null;
	
	// Optionally validate user if credentials provided
	if (username && token) {
		const validation = await validateUser(username, token);
		if (validation.error === 'OK') {
			userId = validation.user.id;
		}
	}

	// Use aggregation with $graphLookup to recursively fetch all descendants
	const result = await ThreadModel.aggregate([
		// Start with the root thread
		{ $match: { id: rootId } },
		// Recursively lookup all descendants
		{
			$graphLookup: {
				from: 'threads', // collection name (lowercase + plural)
				startWith: '$id',
				connectFromField: 'id',
				connectToField: 'parentMessageId',
				as: 'descendants',
				maxDepth: maxDepth > 0 ? maxDepth - 1 : 999, // -1 because depth 1 means just the root
				depthField: 'depth'
			}
		},
		// Project to add user voting status and exclude full arrays
		{
			$project: {
				id: 1,
				creatorId: 1,
				parentMessageId: 1,
				timestamp: 1,
				lastUpdated: 1,
				lastDirtied: 1,
				title: 1,
				content: 1,
				children: 1,
				score: 1,
				...(userId && {
					isUpvoted: { $in: [userId, '$upvotes'] },
					isDownvoted: { $in: [userId, '$downvotes'] }
				}),
				descendants: {
					$map: {
						input: '$descendants',
						as: 'desc',
						in: {
							id: '$$desc.id',
							creatorId: '$$desc.creatorId',
							parentMessageId: '$$desc.parentMessageId',
							timestamp: '$$desc.timestamp',
							lastUpdated: '$$desc.lastUpdated',
							lastDirtied: '$$desc.lastDirtied',
							title: '$$desc.title',
							content: '$$desc.content',
							children: '$$desc.children',
							score: '$$desc.score',
							depth: '$$desc.depth',
							...(userId && {
								isUpvoted: { $in: [userId, '$$desc.upvotes'] },
								isDownvoted: { $in: [userId, '$$desc.downvotes'] }
							})
						}
					}
				}
			}
		}
	]);
	

	if (result.length === 0) {
		return {
			statusCode: 403,
			body: JSON.stringify({ error: 'Root thread not found' }),
		};
	}

	// The root thread and all descendants
	const rootThread = result[0];
	const allThreads = [rootThread, ...rootThread.descendants];

	return {
		statusCode: 200,
		body: JSON.stringify({
			success: true,
			rootThread,
			descendants: rootThread.descendants,
			allThreads
		}),
	};
}

const handleVoteThread = async (body: any) => {
	const { username, token, threadId, voteType, oldVote } = body;
	// Validate required fields
	
	if (!username || !token || !threadId || !voteType) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing required fields' }),
		};
	}

	// Validate user
	const validation = await validateUser(username, token);
	if (validation.error !== 'OK'){
		return{
			statusCode: 401,
			body: JSON.stringify({ error: validation.error }),
		};
	}

	const user = validation.user;
	const userId = user.id;
	const voteDifference = (voteType === 'upvote' ? 1 : voteType === 'clear' ? 0 : -1) + (oldVote === 'upvote' ? -1 : oldVote === 'clear' ? 0 : 1);


	let updatedThread;

	if (voteType === 'clear') {
		// Remove user from both upvotes and downvotes
		updatedThread = await ThreadModel.findOneAndUpdate(
			{ id: threadId },
			{
				$pull: {
					upvotes: userId,
					downvotes: userId
				},
				$inc: { score: voteDifference }
			},
			{ new: true }
		);
	}
	else {
		// Determine which arrays to modify
		const addToArray = voteType === 'upvote' ? 'upvotes' : 'downvotes';
		const removeFromArray = voteType === 'upvote' ? 'downvotes' : 'upvotes';

		console.log("vote difference", voteDifference, "oldVote:", oldVote, "newVote:", voteType);

		// Update thread: add to one array, remove from the other (in case of vote change)
		updatedThread = await ThreadModel.findOneAndUpdate(
			{ id: threadId },
			{
				$addToSet: { [addToArray]: userId },
				$pull: { [removeFromArray]: userId },
				$inc: { score: voteDifference }
			},
			{ new: true }
		);
	}

	if (!updatedThread) {
		return {
			statusCode: 403,
			body: JSON.stringify({ error: 'Thread not found' }),
		};
	}

	// Fetch thread with voting status using aggregation
	const threadWithVoteStatus = await ThreadModel.aggregate([
		{ $match: { id: threadId } },
		{
			$project: {
				id: 1,
				creatorId: 1,
				parentMessageId: 1,
				timestamp: 1,
				lastUpdated: 1,
				lastDirtied: 1,
				title: 1,
				content: 1,
				children: 1,
				score:1,
				isUpvoted: { $in: [userId, '$upvotes'] },
				isDownvoted: { $in: [userId, '$downvotes'] }
			}
		}
	]);

	return {
		statusCode: 200,
		body: JSON.stringify({
			success: true,
			thread: threadWithVoteStatus[0],
			score: updatedThread.score
		}),
	};
}
	
const handleEditThread = async (body: any) => {
	const { username, token, threadId, title, content } = body;
	// Validate required fields
	if (!username || !token || !threadId || (!title && !content)) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing required fields' }),
		};
	}

	// Validate user
	const validation = await validateUser(username, token);
	if (validation.error !== 'OK') {
		return {
			statusCode: 401,
			body: JSON.stringify({ error: validation.error }),
		};
	}
	const user = validation.user;
	const userId = user.id;

	// Build update object with only provided fields
	const updateFields: any = {};
	if (title !== undefined) updateFields.title = title;
	if (content !== undefined) updateFields.content = content;

	// Update thread only if user is the creator (single DB call)
	const updatedThread = await ThreadModel.findOneAndUpdate(
		{ id: threadId, creatorId: userId }, // Match both thread ID and creator
		{ $set: updateFields },
		{ new: true } // Return updated document
	);

	if (!updatedThread) {
		return {
			statusCode: 403,
			body: JSON.stringify({ error: 'Thread not found or you are not the creator' }),
		};
	}

	// Fetch thread with voting status using aggregation
	const threadWithVoteStatus = await ThreadModel.aggregate([
		{ $match: { id: threadId } },
		{
			$project: {
				id: 1,
				creatorId: 1,
				parentMessageId: 1,
				timestamp: 1,
				lastUpdated: 1,
				lastDirtied: 1,
				title: 1,
				content: 1,
				children: 1,
				score: 1,
				isUpvoted: { $in: [userId, '$upvotes'] },
				isDownvoted: { $in: [userId, '$downvotes'] }
			}
		}
	]);

	return {
		statusCode: 200,
		body: JSON.stringify({
			success: true,
			thread: threadWithVoteStatus[0]
		}),
	};
}

const handleDeleteThread = async (body: any) => {
	const { username, token, threadId, deleteType } = body;
	// Validate required fields

	if (!username || !token || !threadId) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing required fields' }),
		};
	}

	// Validate user
	const validation = await validateUser(username, token);
	if (validation.error !== 'OK') {
		return {
			statusCode: 401,
			body: JSON.stringify({ error: validation.error }),
		};
	}

	const user = validation.user;

	if (deleteType === 'hard') {
		const updatedThread = await deleteThreadRecursively(threadId, user.id);
		
		if (!updatedThread && updatedThread !== null) {
			return {
				statusCode: 403,
				body: JSON.stringify({ error: 'Thread not found or you are not the creator' }),
			};
		}
		
		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, thread: null, message: 'Thread and descendants deleted' }),
		}
	} else {
		// Soft delete: replace content with "[deleted]"
		const updatedThread = await ThreadModel.findOneAndUpdate(
			{ id: threadId, creatorId: user.id },
			{ $set: { content: '[deleted]', title: '[deleted]'} },
			{ new: true }
		);

		if (!updatedThread) {
			return {
				statusCode: 403,
				body: JSON.stringify({ error: 'Thread not found or you are not the creator' }),
			};
		}

		return {
			statusCode: 200,
			body: JSON.stringify({ success: true, thread: updatedThread }),
		}
	}

}

const deleteThreadRecursively = async (threadId: string, userId: string) => {
	// First verify the user owns the root thread
	const rootThread = await ThreadModel.findOne({ id: threadId, creatorId: userId });
	
	if (!rootThread) {
		return null; // Thread not found or user is not the creator
	}

	// Use aggregation to find all descendants
	const result = await ThreadModel.aggregate([
		{ $match: { id: threadId } },
		{
			$graphLookup: {
				from: 'threads',
				startWith: '$id',
				connectFromField: 'id',
				connectToField: 'parentMessageId',
				as: 'descendants',
				maxDepth: 999
			}
		}
	]);

	// Collect all thread IDs to delete (root + descendants)
	const threadIdsToDelete = [threadId];
	if (result.length > 0 && result[0].descendants) {
		threadIdsToDelete.push(...result[0].descendants.map((d: any) => d.id));
	}

	// Remove this thread from parent's children array if it has a parent
	if (rootThread.parentMessageId) {
		await ThreadModel.findOneAndUpdate(
			{ id: rootThread.parentMessageId },
			{ $pull: { children: threadId } }
		);
	}

	// Delete all threads in one call
	const deleteResult = await ThreadModel.deleteMany({
		id: { $in: threadIdsToDelete }
	});
	// return null thread since it's deleted
	return null;
}

const notifyReply = async (parentThreadId: string, replierId: string, replierUsername: string, message: string) => {

	// Fetch the parent thread to get its creator
	const parentThread = await ThreadModel.findOne({ id: parentThreadId });
	if (!parentThread) {
		console.error('Parent thread not found for notification:', parentThreadId);
		return;
	}
	const parentCreatorId = parentThread.creatorId;

	// fetch parent thread user
	const parentUser = await User.findOne({ id: parentCreatorId });
	if (!parentUser) {
		console.error('Parent thread creator user not found for notification:', parentCreatorId);
		return;
	}

	const sender = { id: replierId };

	sendNotification(
		sender,
		parentUser,
		`${replierUsername} replied to your thread`,
		'threadReply',
		JSON.stringify({
			threadId: parentThreadId,
			preview: `${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
			parentPreview: `${parentThread.content.substring(0, 100)}${parentThread.content.length > 100 ? '...' : ''}`,
			senderUsername: `${replierUsername}`,
		}),
	);

}