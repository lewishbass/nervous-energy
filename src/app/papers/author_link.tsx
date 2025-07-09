'use client';

import { useState } from 'react';
import { FaUser, FaUserGraduate, FaUserTie, FaUserCog, FaUserSecret } from 'react-icons/fa';

interface AuthorLinkProps {
  name: string;
  url?: string;
  imageUrl?: string;
}

const authorIcons = [FaUser, FaUserGraduate, FaUserTie, FaUserSecret];

export default function AuthorLink({ name, url, imageUrl }: AuthorLinkProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate a consistent icon based on the author's name
  const iconIndex = Math.floor(Math.random()*authorIcons.length)//;name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % authorIcons.length;
  const IconComponent = authorIcons[iconIndex];

  const content = (
    <div className="flex items-center space-x-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      {imageUrl && !imageError ? (
        <img 
          src={imageUrl} 
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <IconComponent className="w-4 h-4 tc1" />
        </div>
      )}
      <span className="tc2 hover:tc1 transition-colors">{name}</span>
    </div>
  );

  if (url) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}
