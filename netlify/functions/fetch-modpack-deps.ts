import type { Handler } from '@netlify/functions';

const CURSEFORGE_API_KEY = process.env.CURSEFORGE_API_KEY;
const MODPACK_ID = 'YOUR_MODPACK_ID'; // Find this from your CurseForge URL

export const handler: Handler = async (event) => {
  try {
    // Fetch modpack info
    const modResponse = await fetch(`https://api.curseforge.com/v1/mods/${MODPACK_ID}`, {
      headers: {
        'x-api-key': CURSEFORGE_API_KEY!,
      },
    });
    const modData = await modResponse.json();
    
    // Get the latest file
    const latestFile = modData.data.latestFiles[0];
    
    // Fetch file details with dependencies
    const fileResponse = await fetch(
      `https://api.curseforge.com/v1/mods/${MODPACK_ID}/files/${latestFile.id}`,
      {
        headers: {
          'x-api-key': CURSEFORGE_API_KEY!,
        },
      }
    );
    const fileData = await fileResponse.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        dependencies: fileData.data.dependencies,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch dependencies' }),
    };
  }
};
