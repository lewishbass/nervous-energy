import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import User from '../models/User';  // Import the model directly, not the schema
import { validateUser, sanitizeUser } from '../lib/backendutils';

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export const handler: Handler = async (event) => {
   console.log('social handler called');
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
    // Connect to MongoDB - ensure we wait for connection to be ready
    console.log('Connecting to MongoDB...');
    const mongoose = await connectMongoDB();
    console.log('MongoDB connection established');
    
    if (requestBody.action === 'searchPeople') {
      console.log('Handling profile edit...');
      return await handlePeopleSearch(requestBody);
    }else if (requestBody.action === 'friendRequest') {
        console.log('Handling friend request...');
        return await handleFriendRequest(requestBody);
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

const handlePeopleSearch = async (requestBody: any) => {
    // Fetch all users username and last seen
    const { username_fragment, seen_limit, max_return } = requestBody;
    if(username_fragment && typeof username_fragment !== 'string') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid username_fragment' }),
        };
    }
    if(seen_limit && typeof seen_limit !== 'number') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid seen_limit' }),
        };
    }
    
    let query: any = {};
    if (username_fragment) 
        query.username = { $regex: username_fragment, $options: 'i' };
    
    if (seen_limit) 
        query.data.lastSeen = { $gt: new Date(Date.now() - seen_limit) };
    
    
    let findLimit = 10;
    if (max_return && typeof max_return === 'number')
        findLimit = Math.min(max_return, 50);

    let users = await User.find(query, 'username data.lastSeen').limit(findLimit).lean();
    for(const user of users) {
      user.lastSeen = user.data.lastSeen;
      delete user.data;
      console.log(user);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(users),
        };
}

const handleFriendRequest = async (requestBody: any) => {
    const {username, token, friendUsername } = requestBody;
    // Validate required fields
    const validation = await validateUser(username, token);
    if (validation.error !== "OK") {
        console.log(validation);
        return {
        statusCode: 401,
        body: JSON.stringify({ error: validation.error }),
        };
    }
    const user = validation.user;
    // Find the friend user
    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
        return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Friend not found' }),
        };
    }
    user.data.friends.push(friend.id);
    friend.data.friends.push(user.id);
    await user.save();
    await friend.save();
    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
    };
}