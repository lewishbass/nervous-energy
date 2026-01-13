"use client";

// books/page.tsx tailwind, nodejs,
// loads book information from book_info.json
// display paragraph 1, author, year, genre and image on card
// when card is hovered, it expands to show all information and download button
// the card is selectable, when selected, stays expanded, and can navigate to other cards using arrow keys
// books and covers stored in public folder

import Image from "next/image";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import bookData from "./book_info.json";
import "./books.css";
import { useAuth } from "@/context/AuthContext";
import { FaBook, FaTablet, FaDownload, FaListUl, FaSearch } from "react-icons/fa"; // Import icons for shop types
import { AnimatePresence, motion } from "framer-motion";
import { BsFillGridFill } from "react-icons/bs";

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
  const [sortBy, setSortBy] = useState<string>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [gridColumns, setGridColumns] = useState<number>(3); // Default to 3 columns
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shopType, setShopType] = useState<"kobo" | "thriftbooks">("kobo"); // Default to Kobo
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Add view mode state

  const [inFiltered, setInFiltered] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState<string>("");

  const dataRef = useRef<Book[]>([]); // Store the original data

  const { isLoggedIn } = useAuth();

  const animationTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize books from the imported data
    const cleanedBooks: Book[] = bookData.map((book: Book) => ({
      author: book.author || "N/A",
      title: book.title || "N/A",
      year: Number(book.year),
      wordcount: Number(book.wordcount),
      good_score: Number(book.good_score),
      n_good_ratings: Number(book.n_good_ratings),
      sold: book.sold || "N/A",
      ISBN: book.ISBN || "N/A",
      book_series: book.book_series || undefined,
      reading_order: book.reading_order || undefined,
      trivia: book.trivia || "N/A",
      paragraph1: book.paragraph1 || "N/A",
      paragraph2: book.paragraph2 || "N/A",
      genre: book.genre || "N/A",
      cover_file: book.cover_file || "N/A",
      book_file: book.book_file || "N/A",
      kobo_link: book.kobo_link || undefined,
      thriftbooks_link: book.thriftbooks_link || undefined,
    }));
    console.log("Cleaned books:", cleanedBooks);

    setBooks(cleanedBooks);
    dataRef.current = cleanedBooks; // Store the original data
  }, []);

  useEffect(() => {
    // print book list when changed
    // dataRef.current = [...books]
  }, [books]);


  //book sorting effect
  useEffect(() => {
    // Sort books when sortBy or sortOrder changes
    const sortedBooks = [...dataRef.current].sort((a, b) => {
      const valueA = a[sortBy as keyof Book];
      const valueB = b[sortBy as keyof Book];

      // Handle undefined values
      if (valueA === undefined) return sortOrder === "asc" ? -1 : 1;
      if (valueB === undefined) return sortOrder === "asc" ? 1 : -1;

      // Handle different data types
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Convert to string for mixed types
      return sortOrder === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    // Update the books state with sorted array
    setBooks(sortedBooks);

    console.log(`Sorted books by ${sortBy} in ${sortOrder} order`);
    console.log(
      "Sorted book titles:",
      sortedBooks.map((book: Book) => book.title).join("\n")
    );
  }, [sortBy, sortOrder]);

  //book filtering effect
  useEffect(() => {
    const filteredStatus: Record<string, boolean> = {};

    dataRef.current.forEach((book) => {

      const query = searchQuery.toLowerCase().trim();

      if (query === "") {
        filteredStatus[book.ISBN] = true;
        return;
      }
      else if (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.book_series?.toLowerCase().includes(query) ||
        book.year.toString().includes(query)) {
        filteredStatus[book.ISBN] = true;
      }
      else {
        filteredStatus[book.ISBN] = false;
      }

    });
    setInFiltered(prev => ({ ...filteredStatus }));
  }, [searchQuery]);

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
    window.addEventListener("resize", updateGridColumns);

    // Clean up
    return () => window.removeEventListener("resize", updateGridColumns);
  }, []);

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      // Toggle sort order if clicking the same criteria
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const handleBookClick = (index: number) => {
    setSelectedBook(selectedBook === index ? null : index);
  };



  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedBook === null) return;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          //list mode
          if (viewMode === "list") {
            return Math.min(prev + 1, books.length - 1);
          }
          // Move right, but stay in the same row
          const currentRow = Math.floor(prev / gridColumns);
          const lastIndexInRow = Math.min(
            (currentRow + 1) * gridColumns - 1,
            books.length - 1
          );
          return prev < lastIndexInRow ? prev + 1 : prev;
        });
        break;
      case "ArrowLeft":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          //list mode
          if (viewMode === "list") {
            return Math.max(prev - 1, 0);
          }
          // Move left, but stay in the same row
          const currentRow = Math.floor(prev / gridColumns);
          const firstIndexInRow = currentRow * gridColumns;
          return prev > firstIndexInRow ? prev - 1 : prev;
        });
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          //list mode
          if (viewMode === "list") {
            return Math.min(prev + 1, books.length - 1);
          }
          // Move down to the next row (same column)
          const newIndex = prev + gridColumns;
          return newIndex < books.length ? newIndex : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          //list mode
          if (viewMode === "list") {
            return Math.max(prev - 1, 0);
          }
          // Move up to the previous row (same column)
          const newIndex = prev - gridColumns;
          return newIndex >= 0 ? newIndex : prev;
        });
        break;
      case "Escape":
        e.preventDefault();
        setSelectedBook(null);
        break;
    }
  };

  useEffect(() => {
    // Scroll selected book into view when changed
    if (selectedBook !== null && bookRefs.current[selectedBook]) {
      // Add delay in list mode to allow expansion animation to complete
      const delay = viewMode === "list" ? 100 : 0;
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
      animationTimeout.current = setTimeout(() => {
        bookRefs.current[selectedBook]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, delay);

    }

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [selectedBook, viewMode]);

  const toggleShopType = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShopType(shopType === "kobo" ? "thriftbooks" : "kobo");
  };

  return (
    <div
      className="p-6 max-w-6xl mx-auto focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <h1 className="text-4xl font-bold mb-6 tc1">Books</h1>

      {/* Sorting Controls */}
      <div className="mb-6 p-4 bg2 rounded-lg shadow flex flex-wrap gap-2 relative items-center">
        <span className="tc1 font-medium mr-2 my-auto">Sort by:</span>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === "title" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("title")}
        >
          Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === "author" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("author")}
        >
          Author {sortBy === "author" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === "book_series" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("book_series")}
        >
          Series {sortBy === "book_series" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === "good_score" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("good_score")}
        >
          Rating {sortBy === "good_score" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === "wordcount" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("wordcount")}
        >
          Word Count{" "}
          {sortBy === "wordcount" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortBy === "year" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("year")}
        >
          Year {sortBy === "year" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder=""
            className="py-1 px-3 rounded-md bg3 tc1 flex-grow w-full outline-none"
            style={{ paddingLeft: searchQuery ? "0.5rem" : "2rem", transition: "padding-left 0.3s ease" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 tc1 pointer-events-none" style={{ maxWidth: searchQuery ? "0" : "1rem", opacity: searchQuery ? 0 : 0.5, transition: "all 0.3s ease" }} />
        </div>

        {/* View Mode Toggle */}
        <div className="w-6 h-6 mr-2 ml-auto relative overflow-visible flex items-center justify-center opacity-100 hover:opacity-60 transition-opacity duration-200 tc1">
          <BsFillGridFill
            className={`absolute w-[100%] h-[100%] cursor-pointer transition-opacity duration-300 ${viewMode === 'list' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setViewMode('grid')}
          />
          <FaListUl
            className={`absolute w-[100%] h-[100%] cursor-pointer transition-opacity duration-300 ${viewMode === 'grid' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>

      {/* Book Cards - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-100">
          {books.map((book, index) => {
            const isSelected = selectedBook === index;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) bookRefs.current[index] = el;
                }}
                className={`book-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleBookClick(index)}
                tabIndex={0}
                style={{ display: inFiltered[book.ISBN] === false ? "none" : "block" }}
              >
                {/* Full-size Book Cover */}
                <div className="book-cover">
                  <Image
                    src={`./${book.cover_file}`}
                    alt={`Cover of ${book.title}`}
                    className="object-cover w-full h-full"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>

                {/* Overlay with Book Info */}
                <div
                  className={`book-overlay ${isSelected
                    ? "book-overlay-expanded"
                    : "book-overlay-collapsed"
                    }`}
                >
                  <div className="flex justify-between items-start mb-[-6]">
                    <h2 className="book-title tc1">{book.title}</h2>
                    {book.good_score && (
                      <span className="book-rating w-content whitespace-nowrap">
                        ★ {book.good_score.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="book-author tc2">By {book.author}</p>
                  {book.book_series && (
                    <p className="book-series tc3">
                      {book.book_series}
                      {book.reading_order && <span> (#{book.reading_order})</span>}
                    </p>
                  )}
                  <p className="book-metadata tc3">
                    {book.genre} • {book.year}
                  </p>

                  {/* Always visible description */}
                  <p className="book-description tc2">{book.paragraph1}</p>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key="expanded-content"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{ opacity: 0, }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-3"
                      >
                        <p className="book-description tc2">{book.paragraph2}</p>

                        <div className="book-detail-section">
                          <div>
                            <span className="book-detail-label tc2">Words: </span>
                            <span className="book-detail-value tc3">
                              {book.wordcount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="book-detail-label tc2">ISBN: </span>
                            <span className="book-detail-value tc3">
                              {book.ISBN}
                            </span>
                          </div>
                          <div>
                            <span className="book-detail-label tc2">Ratings: </span>
                            <span className="book-detail-value tc3">
                              {book.n_good_ratings.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="book-trivia">
                          <span className="book-detail-label tc1">Trivia: </span>
                          <span className="book-detail-value tc2">
                            {book.trivia}
                          </span>
                        </div>

                        {/* Download button */}
                        <div className="flex flex-row mt-6 items-center">
                          {isLoggedIn && (
                            <div>
                              <a
                                href={`/${book.book_file}`}
                                download
                                className="book-download-button"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaDownload className="mr-2 inline" /> EPUB
                              </a>
                            </div>
                          )}

                          <div
                            className="flex items-stretch ml-auto font-weight-[500] text-white user-select-none overflow-hidden"
                            style={{
                              backgroundColor: "var(--khg)",
                              borderRadius: "0.375rem",
                            }}
                          >
                            <div
                              className="shop-toggle-icon flex items-center justify-center cursor-pointer ml-0 mr-0 w-10"
                              style={{
                                backgroundColor: "var(--khp)",
                              }}
                              onClick={toggleShopType}
                            >
                              <FaTablet className="absolute text-white transition-opacity duration-200" style={{ opacity: (shopType === 'kobo') ? 1 : 0, transitionDelay: (shopType !== 'kobo') ? "0.1s" : "" }} />
                              <FaBook className="absolute text-white transition-opacity duration-200" style={{ opacity: (shopType === 'kobo') ? 0 : 1, transitionDelay: (shopType === 'kobo') ? "0.1s" : "" }} />
                            </div>
                            <a
                              href={book[`${shopType}_link`] || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" pl-2 pr-3 pt-[0.5rem] pb-[0.5rem]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Shop
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book List - List View */}
      {viewMode === "list" && (
        <div className="space-y-4 mb-100">
          {books.map((book, index) => {
            const isSelected = selectedBook === index;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) bookRefs.current[index] = el;
                }}
                className={`outline-none bg2 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? "ring-2 ring-blue-500" : "hover:shadow-lg"
                  }`}
                onClick={() => handleBookClick(index)}
                tabIndex={0}
                style={{ display: inFiltered[book.ISBN] === false ? "none" : "block" }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Book Cover */}
                  <div className="relative w-full md:w-48 h-64 md:h-auto flex-shrink-0">
                    <Image
                      src={`./${book.cover_file}`}
                      alt={`Cover of ${book.title}`}
                      className="object-cover w-full h-full"
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      priority
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold tc1">{book.title}</h2>
                      {book.good_score && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold whitespace-nowrap ml-2">
                          ★ {book.good_score.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <p className="text-lg tc2 mb-1">By {book.author}</p>
                    {book.book_series && (
                      <p className="text-sm tc3 mb-2">
                        {book.book_series}
                        {book.reading_order && <span> (#{book.reading_order})</span>}
                      </p>
                    )}
                    <p className="text-sm tc3 mb-3">
                      {book.genre} • {book.year} • {book.wordcount.toLocaleString()} words
                    </p>

                    <p className="tc2 mb-3">{book.paragraph1}</p>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          key="expanded-content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          <p className="tc2">{book.paragraph2}</p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="font-semibold tc2">ISBN: </span>
                              <span className="tc3">{book.ISBN}</span>
                            </div>
                            <div>
                              <span className="font-semibold tc2">Ratings: </span>
                              <span className="tc3">{book.n_good_ratings.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="p-3 bg3 rounded">
                            <span className="font-semibold tc1">Trivia: </span>
                            <span className="tc2">{book.trivia}</span>
                          </div>

                          <div className="flex flex-row items-center gap-3 pt-2">
                            {isLoggedIn && (
                              <a
                                href={`/${book.book_file}`}
                                download
                                className="book-download-button"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaDownload className="mr-2 inline" /> EPUB
                              </a>
                            )}

                            <div
                              className="flex items-stretch ml-auto font-weight-[500] text-white user-select-none overflow-hidden"
                              style={{
                                backgroundColor: "var(--khg)",
                                borderRadius: "0.375rem",
                              }}
                            >
                              <div
                                className="shop-toggle-icon flex items-center justify-center cursor-pointer ml-0 mr-0 w-10"
                                style={{
                                  backgroundColor: "var(--khp)",
                                }}
                                onClick={toggleShopType}
                              >
                                <FaTablet className="absolute text-white transition-opacity duration-200" style={{ opacity: (shopType === 'kobo') ? 1 : 0, transitionDelay: (shopType !== 'kobo') ? "0.1s" : "" }} />
                                <FaBook className="absolute text-white transition-opacity duration-200" style={{ opacity: (shopType === 'kobo') ? 0 : 1, transitionDelay: (shopType === 'kobo') ? "0.1s" : "" }} />
                              </div>
                              <a
                                href={book[`${shopType}_link`] || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pl-2 pr-3 pt-[0.5rem] pb-[0.5rem]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Shop
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
