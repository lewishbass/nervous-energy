import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import { validateUser, sendNotification } from '../lib/backendutils';
import User from '../models/User';
import { ConversationModel, MessageModel } from '../models/Conversation';

export const handler: Handler = async (event) => {
  console.log('conversation handler called');
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

    // Route to appropriate handler based on action
    if (requestBody.action === 'createConversation') {
      console.log('Handling create conversation...');
      return await handleCreateConversation(requestBody);
    } else if (requestBody.action === 'editConversation') {
      console.log('Handling edit conversation...');
      return await handleEditConversation(requestBody);
    } else if (requestBody.action === 'sendMessage') {
      console.log('Handling send message...');
      return await handleSendMessage(requestBody);
    } else if (requestBody.action === 'editMessage') {
      console.log('Handling edit message...');
      return await handleEditMessage(requestBody);
    } else if (requestBody.action === 'deleteMessage') {
      console.log('Handling delete message...');
      return await handleDeleteMessage(requestBody);
    } else if (requestBody.action === 'getMessages') {
      console.log('Handling get messages...');
      return await handleGetMessages(requestBody);
    } else if (requestBody.action === 'markAsRead') {
      console.log('Handling mark as read...');
      return await handleMarkAsRead(requestBody);
    } else if (requestBody.action === 'getUserConversations') {
      console.log('Handling get user conversations...');
      return await handleGetUserConversations(requestBody);
    } else if (requestBody.action === 'addParticipants') {
      console.log('Handling add participants...');
      return await handleAddParticipants(requestBody);
    } else if (requestBody.action === 'removeParticipant') {
      console.log('Handling remove participant...');
      return await handleRemoveParticipant(requestBody);
    } else if (requestBody.action === 'addReaction') {
      console.log('Handling add reaction...');
      return await handleAddReaction(requestBody);
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

const handleCreateConversation = async (requestBody: any) => {
  const { username, token, participants, name, type = 'direct' } = requestBody;
  
  // Validate required fields
  if (!username || !token || !participants || !Array.isArray(participants)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing or invalid' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Make sure all participants exist
  const allParticipants = [...new Set([...participants, user.id])]; // Include creator and deduplicate
  const users = await User.find({ id: { $in: allParticipants } });
  
  if (users.length !== allParticipants.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'One or more participants do not exist' }),
    };
  }
  
  // Create formatted participants array with required structure
  const formattedParticipants = users.map(user => ({
    userId: user.id,
    lastReadMessageId: null,
    joinedAt: new Date(),
    role: user.id === user.id ? 'admin' : 'member',
    isActive: true,
  }));
  
  // Create the conversation
  const conversation = new ConversationModel({
    name: name || (type === 'direct' ? '' : 'New Group Conversation'),
    type,
    participants: formattedParticipants,
  });
  
  await conversation.save();
  
  // Update each user's chat list
  const conversationData = {
    chatId: conversation.id,
    chatName: conversation.name,
    chatType: conversation.type,
    chatMembers: allParticipants,
    newMessages: false,
  };
  
  // Add to the creator's chats
  if (!user.data.chats) user.data.chats = [];
  user.data.chats.push(conversationData);
  await user.save();
  
  // Add to other participants' chats and notify them
  for (const participantUser of users) {
    if (participantUser.id === user.id) continue; // Skip the creator
    
    if (!participantUser.data.chats) participantUser.data.chats = [];
    participantUser.data.chats.push(conversationData);
    participantUser.data.updatedChats = true;
    
    // Notify other participants
    await sendNotification(
      user,
      participantUser,
      `${username} added you to a ${type === 'direct' ? 'conversation' : 'group'}`,
      'newConversation',
      JSON.stringify({ conversationId: conversation.id }),
      false
    );
    
    await participantUser.save();
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true, 
      conversation: {
        id: conversation.id,
        name: conversation.name,
        type: conversation.type,
        participants: conversation.participants,
        createdAt: conversation.createdAt
      }
    }),
  };
};

