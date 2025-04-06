import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
	console.log('keys handler called');
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

		// Route to appropriate handler based on action
		if (requestBody.action === 'finnhub') {
			console.log('Handling get finnhub key...');
			return await handleFinnHubKeyGet(requestBody);
		} 

		return {
			statusCode: 404,
			body: JSON.stringify({ error: 'Path not found' }),
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: 'Internal server error',
				message: error instanceof Error ? error.message : 'Unknown error'
			}),
		};
	}
};

const handleFinnHubKeyGet = async (requestBody: any) => {

	// Simulate fetching the key from a database or configuration file
	const finnhubKey = process.env.FINNHUB_API_KEY;

	if (!finnhubKey) {
		console.error('Finnhub key not found, env variable name: FINNHUB_API_KEY');
		console.error('Available env variables:', Object.keys(process.env).join(', '));
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Finnhub key not found' }),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify({ key: finnhubKey }),
	};
}
