import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import User from '../models/User';  // Import the model directly, not the schema
import { validateUser, sanitizeUser } from '../lib/backendutils';

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

  
  try {
    // Connect to MongoDB - ensure we wait for connection to be ready
    console.log('Connecting to MongoDB...');
    const mongoose = await connectMongoDB();
    console.log('MongoDB connection established');
    
    if (requestBody.action === 'set') {
      console.log('Handling profile edit...');
      return await handleProfileEdit(requestBody);
    } else if (requestBody.action === 'getSelf') {
      console.log('Handling self profile fetch...');
      return await handleSelfProfileFetch(requestBody);
    } else if (requestBody.action === 'get') {
      console.log('Handling profile fetch...');
      return await handleProfileFetch(requestBody);
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

async function handleProfileFetch(requestBody: any) {
  const { username, token, toFetch, isId } = requestBody;
  
  // Validate required fields
  if (!username || !token || !toFetch) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username, token, tofetch are required' }),
    };
  }
  if (!Array.isArray(toFetch)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'toFetch needs to be array of strings, got ' + typeof toFetch }),
    };
  }
  for (let i = 0; i < toFetch.length; i++) {
    if (typeof toFetch[i] !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'toFetch needs to be string or array of strings, got ' + typeof toFetch[i] + ' in position ' + i }),
      };
    }
  }  

  // Validate token
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    //console.log(validation);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;

  // Find users by username
  let users = [];
  if (isId && isId === true){
    console.log("Fetching by ID " + toFetch);
    users = await User.find({ id: { $in: toFetch } });
  }
  else{
    console.log("Fetching by username " + toFetch);
    users = await User.find({ username: { $in: toFetch } });
  }
  // Return public profile data using sanitizeUser
  
  const publicProfiles = users.map((fetchedUser) => sanitizeUser(fetchedUser, (fetchedUser.id === user.id) ? "self" : (fetchedUser.data.friends.includes(user.id) ? "friend" : "public")));

  /*for (let i = 0; i < publicProfiles.length; i++) {
    console.log(publicProfiles[i].username + " : " + publicProfiles[i].data.lastSeen);
  }*/

  return {
    statusCode: 200,
    body: JSON.stringify(publicProfiles),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
}

async function handleSelfProfileFetch(requestBody: any) {
  const { username, token } = requestBody;
  
  // Validate required fields
  if (!username || !token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and token are required' }),
    };
  }

  // Validate token
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    console.log(validation);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;

  // Return all profile data using sanitizeUser with "self" level
  return {
    statusCode: 200,
    body: JSON.stringify({user: sanitizeUser(user, "self")}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
}

async function handleProfileEdit(requestBody: any) {
  const { username, token, updates } = requestBody;

  // Validate required fields
  if (!username || !token ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and password are required' }),
    };
  }


  // Verify JWT token
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    console.log(validation);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }

  const user = validation.user;

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
  user.data.lastSeen = new Date();
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