const handleEditConversation = async (requestBody: any) => {
  const { username, token, conversationId, name, isEncrypted, pinned } = requestBody;
  
  // Validate required fields
  if (!username || !token || !conversationId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the conversation
  const conversation = await ConversationModel.findOne({ id: conversationId });
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Check if user is a participant with admin rights
  const participantIndex = conversation.participants.findIndex(
    (p: any) => p.userId === user.id && p.role === 'admin'
  );
  
  if (participantIndex === -1) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not authorized to edit this conversation' }),
    };
  }
  
  // Update conversation fields if provided
  if (name !== undefined) conversation.name = name;
  if (isEncrypted !== undefined) conversation.isEncrypted = isEncrypted;
  if (pinned !== undefined) conversation.pinned = pinned;
  
  await conversation.save();
  
  // Update the conversation name in all participants' chat lists
  if (name !== undefined) {
    const participantIds = conversation.participants.map((p: any) => p.userId);
    const participants = await User.find({ id: { $in: participantIds } });
    
    for (const participant of participants) {
      for (let i = 0; i < participant.data.chats.length; i++) {
        if (participant.data.chats[i].chatId === conversationId) {
          participant.data.chats[i].chatName = name;
          participant.data.updatedChats = true;
          break;
        }
      }
      await participant.save();
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      conversation: {
        id: conversation.id,
        name: conversation.name,
        isEncrypted: conversation.isEncrypted,
        pinned: conversation.pinned
      }
    }),
  };
};

const handleSendMessage = async (requestBody: any) => {
  const { username, token, conversationId, content, metadata } = requestBody;
  
  // Validate required fields
  if (!username || !token || !conversationId || !content) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the conversation
  const conversation = await ConversationModel.findOne({ id: conversationId });
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Check if user is a participant
  const isParticipant = conversation.participants.some(
    (p: any) => p.userId === user.id && p.isActive
  );
  
  if (!isParticipant) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not a participant in this conversation' }),
    };
  }
  
  // Create and save the message
  const message = new MessageModel({
    conversationId,
    senderId: user.id,
    content,
    metadata: metadata || {},
  });
  
  await message.save();
  
  // Update the conversation's lastActive and lastMessage
  conversation.lastActive = new Date();
  conversation.lastMessage = {
    content,
    senderId: user.id,
    timestamp: message.timestamp,
  };
  
  await conversation.save();
  
  // Notify other participants about the new message
  const participantIds = conversation.participants
    .filter((p: any) => p.userId !== user.id && p.isActive)
    .map((p: any) => p.userId);
  
  const participants = await User.find({ id: { $in: participantIds } });
  
  for (const participant of participants) {
    // Update their chat information
    for (let i = 0; i < participant.data.chats.length; i++) {
      if (participant.data.chats[i].chatId === conversationId) {
        participant.data.chats[i].newMessages = true;
        participant.data.updatedChats = true;
        break;
      }
    }
    
    await participant.save();
    
    // Optional: Send notification for new message
    await sendNotification(
      user,
      participant,
      `New message from ${username}`,
      'newMessage',
      JSON.stringify({ 
        conversationId,
        messageId: message.id,
        preview: content.slice(0, 50) + (content.length > 50 ? '...' : '')
      }),
      false
    );
    
    await participant.save();
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      message: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        timestamp: message.timestamp
      }
    }),
  };
};

const handleEditMessage = async (requestBody: any) => {
  const { username, token, messageId, content } = requestBody;
  
  // Validate required fields
  if (!username || !token || !messageId || !content) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the message
  const message = await MessageModel.findOne({ id: messageId });
  if (!message) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Message not found' }),
    };
  }
  
  // Check if user is the sender
  if (message.senderId !== user.id) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not authorized to edit this message' }),
    };
  }
  
  // Store edit history
  if (!message.editHistory) message.editHistory = [];
  message.editHistory.push({
    content: message.content,
    timestamp: new Date()
  });
  
  // Update the message
  message.content = content;
  message.edited = true;
  
  await message.save();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      message: {
        id: message.id,
        content: message.content,
        edited: message.edited,
        editHistory: message.editHistory
      }
    }),
  };
};

const handleDeleteMessage = async (requestBody: any) => {
  const { username, token, messageId, hardDelete = false } = requestBody;
  
  // Validate required fields
  if (!username || !token || !messageId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the message
  const message = await MessageModel.findOne({ id: messageId });
  if (!message) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Message not found' }),
    };
  }
  
  // Check if user is the sender
  if (message.senderId !== user.id) {
    // Find the conversation to check if user is admin
    const conversation = await ConversationModel.findOne({ id: message.conversationId });
    if (!conversation) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Conversation not found' }),
      };
    }
    
    const isAdmin = conversation.participants.some(
      (p: any) => p.userId === user.id && p.role === 'admin'
    );
    
    if (!isAdmin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Not authorized to delete this message' }),
      };
    }
  }
  
  if (hardDelete) {
    // Completely remove the message
    await MessageModel.deleteOne({ id: messageId });
  } else {
    // Mark as deleted but keep the record
    message.deleted = true;
    message.content = "[This message has been deleted]";
    await message.save();
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      hardDeleted: hardDelete
    }),
  };
};

