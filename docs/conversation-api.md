# Conversation API Documentation

This document explains the Conversation API endpoints and their functionality.

## Overview

The Conversation API handles messaging functionality including creating conversations, sending messages, and managing participants. All endpoints are accessed via POST requests to `/api/conv` with an action parameter that specifies the operation.

## Authentication

All endpoints require user authentication via the following parameters:
- `username`: The username of the user
- `token`: The authentication token

## Endpoints

### Create Conversation
Creates a new conversation with specified participants.

**Action:** `createConversation`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `participants`: Array of user IDs to include in the conversation
- `name` (optional): Name for the conversation
- `type` (optional): Type of conversation ('direct' or 'group', defaults to 'direct')

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "conversationId",
    "name": "Conversation Name",
    "type": "direct|group",
    "participants": [/* participant data */],
    "createdAt": "timestamp"
  }
}
```

### Edit Conversation
Edits conversation properties.

**Action:** `editConversation`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `conversationId`: ID of the conversation to edit
- `name` (optional): New name for the conversation
- `isEncrypted` (optional): Boolean indicating if the conversation is encrypted
- `pinned` (optional): Boolean indicating if the conversation is pinned

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "conversationId",
    "name": "Updated Name",
    "isEncrypted": true|false,
    "pinned": true|false
  }
}
```

### Send Message
Sends a message to a conversation.

**Action:** `sendMessage`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `conversationId`: ID of the conversation
- `content`: Message content
- `metadata` (optional): Additional metadata for the message

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "messageId",
    "conversationId": "conversationId",
    "senderId": "userId",
    "content": "Message content",
    "timestamp": "timestamp"
  }
}
```

### Edit Message
Edits a previously sent message.

**Action:** `editMessage`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `messageId`: ID of the message to edit
- `content`: New message content

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "messageId",
    "content": "Updated content",
    "edited": true,
    "editHistory": [/* edit history */]
  }
}
```

### Delete Message
Deletes a message.

**Action:** `deleteMessage`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `messageId`: ID of the message to delete
- `hardDelete` (optional): Boolean indicating if the message should be permanently deleted (defaults to false)

**Response:**
```json
{
  "success": true,
  "hardDeleted": true|false
}
```

### Get Messages
Retrieves messages from a conversation.

**Action:** `getMessages`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `conversationId`: ID of the conversation
- `limit` (optional): Maximum number of messages to retrieve (defaults to 50)
- `before` (optional): ID of message to get messages before
- `after` (optional): ID of message to get messages after

**Response:**
```json
{
  "success": true,
  "messages": [/* array of message objects */],
  "hasMore": true|false
}
```

### Mark as Read
Marks messages in a conversation as read.

**Action:** `markAsRead`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `conversationId`: ID of the conversation
- `messageId`: ID of the last read message

**Response:**
```json
{
  "success": true
}
```

### Get User Conversations
Retrieves all conversations for a user.

**Action:** `getUserConversations`

**Parameters:**
- `username`: User's username
- `token`: Authentication token

**Response:**
```json
{
  "success": true,
  "conversations": [/* array of conversation objects */]
}
```

### Add Participants
Adds participants to a conversation.

**Action:** `addParticipants`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `conversationId`: ID of the conversation
- `participants`: Array of user IDs to add

**Response:**
```json
{
  "success": true,
  "addedParticipants": [/* array of user IDs */]
}
```

### Remove Participant
Removes a participant from a conversation.

**Action:** `removeParticipant`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `conversationId`: ID of the conversation
- `participantId`: ID of the user to remove

**Response:**
```json
{
  "success": true,
  "message": "Participant removed"|"Left conversation"
}
```

### Add Reaction
Adds or removes a reaction to a message.

**Action:** `addReaction`

**Parameters:**
- `username`: User's username
- `token`: Authentication token
- `messageId`: ID of the message
- `emoji`: The emoji reaction

**Response:**
```json
{
  "success": true,
  "action": "added"|"removed",
  "reactions": [/* array of reaction objects */]
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message"
}
```

Common error status codes:
- `400`: Bad request (missing or invalid parameters)
- `401`: Unauthorized (invalid authentication)
- `403`: Forbidden (not allowed to perform action)
- `404`: Not found (conversation or message not found)
- `405`: Method not allowed (non-POST request)
- `500`: Internal server error
