import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';

export const handler: Handler = async () => {
  // You could load this from environment variables or package.json in a real app
  const version = process.env.BACKEND_VERSION;
  console.log('Backend Version:', version);
  
  let dbVersion = 'unknown';
  let dbStatus = 'disconnected';
  
  try {
    // Connect to MongoDB
    const mongoose = await connectMongoDB();
    
    // Get MongoDB version using admin command
    // @ts-expect-error
    const admin = mongoose.connection.db.admin();
    const serverInfo = await admin.serverInfo();
    dbVersion = serverInfo.version;
    dbStatus = 'connected';
    
    console.log('MongoDB Version:', dbVersion);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    dbStatus = 'error';
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // For CORS support
    },
    body: JSON.stringify({ 
      version,
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        version: dbVersion
      }
    }),
  };
};