const handleGetMessages = async (requestBody: any) => {
  const { username, token, conversationId, limit = 50, before, after } = requestBody;
  
  // Validate required fields
  if (!username || !token || !conversationId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the conversation (only fetch metadata, not messages)
  const conversation = await ConversationModel.findOne(
    { id: conversationId },
    { participants: 1, id: 1 }
  );
  
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Check if user is a participant
  const participantInfo = conversation.participants.find(
    (p: any) => p.userId === user.id
  );
  
  if (!participantInfo) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not a participant in this conversation' }),
    };
  }
  
  // Build the query
  const query: any = { conversationId };
  
  if (before) {
    const beforeMessage = await MessageModel.findOne({ id: before }, { timestamp: 1 });
    if (beforeMessage) {
      query.timestamp = { $lt: beforeMessage.timestamp };
    }
  }
  
  if (after) {
    const afterMessage = await MessageModel.findOne({ id: after }, { timestamp: 1 });
    if (afterMessage) {
      query.timestamp = { ...(query.timestamp || {}), $gt: afterMessage.timestamp };
    }
  }
  
  // Get messages with pagination - now we're explicitly requesting message content
  const messages = await MessageModel.find(query)
    .sort({ timestamp: -1 })
    .limit(limit);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      messages: messages.reverse(),
      hasMore: messages.length === limit
    }),
  };
};

const handleMarkAsRead = async (requestBody: any) => {
  const { username, token, conversationId, messageId } = requestBody;
  
  // Validate required fields
  if (!username || !token || !conversationId || !messageId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the conversation
  const conversation = await ConversationModel.findOne({ id: conversationId });
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Update the last read message for the user
  let updated = false;
  for (let i = 0; i < conversation.participants.length; i++) {
    if (conversation.participants[i].userId === user.id) {
      conversation.participants[i].lastReadMessageId = messageId;
      updated = true;
      break;
    }
  }
  
  if (!updated) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not a participant in this conversation' }),
    };
  }
  
  await conversation.save();
  
  // Update user's chat to remove new message status
  for (let i = 0; i < user.data.chats.length; i++) {
    if (user.data.chats[i].chatId === conversationId) {
      user.data.chats[i].newMessages = false;
      break;
    }
  }
  
  await user.save();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

const handleGetUserConversations = async (requestBody: any) => {
  const { username, token } = requestBody;
  
  // Validate required fields
  if (!username || !token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Get all conversation IDs for this user
  const conversationIds = user.data.chats.map((chat: any) => chat.chatId);
  
  // Get only conversation metadata without messages - use projection to include only needed fields
  const conversations = await ConversationModel.find(
    { id: { $in: conversationIds } },
    {
      id: 1,
      name: 1,
      type: 1,
      lastActive: 1,
      'lastMessage.content': 1,
      'lastMessage.senderId': 1,
      'lastMessage.timestamp': 1,
      'participants.userId': 1,
      'participants.role': 1,
      'participants.isActive': 1,
      'participants.joinedAt': 1,
      isEncrypted: 1,
      pinned: 1,
      createdAt: 1
    }
  );
  
  // Reset the updatedChats flag
  user.data.updatedChats = false;
  await user.save();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      conversations: conversations.map(conv => ({
        id: conv.id,
        name: conv.name,
        type: conv.type,
        lastActive: conv.lastActive,
          lastMessage: conv.lastMessage,
        // @ts-expect-error because i said so
        participants: conv.participants.map(p => ({
          userId: p.userId,
          role: p.role,
          isActive: p.isActive,
          joinedAt: p.joinedAt
        })),
        isEncrypted: conv.isEncrypted,
        pinned: conv.pinned,
        createdAt: conv.createdAt,
        // Include user-specific information from user.data.chats
        userInfo: user.data.chats.find((chat: any) => chat.chatId === conv.id)
      }))
    }),
  };
};

