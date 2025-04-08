import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import UserModel from './User';

// add schema for managing game lobbies and P2P connections
// since netlify serverless functions are stateless, this schema is used to manage game lobbies and P2P connections
// each lobby is game agnostic
// it handles establishing audio, text and game data connections, when users join and leave the lobby
// it also acts as a validation server for connections
//  - issues short term tokens used for P2P validation
//  - users periodically refresh these tokens

// Message schema
const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  conversationId: {
    type: String,
    required: true,
    ref: 'Conversation',
  },
  senderId: {
    type: String,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  attachments: [{
    type: String,
    url: String,
    fileType: String,
    filename: String,
    size: Number,
  }],
  reactions: [{
    userId: String,
    emoji: String,
    timestamp: Date,
  }],
  edited: {
    type: Boolean,
    default: false,
  },
  editHistory: [{
    content: String,
    timestamp: Date,
  }],
  deleted: {
    type: Boolean,
    default: false,
  },
  replyTo: {
    type: String,
    ref: 'Message',
    default: null,
  },
});

// Add indexes for better query performance
MessageSchema.index({ conversationId: 1, timestamp: -1 });
MessageSchema.index({ senderId: 1 });

// Conversation Schema
const ConversationSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: '',
  },
  convType: {
    type: String,
    enum: ['direct', 'group', 'channel'],
    default: 'direct',
  },
  participants: [{
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    lastReadMessageId: {
      type: String,
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  lastMessage: {
    content: String,
    senderId: String,
    timestamp: Date,
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Add indexes for better query performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ 'participants.userId': 1 });
ConversationSchema.index({ lastActive: -1 });

ConversationSchema.pre('save', async function (next) {
  const conversation = this;

  // Only proceed if lastMessage was modified
  if (conversation.isModified('lastMessage')) {
    try {
      // Get all active participants except the sender
      const participantsToUpdate = conversation.participants
        .filter(p => p.userId !== conversation.lastMessage?.senderId);

      if (participantsToUpdate.length > 0) {
        // Update newMessages flag for all participants
        await UserModel.updateMany(
          {
            id: { $in: participantsToUpdate.map(p => p.userId) },
            'data.chats.chatId': conversation.id
          },
          {
            $set: {
              'data.chats.$.newMessages': true,
              'data.updatedChats': true
            }
          }
        );
      }
    } catch (error) {
      console.error('Error in conversation pre-save hook:', error);
    }
  }

  next();
});

// Add pre-delete hook to remove conversation from users' chat lists
ConversationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const conversation = this;
    const participantIds = conversation.participants.map(p => p.userId);

    // Remove this conversation from all participants' chat lists
    await UserModel.updateMany(
      { id: { $in: participantIds } },
      {
        $pull: { 'data.chats': { chatId: conversation.id } },
        $set: { 'data.updatedChats': true }
      }
    );

    next();
  } catch (error) {
    console.error('Error in conversation pre-delete hook:', error);
    // @ts-expect-error next is not a function
    next(error);
  }
});

// Also handle deleteMany operations
ConversationSchema.pre('deleteMany', async function (next) {
  try {
    // Get the filter used in the deleteMany operation
    const filter = this.getFilter();

    // Find all conversations that match the filter
    const conversations = await mongoose.model('Conversation').find(filter, { id: 1, 'participants.userId': 1 });

    // For each conversation, update the users
    for (const conversation of conversations) {
      // @ts-expect-error type matches
      const participantIds = conversation.participants.map(p => p.userId);

      await UserModel.updateMany(
        { id: { $in: participantIds } },
        {
          $pull: { 'data.chats': { chatId: conversation.id } },
          $set: { 'data.updatedChats': true }
        }
      );
    }

    next();
  } catch (error) {
    console.error('Error in conversation pre-deleteMany hook:', error);
    // @ts-expect-error next is not a function
    next(error);
  }
});

const ConversationModel = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export { ConversationModel, MessageModel };
