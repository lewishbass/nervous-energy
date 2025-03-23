import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
});

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
  type: {
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
  isEncrypted: {
    type: Boolean,
    default: false,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
});

const ConversationModel = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export { ConversationModel, MessageModel };
