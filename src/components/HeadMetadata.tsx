'use client';

import { useEffect } from 'react';

export default function HeadMetadata() {
  useEffect(() => {
    // Set document metadata
    document.title = 'Nervous Energy';
    
    const setMetaTag = (name : string, content : string, isProp : boolean = false) => {
      const selector = isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(isProp ? 'property' : 'name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Keywords for SEO
    const keywords = [
      'Lewis Bass',
      'Lewis',
      'Bass',
      'Machine Learning',
      'AI',
      'resume',
      'portfolio',
      'Virginia Tech',
      'computer science',
      'software engineering',
      'digital services',
      'tech innovation'
    ];
    
    // Basic meta tags
    setMetaTag('description', 'Nervous Energy application');
    setMetaTag('keywords', keywords.join(', '));
    setMetaTag('viewport', 'width=device-width, initial-scale=1');
    setMetaTag('theme-color', '#000000');
    
    // Open Graph meta tags
    setMetaTag('og:title', 'Nervous Energy', true);
    setMetaTag('og:description', 'Nervous Energy application', true);
    setMetaTag('og:type', 'website', true);
    
    // Twitter meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'Nervous Energy');
    setMetaTag('twitter:description', 'Nervous Energy application');

    // Favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', '/favicon.ico');
  }, []);

  return null;
}
