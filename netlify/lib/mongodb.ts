import mongoose from 'mongoose';

// Define the interface for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Log MongoDB URI (omitting sensitive parts for security)
const redactedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USER]:[PASSWORD]@');
console.log(`MongoDB URI: ${redactedUri}`);

// Reset cached connection on startup to ensure fresh connection
let cached: MongooseCache = { conn: null, promise: null };
global.mongoose = cached;

async function connectMongoDB() {
  if (cached.conn) {
    // Check if the connection is still valid
    if (cached.conn.connection.readyState === 1) {
      console.log('Using existing MongoDB connection (connected)');
      return cached.conn;
    } else {
      console.log(`Connection is in state: ${mongoose.connection.readyState}, reconnecting...`);
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: true, // Enable buffer while connecting
      serverSelectionTimeoutMS: 30000, // Increase timeout for server selection
      connectTimeoutMS: 30000, // Increase timeout for initial connection
      socketTimeoutMS: 60000, // Increase timeout for operations
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 1, // Minimum number of connections in the pool
    };

    console.log('Starting new MongoDB connection...');
    
    cached.promise = mongoose.connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        
        // Set up connection event listeners
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
          cached.conn = null;
          cached.promise = null;
        });
        
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
          cached.conn = null;
          cached.promise = null;
        });
        
        mongoose.connection.on('connected', () => {
          console.log('MongoDB re-connected');
        });
        
        // Keep-alive ping every 30 seconds
        setInterval(() => {
          if (mongoose.connection.readyState === 1) {
            // @ts-expect-error
            mongoose.connection.db.admin().ping()
              .then(() => console.log('MongoDB ping successful'))
              .catch(err => console.error('MongoDB ping failed:', err));
          }
        }, 30000);
        
        return mongoose;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    console.log('Awaiting MongoDB connection promise...');
    cached.conn = await cached.promise;
    console.log(`MongoDB connection state: ${cached.conn.connection.readyState}`);
    
    if (cached.conn.connection.readyState !== 1) {
      throw new Error(`MongoDB connection not ready, state: ${cached.conn.connection.readyState}`);
    }
    
    // Test the connection with a ping
    // @ts-expect-error
    await cached.conn.connection.db.admin().ping();
    console.log('MongoDB connection verified with ping');
  } catch (error) {
    console.error('Error awaiting MongoDB connection:', error);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
  
  return cached.conn;
}

export default connectMongoDB;
