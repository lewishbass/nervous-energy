import { Handler } from '@netlify/functions';
import connectMongoDB from '../lib/mongodb';
import { validateUser } from '../lib/backendutils';
import { transcript } from '../lib/transcript';


// JWT secret key should be in environment variables in production
const CURSEFORGE_API_KEY = process.env.CURSEFORGE_API_KEY;
const MODPACK_ID = '1399996';

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
		} else if (requestBody.action === 'fetch_mc_status') {
			console.log("Handling fetch_mc_status...");
			return await handleMCStatusFetch(requestBody);
		} else if (requestBody.action === 'fetch_modpack_deps') {
			console.log("Handling fetch_modpack_deps...");
			return await handleModpackDepsFetch(requestBody);
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

async function handleMCStatusFetch(requestBody: any) {
	const { server_ip } = requestBody;
	try {
		const response = await fetch(`https://api.mcsrvstat.us/3/${server_ip}`);
		const data = await response.json();

		return {
			statusCode: 200,
			body: JSON.stringify({
				online: data.online || false,
				players: {
					online: data.players?.online || 0,
					max: data.players?.max || 0
				},
				version: data.version || 'Unknown',
				motd: data.motd?.clean?.[0] || ''
			}),
		};
	} catch (error) {
		console.error("Error fetching MC status:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				online: false,
				players: { online: 0, max: 0 }
			}),
		};
	}
}

async function handleModpackDepsFetch(requestBody: any) {
	if (!CURSEFORGE_API_KEY) {
		console.error("CurseForge API key not configured");
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'API key not configured' }),
		};
	}

	// Log API key presence (not the actual key for security)
	console.log(`API Key configured: Yes (length: ${CURSEFORGE_API_KEY.length})`);
	console.log(`API Key format check: ${CURSEFORGE_API_KEY.startsWith('$2a$') ? 'Valid format' : 'Unexpected format'}`);

	const headers = {
		'x-api-key': CURSEFORGE_API_KEY,
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': 'nervous-energy/1.0'
	};

	try {
		console.log(`Fetching modpack info for ID: ${MODPACK_ID}`);

		// Fetch modpack info
		const modResponse = await fetch(`https://api.curseforge.com/v1/mods/${MODPACK_ID}`, {
			method: 'GET',
			headers: headers,
		});

		console.log(`Modpack response status: ${modResponse.status}`);
		console.log(`Response headers:`, Object.fromEntries(modResponse.headers.entries()));

		if (!modResponse.ok) {
			const errorText = await modResponse.text();
			console.error(`CurseForge API error: Status ${modResponse.status}, Response: ${errorText || '(empty response)'}`);

			// If we get a 403, it's likely an API key issue
			if (modResponse.status === 403) {
				return {
					statusCode: 403,
					body: JSON.stringify({
						error: 'CurseForge API authentication failed. Please verify your API key is valid and has the correct permissions.',
						details: errorText || 'No additional details provided'
					}),
				};
			}

			throw new Error(`CurseForge API returned status ${modResponse.status}: ${errorText}`);
		}

		const modData = await modResponse.json();

		// Get the latest file
		const latestFile = modData.data.latestFiles[0];
		console.log(`Latest file ID: ${latestFile.id}`);

		// Fetch file details with dependencies
		const fileResponse = await fetch(
			`https://api.curseforge.com/v1/mods/${MODPACK_ID}/files/${latestFile.id}`,
			{
				method: 'GET',
				headers: headers,
			}
		);

		if (!fileResponse.ok) {
			const errorText = await fileResponse.text();
			console.error(`CurseForge API error fetching file: Status ${fileResponse.status}, Response: ${errorText}`);
			throw new Error(`CurseForge API returned status ${fileResponse.status}`);
		}

		const fileData = await fileResponse.json();

		// Fetch details for each dependency
		const dependencies = fileData.data.dependencies || [];
		console.log(`Found ${dependencies.length} total dependencies`);
		const requiredDeps = dependencies.filter((dep: any) => dep.relationType === 3);
		console.log(`Found ${requiredDeps.length} required dependencies`);

		const dependencyDetails = await Promise.all(
			requiredDeps.map(async (dep: any) => {
				try {
					const depResponse = await fetch(`https://api.curseforge.com/v1/mods/${dep.modId}`, {
						method: 'GET',
						headers: headers,
					});

					if (!depResponse.ok) {
						const errorText = await depResponse.text();
						console.error(`Failed to fetch dependency ${dep.modId}: Status ${depResponse.status}, Response: ${errorText}`);
						return null;
					}

					const depData = await depResponse.json();
					return {
						name: depData.data.name,
						slug: depData.data.slug,
						summary: depData.data.summary,
						downloadCount: depData.data.downloadCount,
						url: depData.data.links.websiteUrl,
					};
				} catch (error) {
					console.error(`Failed to fetch dependency ${dep.modId}:`, error);
					return null;
				}
			})
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				dependencies: dependencyDetails.filter(dep => dep !== null),
			}),
		};
	} catch (error) {
		console.error("Error fetching modpack dependencies:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: `Failed to fetch dependencies: ${error instanceof Error ? error.message : 'Unknown error'}` }),
		};
	}
}
