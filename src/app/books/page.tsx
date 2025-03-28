'use client';

// books/page.tsx tailwind, nodejs,
// loads book information from book_info.json
// display paragraph 1, author, year, genre and image on card
// when card is hovered, it expands to show all information and download button
// the card is selectable, when selected, stays expanded, and can navigate to other cards using arrow keys
// books and covers stored in public folder

import Image from 'next/image';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import bookData from './book_info.json';
import './books.css';

interface Book {
  paragraph1: string;
  paragraph2: string;
  author: string;
  year: number;
  title: string;
  ISBN: string;
  wordcount: number;
  genre: string;
  sold: string;
  good_score: number;
  n_good_ratings: number;
  trivia: string;
  cover_file: string;
  book_file: string;
  book_series?: string;
  reading_order?: string;
  kobo_link?: string;
  thriftbooks_link?: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [gridColumns, setGridColumns] = useState<number>(3); // Default to 3 columns
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);

  const dataRef = useRef<Book[]>([]); // Store the original data



  useEffect(() => {
    // Initialize books from the imported data
    const cleanedBooks: Book[] = bookData.map((book: Book) => ({
      author: book.author || 'N/A',
      title: book.title || 'N/A',
      year: Number(book.year),
      wordcount: Number(book.wordcount),
      good_score: Number(book.good_score),
      n_good_ratings: Number(book.n_good_ratings),
      sold: book.sold || 'N/A',
      ISBN: book.ISBN || 'N/A',
      book_series: book.book_series || undefined,
      reading_order: book.reading_order || undefined,
      trivia: book.trivia || 'N/A',
      paragraph1: book.paragraph1 || 'N/A',
      paragraph2: book.paragraph2 || 'N/A',
      genre: book.genre || 'N/A',
      cover_file: book.cover_file || 'N/A',
      book_file: book.book_file || 'N/A',
      kobo_link: book.kobo_link || undefined,
      thriftbooks_link: book.thriftbooks_link || undefined,
    }));
    console.log('Cleaned books:', cleanedBooks);

    setBooks(cleanedBooks);
    dataRef.current = cleanedBooks; // Store the original data
  }, []);

  useEffect(() => {
    // print book list when changed
    // dataRef.current = [...books]

  }, [books]);

  useEffect(() => {
    // Sort books when sortBy or sortOrder changes
    const sortedBooks = [...dataRef.current].sort((a, b) => {
      const valueA = a[sortBy as keyof Book];
      const valueB = b[sortBy as keyof Book];

      // Handle undefined values
      if (valueA === undefined) return sortOrder === 'asc' ? -1 : 1;
      if (valueB === undefined) return sortOrder === 'asc' ? 1 : -1;

      // Handle different data types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Convert to string for mixed types
      return sortOrder === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    // Update the books state with sorted array
    setBooks(sortedBooks);

    console.log(`Sorted books by ${sortBy} in ${sortOrder} order`);
    console.log('Sorted book titles:', sortedBooks.map((book: Book) => book.title).join('\n'));
  }, [sortBy, sortOrder]);

  useEffect(() => {
    // Detect grid layout based on screen size
    const updateGridColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setGridColumns(1); // Mobile: 1 column
      } else if (width < 1024) {
        setGridColumns(2); // Tablet: 2 columns
      } else {
        setGridColumns(3); // Desktop: 3 columns
      }
    };

    // Set initial value
    updateGridColumns();

    // Add event listener for window resize
    window.addEventListener('resize', updateGridColumns);

    // Clean up
    return () => window.removeEventListener('resize', updateGridColumns);
  }, []);

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      // Toggle sort order if clicking the same criteria
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const handleBookClick = (index: number) => {
    setSelectedBook(selectedBook === index ? null : index);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedBook === null) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          // Move right, but stay in the same row
          const currentRow = Math.floor(prev / gridColumns);
          const lastIndexInRow = Math.min((currentRow + 1) * gridColumns - 1, books.length - 1);
          return prev < lastIndexInRow ? prev + 1 : prev;
        });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          // Move left, but stay in the same row
          const currentRow = Math.floor(prev / gridColumns);
          const firstIndexInRow = currentRow * gridColumns;
          return prev > firstIndexInRow ? prev - 1 : prev;
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          // Move down to the next row (same column)
          const newIndex = prev + gridColumns;
          return newIndex < books.length ? newIndex : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          // Move up to the previous row (same column)
          const newIndex = prev - gridColumns;
          return newIndex >= 0 ? newIndex : prev;
        });
        break;
      case 'Escape':
        e.preventDefault();
        setSelectedBook(null);
        break;
    }
  };

  useEffect(() => {
    // Scroll selected book into view when changed
    if (selectedBook !== null && bookRefs.current[selectedBook]) {
      bookRefs.current[selectedBook]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedBook]);

  return (
    <div
      className="p-6 max-w-6xl mx-auto focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: 'none' }}
    >


      <h1 className="text-4xl font-bold mb-6 tc1">Books</h1>

      {/* Sorting Controls */}
      <div className="mb-6 p-4 bg2 rounded-lg shadow flex flex-wrap gap-2 relative">
        <span className="tc1 font-medium mr-2 my-auto">Sort by:</span>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === 'title' ? 'bg-blue-600 text-white' : 'bg3 tc1'}`}
          onClick={() => handleSort('title')}
        >
          Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === 'author' ? 'bg-blue-600 text-white' : 'bg3 tc1'}`}
          onClick={() => handleSort('author')}
        >
          Author {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === 'book_series' ? 'bg-blue-600 text-white' : 'bg3 tc1'}`}
          onClick={() => handleSort('book_series')}
        >
          Series {sortBy === 'book_series' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === 'good_score' ? 'bg-blue-600 text-white' : 'bg3 tc1'}`}
          onClick={() => handleSort('good_score')}
        >
          Rating {sortBy === 'good_score' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === 'wordcount' ? 'bg-blue-600 text-white' : 'bg3 tc1'}`}
          onClick={() => handleSort('wordcount')}
        >
          Word Count {sortBy === 'wordcount' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === 'year' ? 'bg-blue-600 text-white' : 'bg3 tc1'}`}
          onClick={() => handleSort('year')}
        >
          Year {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* Book Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-100">
        {books.map((book, index) => {
          const isSelected = selectedBook === index;
          return (
            <div
              key={index}
              ref={(el) => { if (el) bookRefs.current[index] = el; }}
              className={`book-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleBookClick(index)}
              tabIndex={0}
            >
              {/* Full-size Book Cover */}
              <div className="book-cover">
                <Image
                  src={`/${book.cover_file}`}
                  alt={`Cover of ${book.title}`}
                  className="object-cover w-full h-full"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>

              {/* Overlay with Book Info */}
              <div className={`book-overlay ${isSelected ? 'book-overlay-expanded' : 'book-overlay-collapsed'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="book-title tc1">{book.title}</h2>
                  {book.good_score && (
                    <span className="book-rating">
                      ★ {book.good_score.toFixed(1)}
                    </span>
                  )}
                </div>

                <p className="book-author tc2">By {book.author}</p>
                <p className="book-metadata tc3">{book.genre} • {book.year}</p>

                {/* Always visible description */}
                <p className="book-description tc2">{book.paragraph1}</p>

                {/* Expanded content */}
                {isSelected && (
                  <div className="mt-4 space-y-3 animate-fadeIn">
                    <p className="book-description tc2">{book.paragraph2}</p>

                    <div className="book-detail-section">
                      {book.book_series && (
                        <div>
                          <span className="book-detail-label tc2">Series: </span>
                          <span className="book-detail-value tc3">{book.book_series}</span>
                          {book.reading_order && <span className="book-detail-value tc3"> (#{book.reading_order})</span>}
                        </div>
                      )}
                      <div>
                        <span className="book-detail-label tc2">Words: </span>
                        <span className="book-detail-value tc3">{book.wordcount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="book-detail-label tc2">ISBN: </span>
                        <span className="book-detail-value tc3">{book.ISBN}</span>
                      </div>
                      <div>
                        <span className="book-detail-label tc2">Ratings: </span>
                        <span className="book-detail-value tc3">{book.n_good_ratings.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="book-trivia">
                      <span className="book-detail-label tc1">Trivia: </span>
                      <span className="book-detail-value tc2">{book.trivia}</span>
                    </div>

                    {/* Download button */}
                    <div>
                      <a
                        href={`/${book.book_file}`}
                        download
                        className="book-download-button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download EPUB
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}