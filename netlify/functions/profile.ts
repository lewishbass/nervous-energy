import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import User from '../models/User';  // Import the model directly, not the schema

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export const handler: Handler = async (event) => {
   console.log('Profile handler called');
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

  console.log(requestBody);
  
  try {
    // Connect to MongoDB - ensure we wait for connection to be ready
    console.log('Connecting to MongoDB...');
    const mongoose = await connectMongoDB();
    console.log('MongoDB connection established');
    
    if (requestBody.action === 'set') {
      console.log('Handling profile edit...');
      return await handleProfileEdit(requestBody);
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


async function handleProfileEdit(requestBody: any) {
  const { username, token, updates } = requestBody;

  // Validate required fields
  if (!username || !token ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and password are required' }),
    };
  }

  // Find user by username
  const user = await User.findOne({ username });
  
  if (!user) {
    console.log('User not found');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'User not found' }),
    };
  }

  // Verify JWT token
  try {
    const decoded = require('jsonwebtoken').verify(token, JWT_SECRET);
    if (decoded.username !== username) {
      console.log('Token username mismatch');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token' }),
      };
    }
  } catch (error) {
    console.log('Invalid token: ', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }

  // Update field in user profile
   const updateFields = Object.keys(updates);
   const allowedUpdates = ['firstName', 'lastName', 'email', 'bio', 'profilePicture', 'location', 'birthday'];

   const isValidOperation = updateFields.every((updateField) => allowedUpdates.includes(updateField));

   if (!isValidOperation) {
      return {
         statusCode: 400,
         body: JSON.stringify({ error: 'Invalid updates!' }),
      };
   }

   try {
      updateFields.forEach((updateField) => {
         user.profile[updateField] = updates[updateField];
      });
   } catch (e: any) {
      return {
         statusCode: 400,
         body: JSON.stringify({ error: 'Bad request' }),
      };
   }

  // Update last seen timestamp
  user.profile.lastSeen = new Date();
  await user.save();

  // Return success
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
}

