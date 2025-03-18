import jwt from 'jsonwebtoken';
import User from '../models/User';

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export async function validateUser(username: string, token: string) {
  // Find user by username
  const user = await User.findOne({ username });
  if (!user) 
    return {user:null, error:"User not found"};
  // Verify JWT token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    if (decoded.username !== username) {
      return {user:null, error:"Token username mismatch"};
    }
  }
  catch (error) {
    return {user:null, error:"Invalid token"};
  }
  return {user:user, error:"OK"};
}

export function sanitizeUser(user: any, auth: "public" | "friend" | "self") {
  // Base user object with information available to all (public)
  const sanitizedUser = {
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
    };
  }

  // Add self level information (all data)
  if (auth === "self") {
    // @ts-expect-error user info is dynamically typed
    sanitizedUser.id = user.id;
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
