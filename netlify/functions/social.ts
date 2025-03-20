import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import User from '../models/User';  // Import the model directly, not the schema
import { validateUser, sanitizeUser, sendNotification } from '../lib/backendutils';

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
      console.log('Handling people search...');
      return await handlePeopleSearch(requestBody);
    } else if (requestBody.action === 'friendRequest') {
      console.log('Handling friend request...');
      return await handleFriendRequest(requestBody);
    } else if (requestBody.action === 'getFriendshipStatus') {
      console.log('Handling friendship status request...');
      return await handleFriendshipStatus(requestBody);
    } else if (requestBody.action === 'acceptFriendRequest') {
      console.log('Handling accept friend request...');
      return await handleAcceptFriendRequest(requestBody);
    } else if (requestBody.action === 'rescindFriendRequest') {
      console.log('Handling rescind friend request...');
      return await handleRescindFriendRequest(requestBody);
    } else if (requestBody.action === 'removeFriend') {
      console.log('Handling remove friend...');
      return await handleRemoveFriend(requestBody);
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
  if (username_fragment && typeof username_fragment !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid username_fragment' }),
    };
  }
  if (seen_limit && typeof seen_limit !== 'number') {
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

  let users = await User.find(query, 'username data.lastSeen id').limit(findLimit).lean();
  for (const user of users) {
    user.lastSeen = user.data.lastSeen;
    delete user.data;
    // Keep _id for friendship status checks
    console.log(user);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
}

const handleFriendRequest = async (requestBody: any) => {
  const { username, token, friendId } = requestBody;

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

  // Find friend user by ID
  const friend = await User.findOne({ id: friendId });
  if (!friend) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Friend not found' }),
    };
  }

  if (user.data.friends.includes(friend.id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Already friends' }),
    };
  }

  // check if friend request already exists
  if (user.data.pendingFriends.includes(friend.id) || friend.data.friendRequests.includes(user.id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Friend request already exists' }),
    };
  }

  // Send notification
  const sent = await sendNotification(
    user,
    friend,
    `Friend request from ${username}`,
    'friendRequest',
    JSON.stringify({ senderId: user.id }),
    false
  );
  if (sent.error !== "OK") {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: sent.error }),
    };
  }

  // Update pending friends and friend requests
  user.data.pendingFriends.push(friend.id);
  await user.save();
  friend.data.friendRequests.push(user.id);
  await friend.save();

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

const handleFriendshipStatus = async (requestBody: any) => {
  const { username, token } = requestBody;

  // Validate the user
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;

  // Return friendship status data
  return {
    statusCode: 200,
    body: JSON.stringify({
      friends: user.data.friends,
      pendingFriends: user.data.pendingFriends,
      friendRequests: user.data.friendRequests
    }),
  };
};

const handleAcceptFriendRequest = async (requestBody: any) => {
  const { username, token, friendId } = requestBody;

  // Validate required fields
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;

  // Find friend user by ID
  const friend = await User.findOne({ id: friendId });
  if (!friend) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Friend not found' }),
    };
  }

  // Check if there's a pending request to accept
  if (!user.data.friendRequests.includes(friend.id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No friend request from this user' }),
    };
  }

  // Add each other to friends lists
  user.data.friends.push(friend.id);
  friend.data.friends.push(user.id);

  // Remove from pending and request lists
  user.data.friendRequests = user.data.friendRequests.filter((id: string) => id.toString() !== friend.id.toString());
  friend.data.pendingFriends = friend.data.pendingFriends.filter((id: string) => id.toString() !== user.id.toString());

  // Save both users
  await user.save();
  await friend.save();

  // Send notification to the other user that request was accepted
  await sendNotification(
    user,
    friend,
    `${username} accepted your friend request`,
    'friendRequestAccepted',
    JSON.stringify({ senderId: user.id }),
    false
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

const handleRescindFriendRequest = async (requestBody: any) => {
  const { username, token, friendId } = requestBody;

  // Validate required fields
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;

  // Find friend user by ID
  const friend = await User.findOne({ id: friendId });
  if (!friend) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Friend not found' }),
    };
  }

  // Check if there's a pending request to rescind
  if (!user.data.pendingFriends.includes(friend.id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No pending friend request to this user' }),
    };
  }

  // Remove from pending and request lists
  user.data.pendingFriends = user.data.pendingFriends.filter((id: string) => id.toString() !== friend.id.toString());
  friend.data.friendRequests = friend.data.friendRequests.filter((id: string) => id.toString() !== user.id.toString());

  // Save both users
  await user.save();
  await friend.save();

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

const handleRemoveFriend = async (requestBody: any) => {
  const { username, token, friendId } = requestBody;

  // Validate required fields
  const validation = await validateUser(username, token);
  if (validation.error !== "OK") {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: validation.error }),
    };
  }
  const user = validation.user;

  // Find friend user by ID
  const friend = await User.findOne({ id: friendId });
  if (!friend) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Friend not found' }),
    };
  }

  // Check if they are actually friends
  if (!user.data.friends.includes(friend.id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Not friends with this user' }),
    };
  }

  // Remove from each other's friends lists
  user.data.friends = user.data.friends.filter((id: string) => id.toString() !== friend.id.toString());
  friend.data.friends = friend.data.friends.filter((id: string) => id.toString() !== user.id.toString());

  // Save both users
  await user.save();
  await friend.save();

  // Optionally notify the other user
  await sendNotification(
    user,
    friend,
    `${username} has removed you from their friends list`,
    'friendRemoved',
    JSON.stringify({ senderId: user.id }),
    false
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};