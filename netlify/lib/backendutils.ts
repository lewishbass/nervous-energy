import jwt from 'jsonwebtoken';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export async function validateUser(username: string, token: string) {
  // Find user by username
  const user = await User.findOne({ username });
  if (!user)
    return { user: null, error: "User not found" };
  // Verify JWT token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    if (decoded.username !== username) {
      return { user: null, error: "Token username mismatch" };
    }
  }
  catch (error) {
    return { user: null, error: "Invalid token" };
  }
  user.data.lastSeen = new Date();
  return { user: user, error: "OK" };
}

export function sanitizeUser(user: any, auth: "public" | "friend" | "self") {
  // Base user object with information available to all (public)
  const sanitizedUser = {
    id: user.id,
    username: user.username,
    profile: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      profilePicture: user.profile.profilePicture,
      bio: user.profile.bio,
    },
    data: {
      lastSeen: user.data.lastSeen,
    }
  };

  // Add friend level information
  if (auth === "friend" || auth === "self") {
    sanitizedUser.profile = {
      ...sanitizedUser.profile,
      // @ts-expect-error user info is dynamically typed
      location: user.profile.location,
    };
    sanitizedUser.data = {
      ...sanitizedUser.data,
      // @ts-expect-error user info is dynamically typed
      friends: user.data.friends,
      booksRead: user.data.booksRead,
    };
  }

  // Add self level information (all data)
  if (auth === "self") {
    // @ts-expect-error user info is dynamically typed
    sanitizedUser.createdAt = user.createdAt;
    sanitizedUser.profile = {
      ...sanitizedUser.profile,
      // @ts-expect-error user info is dynamically typed
      email: user.profile.email,
      birthday: user.profile.birthday,
    };
    sanitizedUser.data = {
      ...sanitizedUser.data,
      // @ts-expect-error user info is dynamically typed
      friendRequests: user.data.friendRequests,
      history: user.data.history,
      chats: user.data.chats,
      notifications: user.data.notifications,
    };
  }

  return sanitizedUser;
}

export type Notification = {
  timeStamp: Date;
  message: String;
  notificationType: String;
  data: String;
  read: boolean;
  id: String;
}

export async function sendNotification(sender: any, receiver: any, message: string, type: string, data: string, save: boolean = true) {
  // Find user by username
  let decoded_data = JSON.parse(data);
  decoded_data["sender"] = sender.id;
  const notification = {
    timeStamp: new Date(),
    message: message as String,
    notificationType: type as String,
    data: JSON.stringify(decoded_data) as String,
    read: false as Boolean,
    id: uuidv4() as String,
  };

  receiver.data.notifications.push(notification);

  receiver.data.newNotifications = true;
  if (save)
    await receiver.save();

  return { error: "OK" };
}

