import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import { validateUser } from '../lib/backendutils';

import AssignmentSubmission from '../models/AssignmentSubmission';
import { read } from 'node:fs';

const readSubmissionsWhitelist = ['Lewis']

export const handler: Handler = async (event) => {
	console.log("MSC fetch function invoked.");

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

	try {
		// Connect to MongoDB - ensure connection is established
		const mongoose = await connectMongoDB();
		console.log("Connected to MongoDB");

		if (requestBody.action === 'submit_assignment') {
			console.log("Handling submit_assignment...");
			return await handleSubmitAssignment(requestBody);
		}
		else if (requestBody.action === 'get_submitted_assignments') {
			console.log("Handling get_submitted_assignments...");
			return await getSubmittedAssignments(requestBody);
		}
		else if (requestBody.action === 'check_authorization') {
			console.log("Handling check_authorization...");
			return await checkUserAuthorization(requestBody);
		}
		else if (requestBody.action === 'get_data') {
			console.log("Handling get_data...");
			return await getSubmissionData(requestBody);
		}
		else if (requestBody.action === 'delete_submission') {
			console.log("Handling delete_submission...");
			return await deleteSubmission(requestBody);
		}
		return {
			statusCode: 404,
			body: JSON.stringify({ message: 'Path not found' }),
		};

	} catch (error) {
		console.error("Error in transcript fetch function:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' }),
			message: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};


async function handleSubmitAssignment(requestBody: any) {
	const { username, token, submissionData, className, assignmentName } = requestBody;

	// Validate required fields
	if (!username || !token || !submissionData || !className || !assignmentName) {
		console.log("Missing required fields.");
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'API missing required fields' }),
		};
	}

	// Validate token
	const validation = await validateUser(username, token);
	if (validation.error != "OK") {
		console.log("User validation failed.");
		return {
			statusCode: 401,
			body: JSON.stringify({ message: 'User validation failed' }),
		};
	}
	const user = validation.user;

	const submission = new AssignmentSubmission({
		username: user.username,
		userId: user.id,
		className,
		assignmentName,
		submissionData,
	});
	try {
		await submission.save();
		console.log("Assignment submission saved.");
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Assignment submission saved successfully' }),
		};
	} catch (error) {
		console.error("Error saving assignment submission:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Error saving assignment submission' }),
		};
	}
}

async function getSubmittedAssignments(requestBody: any) {
	const { username, token, className } = requestBody;

	// Validate required fields
	if (!username || !token || !className) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'API missing required fields' }),
		};
	}
	// Validate token
	const validation = await validateUser(username, token);
	if (validation.error != "OK") {
		return {
			statusCode: 401,
			body: JSON.stringify({ message: 'User validation failed' }),
		};
	}
	const user = validation.user;

	try {
		const submissions = await AssignmentSubmission.find({ userId: user.id, className }, 'assignmentName').exec();
		const nameArray = submissions.map(sub => sub.assignmentName);
		return {
			statusCode: 200,
			body: JSON.stringify({ assignmentNames: nameArray }),
		};
	} catch (error) {
		console.error("Error fetching assignment submissions:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: error instanceof Error ? error.message : 'Error fetching assignment submissions' }),
		};
	}

}

async function checkUserAuthorization(requestBody: any) {
	const { username, token } = requestBody;

	// Validate required fields
	if (!username || !token) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'API missing required fields' }),
		};
	}

	// Validate token
	const validation = await validateUser(username, token);
	if (validation.error != "OK") {
		return {
			statusCode: 401,
			body: JSON.stringify({ message: 'User validation failed' }),
		};
	}
	// check if user is in whitelist
	const user = validation.user;
	return {
		statusCode: 200,
		body: JSON.stringify({ authorized: readSubmissionsWhitelist.includes(user.username) }),
	};

}

async function getSubmissionData(requestBody: any) {
	const { username, token, queryOptions } = requestBody;

	// Validate required fields
	if (!username || !token || !queryOptions) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'API missing required fields' }),
		};
	}

	// Validate token
	const validation = await validateUser(username, token);
	if (validation.error != "OK") {
		return {
			statusCode: 401,
			body: JSON.stringify({ message: 'User validation failed' }),
		};
	}

	// check if user is in whitelist
	const user = validation.user;
	if (!readSubmissionsWhitelist.includes(user.username)) {
		return {
			statusCode: 403,
			body: JSON.stringify({ message: 'User not authorized to read submissions' }),
		};
	}

	// Build query based on queryOptions
	let query: any = {};

	if (queryOptions.className) {
		query.className = queryOptions.className;
	}
	if (queryOptions.assignmentName) {
		query.assignmentName = queryOptions.assignmentName;
	}
	if (queryOptions.username) {
		query.username = queryOptions.username;
	}
	if (queryOptions.userId) {
		query.userId = queryOptions.userId;
	}

	try {
		const submissions = await AssignmentSubmission.find(query).exec();
		return {
			statusCode: 200,
			body: JSON.stringify({
				submissions,
				count: submissions.length
			}),
		};
	} catch (error) {
		console.error("Error fetching submission data:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: error instanceof Error ? error.message : 'Error fetching submission data'
			}),
		};
	}
}

async function deleteSubmission(requestBody: any) {
	const { username, token, uuid, className, assignmentName } = requestBody;

	// Validate required fields
	if (!username || !token) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'API missing required fields' }),
		};
	}

	// Must provide either uuid OR (className AND assignmentName)
	if (!uuid && !(className && assignmentName)) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Must provide either uuid or (className and assignmentName)' }),
		};
	}

	// Validate token
	const validation = await validateUser(username, token);
	if (validation.error != "OK") {
		return {
			statusCode: 401,
			body: JSON.stringify({ message: 'User validation failed' }),
		};
	}

	// check if user is in whitelist
	const user = validation.user;
	if (!readSubmissionsWhitelist.includes(user.username)) {
		return {
			statusCode: 403,
			body: JSON.stringify({ message: 'User not authorized to delete submissions' }),
		};
	}

	try {
		let result;
		if (uuid) {
			// Delete by UUID
			result = await AssignmentSubmission.deleteOne({ id: uuid }).exec();
		} else {
			// Delete by className and assignmentName
			result = await AssignmentSubmission.deleteMany({ className, assignmentName }).exec();
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Deletion successful',
				deletedCount: result.deletedCount
			}),
		};
	} catch (error) {
		console.error("Error deleting submission:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: error instanceof Error ? error.message : 'Error deleting submission'
			}),
		};
	}
}