const handleAddParticipants = async (requestBody: any) => {
  const { username, token, conversationId, participants } = requestBody;
  
  // Validate required fields
  if (!username || !token || !conversationId || !participants || !Array.isArray(participants)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing or invalid' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the conversation
  const conversation = await ConversationModel.findOne({ id: conversationId });
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Check if user is admin
  const isAdmin = conversation.participants.some(
    (p: any) => p.userId === user.id && p.role === 'admin'
  );
  
  if (!isAdmin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not authorized to add participants' }),
    };
  }
  
  // Get current participant IDs
  const currentParticipantIds = conversation.participants.map((p: any) => p.userId);
  
  // Filter out participants who are already in the conversation
  const newParticipantIds = participants.filter((id: string) => !currentParticipantIds.includes(id));
  
  if (newParticipantIds.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'No new participants to add' }),
    };
  }
  
  // Make sure all new participants exist
  const newUsers = await User.find({ id: { $in: newParticipantIds } });
  
  if (newUsers.length !== newParticipantIds.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'One or more participants do not exist' }),
    };
  }
  
  // Add new participants to the conversation
  for (const newUserId of newParticipantIds) {
    conversation.participants.push({
      userId: newUserId,
      lastReadMessageId: null,
      joinedAt: new Date(),
      role: 'member',
      isActive: true,
    });
  }
  
  await conversation.save();
  
  // Update each new user's chat list and notify them
  const conversationData = {
    chatId: conversation.id,
    chatName: conversation.name,
    chatType: conversation.type,
    chatMembers: [...currentParticipantIds, ...newParticipantIds],
    newMessages: true,
  };
  
  for (const newUser of newUsers) {
    if (!newUser.data.chats) newUser.data.chats = [];
    newUser.data.chats.push(conversationData);
    newUser.data.updatedChats = true;
    
    // Notify the new participant
    await sendNotification(
      user,
      newUser,
      `${username} added you to ${conversation.type === 'direct' ? 'a conversation' : 'group ' + (conversation.name || 'chat')}`,
      'addedToConversation',
      JSON.stringify({ conversationId: conversation.id }),
      false
    );
    
    await newUser.save();
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      addedParticipants: newParticipantIds
    }),
  };
};

const handleRemoveParticipant = async (requestBody: any) => {
  const { username, token, conversationId, participantId } = requestBody;
  
  // Validate required fields
  if (!username || !token || !conversationId || !participantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the conversation
  const conversation = await ConversationModel.findOne({ id: conversationId });
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Allow self-removal or admin removal
  const isAdmin = conversation.participants.some(
    (p: any) => p.userId === user.id && p.role === 'admin'
  );
  
  const isSelfRemoval = participantId === user.id;
  
  if (!isAdmin && !isSelfRemoval) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not authorized to remove participants' }),
    };
  }
  
  // Find the participant to remove
  const participantIndex = conversation.participants.findIndex(
    (p: any) => p.userId === participantId
  );
  
  if (participantIndex === -1) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Participant not found in conversation' }),
    };
  }
  
  // Don't allow removing the last admin if you're not that admin
  if (conversation.participants[participantIndex].role === 'admin') {
    const adminCount = conversation.participants.filter((p: any) => p.role === 'admin').length;
    if (adminCount === 1 && !isSelfRemoval) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Cannot remove the only admin' }),
      };
    }
  }
  
  // Update participant status to inactive instead of completely removing
  conversation.participants[participantIndex].isActive = false;
  await conversation.save();
  
  // Remove the conversation from the participant's chat list
  const participant = await User.findOne({ id: participantId });
  if (participant) {
    participant.data.chats = participant.data.chats.filter(
      (chat: any) => chat.chatId !== conversationId
    );
    participant.data.updatedChats = true;
    
    // Notify the removed participant if it's not self-removal
    if (!isSelfRemoval) {
      await sendNotification(
        user,
        participant,
        `${username} removed you from ${conversation.type === 'direct' ? 'a conversation' : 'group ' + (conversation.name || 'chat')}`,
        'removedFromConversation',
        JSON.stringify({ conversationId: conversation.id }),
        false
      );
    }
    
    await participant.save();
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      message: isSelfRemoval ? 'Left conversation' : 'Participant removed'
    }),
  };
};

const handleAddReaction = async (requestBody: any) => {
  const { username, token, messageId, emoji } = requestBody;
  
  // Validate required fields
  if (!username || !token || !messageId || !emoji) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Required fields missing' }),
    };
  }
  
  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;
  
  // Find the message
  const message = await MessageModel.findOne({ id: messageId });
  if (!message) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Message not found' }),
    };
  }
  
  // Find the conversation to check if user is a participant
  const conversation = await ConversationModel.findOne({ id: message.conversationId });
  if (!conversation) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Conversation not found' }),
    };
  }
  
  // Check if user is a participant in the conversation
  const isParticipant = conversation.participants.some(
    (p: any) => p.userId === user.id && p.isActive
  );
  
  if (!isParticipant) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Not a participant in this conversation' }),
    };
  }
  
  // Check if the user already reacted with this emoji
  const existingReactionIndex = message.reactions.findIndex(
    (r: any) => r.userId === user.id && r.emoji === emoji
  );
  
  let action = '';
  
  if (existingReactionIndex !== -1) {
    // Remove the reaction if it already exists (toggle behavior)
    message.reactions.splice(existingReactionIndex, 1);
    action = 'removed';
  } else {
    // Add the new reaction
    message.reactions.push({
      userId: user.id,
      emoji,
      timestamp: new Date()
    });
    action = 'added';
  }
  
  await message.save();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      action,
      reactions: message.reactions
    }),
  };
};
