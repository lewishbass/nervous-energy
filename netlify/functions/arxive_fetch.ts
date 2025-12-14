import { Handler } from '@netlify/functions';
import { DOMParser } from '@xmldom/xmldom';
import Article from '../models/Article'; // Ensure the model is imported
import { v4 as uuidv4 } from 'uuid';
import connectMongoDB from '../lib/mongodb';

export const handler: Handler = async (event) => {

	// Only allow POST method
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: 'Method not allowed' }),
		};
	}

	let requestBody;
	try {
		requestBody = JSON.parse(event.body || '{}');
	} catch (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Invalid JSON payload' }),
		};
	}

	const { arxivId } = requestBody;
	if (!arxivId) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing arxivId' }),
		};
	}
	let title, authors, abstract, pdfUrl;

	try {
		// Connect to MongoDB - ensure we wait for connection to be ready
		console.log('Connecting to MongoDB...');
		const mongoose = await connectMongoDB();
		console.log('MongoDB connection established');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		};
	}

	try {
		const response = await fetchAndCache(arxivId);
		if (!response) {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: 'Article not found' }),
			};
		}
		({ title, authors, abstract, pdfUrl } = response);
	} catch (error) {
		console.error("Error fetching article:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		};
	}

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*' // For CORS support
		},
		body: JSON.stringify({
			title,
			authors,
			abstract,
			pdfUrl
		})
	};
}

type ArticleData = {
	title: string;
	authors: [string] | undefined;
	abstract: string | undefined;
	pdfUrl: string | undefined;
	arxivId?: string;
} | null;

async function fetchAndCache(arxivId: string) {
	// First, try to fetch from local DB
	let article = await fetchFromLocalDB(arxivId);
	if (article) {
		return article;
	}
	// If not found, fetch from arXiv API
	article = await fetchFromArxiv(arxivId);
	if (article) {
		// Save to local DB for future requests
		saveToLocalDB(article);
		return article;
	}
	return null;
}

async function fetchFromArxiv(arxivId: string): Promise<ArticleData> {
	const response = await fetch(`https://export.arxiv.org/api/query?id_list=${arxivId}`);
	if (!response.ok) {
		console.error(`arXiv API request failed with status ${response.status}`);
		return null;
	}

	const data = await response.text();
	// Parse the XML response
	const parser = new DOMParser();
	const xml = parser.parseFromString(data, "text/xml");
	const entry = xml.getElementsByTagName("entry")[0];
	if (!entry || !entry.getElementsByTagName("title")[0]?.textContent) {
		console.error('No entry found for the given arxivId');
		return null;
	}
	const title = entry.getElementsByTagName("title")[0]?.textContent || "No title available";
	const authorsString = Array.from(entry.getElementsByTagName("author")).map(author => author.getElementsByTagName("name")[0]?.textContent).filter(name => name).join(", ") || "No authors available";
	const abstract = entry.getElementsByTagName("summary")[0]?.textContent || "No abstract available";
	const pdfUrl = Array.from(entry.getElementsByTagName("link")).find(link => link.getAttribute("title") === "pdf")?.getAttribute("href") || "";
	const authors = authorsString ? authorsString.split(", ").map(name => name.trim()) : undefined;
	return { title, authors: authors as [string] | undefined, abstract, pdfUrl, arxivId };
}

async function fetchFromLocalDB(arxivId: string): Promise<ArticleData> {
	try {
		const existing = await Article.findOne({ arxivId });
		if (!existing) return null;
		return {
			title: existing.title as string,
			authors: existing.authors as [string] | undefined,
			abstract: existing.abstract as string | undefined,
			pdfUrl: existing.pdfUrl as string | undefined,
			arxivId: existing.arxivId as string | undefined,
		};
	} catch (error) {
		console.error("Error fetching article from local DB:", error);
		return null;
	}
}

async function saveToLocalDB(data: ArticleData) {
	if (!data) return;
	const article = new Article({
		id: uuidv4(),
		title: data.title,
		authors: data.authors,
		abstract: data.abstract,
		arxivId: data.arxivId,
		pdfUrl: data.pdfUrl,
	});
	try {
		await article.save();
		console.log(`Article (${data.title}) saved to local DB`);
	} catch (error) {
		console.error("Error saving article to local DB:", error);
	}
}

