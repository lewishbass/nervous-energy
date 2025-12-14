

import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import { validateUser } from '../lib/backendutils';
import { transcript } from '../lib/transcript';


// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

export const handler: Handler = async (event) =>{
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
	try{
		requestBody = JSON.parse(event.body || '{}');
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Invalid JSON in payload' }),
		};
	}

	try{
		// Connect to MongoDB - ensure connection is established
		const mongoose = await connectMongoDB();
		console.log("Connected to MongoDB");

		if(requestBody.action === 'fetch_transcript'){
			console.log("Handling fetch_transcript...");
			return await handleFetchTranscript(requestBody);
		}else if(requestBody.action === 'fetch_transcript_grades'){
			console.log("Handling fetch_transcript_grades...");
			return await handleFetchTranscriptGrades(requestBody);
		}
			return {
				statusCode: 404,
				body: JSON.stringify({ message: 'Path not found' }),
			};
		
	}catch (error){
		console.error("Error in transcript fetch function:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' }),
			message: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};

async function handleFetchTranscriptGrades(requestBody: any) {
	const { username , token } = requestBody;

	// Validate required fields
	if(!username || !token){
		console.log("Missing required fields in request body. Falling back to no grades.");
		return await handleFetchTranscript(requestBody);
	}

	// Validate token
	const validation = await validateUser(username, token);
	if(validation.error != "OK"){
		console.log("User validation failed. Falling back to no grades.");
		return await handleFetchTranscript(requestBody);
	}
	const user = validation.user;


	// load transcript from local file
	let transcriptData = transcript;
	console.log(transcriptData);

	return {
		statusCode: 200,
		body: JSON.stringify({ transcript: transcriptData }),
	};
}

async function handleFetchTranscript(requestBody: any) {
	
	// deep clone transcript data
	let transcriptData = JSON.parse(JSON.stringify(transcript));

	// remove grade data
	for(let semester of transcriptData){
		semester.academic_standing = null;
		semester.passed_hours = null;
		semester.earned_hours = null;
		semester.gpa_hours = null;
		semester.quality_points = null;
		semester.term_gpa = null;
		semester.cumulative_gpa = null;
		for(let course of semester.classes){
			course.grade = null;
			course.quality_points = null;
		}
	}

	return {
		statusCode: 200,
		body: JSON.stringify({ transcript: transcriptData }),
	};
}
