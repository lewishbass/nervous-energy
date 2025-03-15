import { Handler } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import connectMongoDB from '../lib/mongodb';
import User from '../models/User';  // Import the model directly, not the schema

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export const handler: Handler = async (event) => {
  
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

  // Get the auth path (login or register)
  const path = event.path.split('/').pop();
  
  try {
    // Connect to MongoDB - ensure we wait for connection to be ready
    console.log('Connecting to MongoDB...');
    const mongoose = await connectMongoDB();
    console.log('MongoDB connection established');

    // Check if the User collection exists and is valid
    // No need to check for collection existence here as mongoose
    // will handle collection creation when needed
    
    // Handle registration
    if (path === 'register') {
      return await handleRegistration(requestBody);
    }
    if (path === 'login') {
      return await handleLogin(requestBody);
    }
    if (path === 'user-exists'){
      return await handleUserExists(requestBody);
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Path not found' }),
    };    

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

async function handleUserExists(requestBody: any) {
  const { username } = requestBody;
  const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  var username_suggestion = null;
  if(existingUser){
    for (let i = 1; i < 100; i++) {
      const suggestedUsername = `${username}${i}`;
      const existingSuggestion = await User.findOne({ username: { $regex: new RegExp(`^${suggestedUsername}$`, 'i') } });
      if (!existingSuggestion) {
        username_suggestion = suggestedUsername;
        break;
      }
    }
  }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      exists: !!existingUser,
      suggestion: username_suggestion
     }),
  }
}
  

async function handleLogin(requestBody: any) {
  const { username, password } = requestBody;

  // Validate required fields
  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and password are required' }),
    };
  }

  // Find user by username
  const user = await User.findOne({ username });
  
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid credentials' }),
    };
  }

  // Compare passwords
  const passwordMatch = await require('bcrypt').compare(password, user.password);

  if (!passwordMatch) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid credentials' }),
    };
  }

  // Update last seen timestamp
  user.profile.lastSeen = new Date();
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Return success with token
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        profile: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          email: user.profile.email,
          profilePicture: user.profile.profilePicture,
          location: user.profile.location
        }
      }
    }),
  };
}

async function handleRegistration(requestBody: any) {
  const { username, password, profile = {} } = requestBody;

  // Validate required fields
  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and password are required' }),
    };
  }
  // Check if username already exists
  const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
  if (existingUser) {
    return {
      statusCode: 409, // Conflict
      body: JSON.stringify({ error: 'Username already exists' }),
    };
  }

  // Create new user
  try {
    const newUser = new User({
      id: uuidv4(), // Generate unique ID
      username,
      password, // Will be hashed by pre-save hook
      profile: {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        bio: profile.bio || '',
        profilePicture: profile.profilePicture || '',
        location: profile.location || '',
        birthday: profile.birthday || null,
        lastSeen: new Date(),
      },
      data: {
        friends: [],
        friendRequests: [],
        history: [],
        chats: [],
        notifications: [],
      },
    });

    // Save the new user
    await newUser.save();

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        username: newUser.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 201, // Created
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          profile: {
            firstName: newUser.profile.firstName,
            lastName: newUser.profile.lastName,
            email: newUser.profile.email,
            profilePicture: newUser.profile.profilePicture,
            location: newUser.profile.location
          }
        }
      }),
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to register user' }),
    };
  }
}
