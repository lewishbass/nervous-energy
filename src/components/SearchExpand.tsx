'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Types for props and search results
interface SearchResult {
  name: string;
  link: string;
  keyword: string;
  description: string;
  requireAuth: boolean;
}

interface SearchExpandProps {
  width?: number; // Initial width
  height?: number; // Height
  expandWidth?: number; // Width when expanded
  expandOffset?: number; // Offset when expanded
  searchRoute?: string; // Optional backend route for search
  searchDictionary?: SearchResult[]; // Optional dictionary of results
  placeholder?: string;
}


export default function SearchExpand({
  width = 40,
  height = 40,
  expandWidth = 300,
  expandOffset = -10,
  searchRoute,
  searchDictionary,
  placeholder = 'Search...'
}: SearchExpandProps) {
  const router = useRouter();
  const [isHardExpanded, setIsHardExpanded] = useState(false);
  const [isSoftExpanded, setIsSoftExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const isExpanded = isHardExpanded || isSoftExpanded;

  const { isLoggedIn } = useAuth();

  // Handle user typing in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If user is typing while in soft expanded mode, switch to hard expanded
    if (isSoftExpanded && !isHardExpanded && newValue.length > 0) {
      setIsHardExpanded(true);
      setIsSoftExpanded(false);
    }
  };
  
  // Handle click away
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isHardExpanded) {
        setIsHardExpanded(false);
        setIsSoftExpanded(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHardExpanded]);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  // Handle search term changes
  useEffect(() => {
    if (!isExpanded) return;
    
    // Cancel previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    if (searchDictionary) {
      // Filter from provided dictionary
      const results = searchDictionary.filter(item => 
        (item.name.toLowerCase().includes(searchTermLower) ||
          item.keyword.toLowerCase().includes(searchTermLower))
        && (!item.requireAuth || isLoggedIn)
      );
      setSearchResults(results);
      return;
    }
    
    if (searchRoute) {
      // Fetch from API
      const fetchResults = async () => {
        setIsLoading(true);
        abortControllerRef.current = new AbortController();
        
        try {
          const response = await fetch(`${searchRoute}?q=${encodeURIComponent(searchTerm)}`, {
            signal: abortControllerRef.current.signal
          });
          
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
          }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Search error:', error);
            }
        } finally {
          setIsLoading(false);
        }
      };
      
      const timer = setTimeout(fetchResults, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, isExpanded, searchDictionary, searchRoute]);
  
  // Store search in local storage and navigate
  const handleResultClick = (result: SearchResult) => {
    // Store in local storage
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updatedSearches = [
      { term: searchTerm, result: result.name, timestamp: Date.now() }, ...recentSearches
    ];
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Navigate
    router.push(result.link);
    setIsHardExpanded(false);
    setIsSoftExpanded(false);
    setSearchTerm('');
  };

  return (
    <div 
      ref={searchRef}
      className="bt2 wg relative"
      style={{
        width: isExpanded ? expandWidth : width,
        height: height,
        borderRadius: height / 2,
        transition: 'width 0.3s ease, margin 0.3s ease, translate 0.3s ease',
        translate: isExpanded ? expandOffset : 0,
        marginRight: isExpanded ? 100 : ''
      }}
      onMouseEnter={() => !isHardExpanded && setIsSoftExpanded(true)}
      onMouseLeave={() => !isHardExpanded && setIsSoftExpanded(false)}
      onClick={() => !isHardExpanded && setIsHardExpanded(true)}
    >
      <div className="flex items-center h-full px-3">
        <FaSearch 
          size={height * 0.5} 
          style={{ 
            minWidth: height * 0.5,
            marginLeft: isExpanded ? 0 : 'auto',
            marginRight: isExpanded ? 0 : 'auto',
            transition: 'margin 0.3s ease, opacity 0.3s ease',
            opacity: isExpanded ? 0.5 : 1
          }} 
        />
        
        <input 
          ref={inputRef}
          type="text" 
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="bg-transparent outline-none flex-grow"
          style={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            padding: isExpanded ? '0 8px' : 0,
            transition: 'opacity 0.2s ease, width 0.3s ease, padding 0.3s ease',
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}
        />
      </div>
      
      {/* Search results dropdown */}
      {isExpanded && searchTerm && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
          {searchResults.map((result, index) => (
            <div 
              key={`${result.name}-${index}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleResultClick(result)}
            >
              <div className="font-medium">{result.name}</div>
              {result.description && (
                <div className="text-sm text-gray-500">{result.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}