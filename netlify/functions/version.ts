import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  // You could load this from environment variables or package.json in a real app
  const version = process.env.BACKEND_VERSION;
  console.log('Version:', version);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // For CORS support
    },
    body: JSON.stringify({ 
      version,
      environment: process.env.NODE_ENV || 'development'
    }),
  };
};
