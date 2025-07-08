'use client';

import React from 'react';

// Generic function to handle source code download
export const handleDownloadSource = async (relativePath: string, fileName?: string) => {
  try {
    const baseGithubPath = 'https://raw.githubusercontent.com/lewishbass/nervous-energy/main/';
    const response = await fetch(`${baseGithubPath}${relativePath}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    const blob = new Blob([text], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Extract filename from path if not provided
    const defaultFileName = relativePath.split('/').pop() || 'sourcecode.tsx';
    a.download = fileName || defaultFileName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download source:', error);
    alert('Failed to download source code. Please try again later.');
  }
};

interface SourceButtonProps {
  relativePath: string;
  fileName?: string;
}

export const DownloadButton: React.FC<SourceButtonProps> = ({ relativePath, fileName }) => {
  return (
    <button
      onClick={() => handleDownloadSource(relativePath, fileName)}
      className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-y-[3px] transition-all duration-200 shadow-md select-none"
      style={{ background: "var(--kho)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-1 ml-1 -m-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm5 4H7v-2h10v2z" />
      </svg>
      Download Source
    </button>
  );
};

export const GitHubButton: React.FC<SourceButtonProps> = ({ relativePath }) => {
  const githubPath = `https://github.com/lewishbass/nervous-energy/tree/main/${relativePath}`;
  
  return (
    <a
      href={githubPath}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-y-[-4px] transition-all duration-200 shadow-md select-none"
      style={{ background: "var(--khb)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.021.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
      GitHub
    </a>
  );
};
