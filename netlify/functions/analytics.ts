import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import { SessionModel } from '../models/Session';

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export const handler: Handler = async (event) => {
	console.log("Analytics function invoked.");

	// Only allow POST requests
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ message: 'Method Not Allowed' }),
		};
	}

	// Parse the request body
	let requestBody;
	try {
		requestBody = JSON.parse(event.body || '{}');
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Invalid JSON in payload' }),
		};
	}

	// Extract IP and location data from Netlify headers
	const clientIp = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'unknown';
	const country = event.headers['x-country'] || 'unknown';
	const city = event.headers['x-city'] || 'unknown';
	const region = event.headers['x-region'] || 'unknown';
	const timezone = event.headers['x-timezone'] || 'unknown';

	// Append location data to request body
	requestBody.clientData = {
		ip: clientIp,
		country,
		city,
		region,
		timezone
	};

	// Fire-and-forget: process asynchronously without awaiting
	if (requestBody.action === 'track_event') {
		handleTrackEvent(requestBody).catch(err => console.error("Error tracking event:", err));
		return { statusCode: 204, body: '', };
	}
	else if (requestBody.action === 'session_metadata') {
		handleMetadata(requestBody).catch(err => console.error("Error handling session metadata:", err));
		return { statusCode: 204, body: '', };
	} else if (requestBody.action === 'get_session_ids') {
		return await handleGetSessionIds(requestBody);
	} else if (requestBody.action === 'get_session_info') {
		return await handleGetSessionInfo(requestBody);
	}

	return {
		statusCode: 404,
		body: JSON.stringify({ message: 'Path not found' }),
	};
};

async function handleTrackEvent(requestBody: any) {
	const { event, properties, sessionId, clientData } = requestBody;
	if (!event || !sessionId) return;

	await connectMongoDB();

	const eventDoc = {
		sessionId,
		eventType: event,
		timestamp: new Date(),
		data: properties || {},
	};

	// Upsert session and push event to events array
	await SessionModel.findOneAndUpdate(
		{ sessionId },
		{
			$setOnInsert: {
				sessionId,
				startTime: new Date(),
				ip: clientData?.ip,
				country: clientData?.country,
				city: clientData?.city,
				region: clientData?.region,
			},
			$push: { events: eventDoc },
		},
		{ upsert: true, new: true }
	);
}

async function handleMetadata(requestBody: any) {
	const { metadata, sessionId, clientData } = requestBody;
	if (!sessionId || !metadata) return;

	await connectMongoDB();

	// Parse screen size and viewport into arrays
	const parseSize = (size: string): number[] | undefined => {
		if (!size) return undefined;
		const parts = size.split('x').map(Number);
		return parts.length === 2 && parts.every(n => !isNaN(n)) ? parts : undefined;
	};

	await SessionModel.findOneAndUpdate(
		{ sessionId },
		{
			$setOnInsert: {
				sessionId,
				startTime: new Date(),
			},
			$set: {
				ip: clientData?.ip,
				country: clientData?.country,
				city: clientData?.city,
				region: clientData?.region,
				userAgent: metadata.userAgent,
				browser: metadata.browser,
				os: metadata.os,
				device: metadata.device,
				screenSize: parseSize(metadata.screenSize),
				viewport: parseSize(metadata.viewport),
				language: metadata.language,
				timezone: metadata.timezone || clientData?.timezone,
				source: metadata.source,
			},
		},
		{ upsert: true, new: true }
	);
}

async function handleGetSessionIds(requestBody: any) {
	const { limit = 100 } = requestBody;
	await connectMongoDB();

	const sessions = await SessionModel.find({})
		.sort({ startTime: -1 })
		.limit(limit)
		.select('sessionId')
		.lean();

	const idArray = sessions.map(session => session.sessionId);

	return {
		statusCode: 200,
		body: JSON.stringify(idArray)
	};
}

async function handleGetSessionInfo(requestBody: any) {
	const { sessionIds } = requestBody;
	if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'sessionIds must be a non-empty array' }),
		};
	}
	await connectMongoDB();

	const sessions = await SessionModel.find({
		sessionId: { $in: sessionIds }
	}).lean();

	return {
		statusCode: 200,
		body: JSON.stringify(sessions)
	}
}


