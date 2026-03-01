"use client";

// books/page.tsx tailwind, nodejs,
// loads book information from book_info.json
// display paragraph 1, author, year, genre and image on card
// when card is hovered, it expands to show all information and download button
// the card is selectable, when selected, stays expanded, and can navigate to other cards using arrow keys
// books and covers stored in public folder

import Image from "next/image";
import { useState, useEffect, useRef, KeyboardEvent, useMemo, useCallback, memo } from "react";
import bookData from "./book_info.json";
import "./books.css";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";


import { BsFillGridFill } from "@react-icons/all-files/bs/BsFillGridFill";
import { FaBook } from "@react-icons/all-files/fa/FaBook";
import { FaTablet } from "@react-icons/all-files/fa/FaTablet";
import { FaDownload } from "@react-icons/all-files/fa/FaDownload";
import { FaListUl } from "@react-icons/all-files/fa/FaListUl";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { sort } from "d3";

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

// Helpers for thumbnail paths
const getThumbnailPath = (coverFile: string) =>
  coverFile.replace("/covers/", "/covers/thumbnail/").replace(".jpg", ".webp").replace(".jpeg", ".webp");

const getTinyPath = (coverFile: string) =>
  coverFile.replace("/covers/", "/covers/tiny/").replace(".jpg", ".webp").replace(".jpeg", ".webp");

// Memoized grid card — only re-renders when its own props change
const BookGridCard = memo(function BookGridCard({
  book, index, isSelected, isReadBook, isLoggedIn, isLoadingRead, shopType,
  onCardClick, onToggleShop, onToggleRead, onNavigate, cardRef,
}: {
  book: Book; index: number; isSelected: boolean; isReadBook: boolean;
  isLoggedIn: boolean; isLoadingRead: boolean; shopType: "kobo" | "thriftbooks";
  onCardClick: () => void; onToggleShop: (e: React.MouseEvent) => void;
  onToggleRead: (book: Book, e: React.MouseEvent) => void;
  onNavigate: (isbn: string) => void; cardRef: (el: HTMLDivElement | null) => void;
}) {
  const thumbnailPath = getThumbnailPath(book.cover_file);
  return (
    <div
      ref={cardRef}
      className={`book-card ${isSelected ? "selected" : ""}`}
      onClick={onCardClick}
      tabIndex={0}
    >
      <div className="book-cover">
        <Image
          src={`./${thumbnailPath}`}
          alt={`Cover of ${book.title}`}
          className="object-cover w-full h-full"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 6}
          loading={index < 6 ? undefined : "lazy"}
        />
      </div>
      {isReadBook && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
          <FaCheck className="text-white text-sm" />
        </div>
      )}
      <div className={`book-overlay ${isSelected ? "book-overlay-expanded" : "book-overlay-collapsed"}`}>
        <div className="flex justify-between items-start mb-[-6]">
          <h2
            className={`book-title tc1 flex items-center transition-all duration-200 ${isSelected ? "hover:opacity-50" : "pointer-events-none"}`}
            onClick={(e) => { if (isSelected) onNavigate(book.ISBN); e.stopPropagation(); }}
          >
            {book.title}
            <FaArrowRight className={`ml-2 ${isSelected ? "opacity-100" : "opacity-0"} transition-all duration-300`} />
          </h2>
          {book.good_score && (
            <span className="book-rating w-content whitespace-nowrap">★ {book.good_score.toFixed(1)}</span>
          )}
        </div>
        <p className="book-author tc2">By {book.author}</p>
        {book.book_series && (
          <p className="book-series tc3">
            {book.book_series}
            {book.reading_order && <span> (#{book.reading_order})</span>}
          </p>
        )}
        <p className="book-metadata tc3">{book.genre} • {book.year}</p>
        <p className="book-description tc2">{book.paragraph1}</p>
        <AnimatePresence>
          {isSelected && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-3"
            >
              <p className="book-description tc2">{book.paragraph2}</p>
              <div className="book-detail-section">
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
                <div>
                  <span className="book-detail-label tc2 hover:underline cursor-pointer group" onClick={(e) => { onNavigate(book.ISBN); e.stopPropagation(); }}>
                    Discussion
                    <FaArrowRight className="inline ml-1 -translate-y-[1.5px] group-hover:translate-x-[2px] transition-transform" />
                  </span>
                </div>
              </div>
              <div className="book-trivia">
                <span className="book-detail-label tc1">Trivia: </span>
                <span className="book-detail-value tc2">{book.trivia}</span>
              </div>
              <div className="flex flex-row mt-6 items-center">
                {isLoggedIn && (
                  <>
                    <a href={`/${book.book_file}`} download className="book-download-button" onClick={(e) => e.stopPropagation()}>
                      <FaDownload className="mr-2 inline" /> EPUB
                    </a>
                    <button
                      onClick={(e) => onToggleRead(book, e)}
                      disabled={isLoadingRead}
                      className={`ml-2 px-3 py-2 rounded-md transition-all flex items-center justify-start font-medium cursor-pointer min-w-22 ${isReadBook ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-600 text-white hover:bg-gray-700"} ${isLoadingRead ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <FaCheck className="mr-2" /> {isLoadingRead ? "..." : isReadBook ? "Read" : "Mark"}
                    </button>
                  </>
                )}
                <div className="flex items-stretch ml-auto font-weight-[500] text-white user-select-none overflow-hidden" style={{ backgroundColor: "var(--khg)", borderRadius: "0.375rem" }}>
                  <div className="shop-toggle-icon flex items-center justify-center cursor-pointer ml-0 mr-0 w-10" style={{ backgroundColor: "var(--khp)" }} onClick={onToggleShop}>
                    <FaTablet className="absolute text-white transition-opacity duration-200" style={{ opacity: shopType === "kobo" ? 1 : 0, transitionDelay: shopType !== "kobo" ? "0.1s" : "" }} />
                    <FaBook className="absolute text-white transition-opacity duration-200" style={{ opacity: shopType === "kobo" ? 0 : 1, transitionDelay: shopType === "kobo" ? "0.1s" : "" }} />
                  </div>
                  <a href={book[`${shopType}_link`] || "#"} target="_blank" rel="noopener noreferrer" className=" pl-2 pr-3 pt-[0.5rem] pb-[0.5rem]" onClick={(e) => e.stopPropagation()}>
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
});

// Memoized list item — uses tiny thumbnails for the small cover
const BookListItem = memo(function BookListItem({
  book, index, isSelected, isReadBook, isLoggedIn, isLoadingRead, shopType,
  onCardClick, onToggleShop, onToggleRead, onNavigate, cardRef,
}: {
  book: Book; index: number; isSelected: boolean; isReadBook: boolean;
  isLoggedIn: boolean; isLoadingRead: boolean; shopType: "kobo" | "thriftbooks";
  onCardClick: () => void; onToggleShop: (e: React.MouseEvent) => void;
  onToggleRead: (book: Book, e: React.MouseEvent) => void;
  onNavigate: (isbn: string) => void; cardRef: (el: HTMLDivElement | null) => void;
}) {
  const tinyPath = getTinyPath(book.cover_file);
  return (
    <div
      ref={cardRef}
      className={`outline-none bg2 overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? "shadow-[inset_10px_4px_10px_-1px_rgba(0,0,0,0.2),inset_10px_-4px_10px_-1px_rgba(0,0,0,0.2)] brightness-110" : "dark:brightness-60 brightness-100 dark:hover:brightness-75 hover:brightness-105"}`}
      onClick={onCardClick}
      tabIndex={0}
    >
      <div className="flex flex-row">
        <div className="relative w-14 md:w-24 h-64 h-auto flex-shrink-0">
          <Image
            src={`./${tinyPath}`}
            alt={`Cover of ${book.title}`}
            className="object-cover w-full h-full"
            fill
            sizes="96px"
            priority={index < 10}
            loading={index < 10 ? undefined : "lazy"}
          />
          {isReadBook && (
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
              <FaCheck className="text-white text-sm" />
            </div>
          )}
        </div>
        <div className="flex-1 p-3">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap items-end">
              <h2 className="text-2xl font-bold tc1 mr-1 truncate">{book.title}</h2>
              <span className="text-lg tc2 truncate">By {book.author}</span>
            </div>
            {book.good_score && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold whitespace-nowrap ml-2">
                ★ {book.good_score.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-sm tc3 mb-3 hidden sm:block">
            {book.book_series && (
              <span className="text-sm tc3">
                {book.book_series}
                {book.reading_order && <span> (#{book.reading_order})</span>}
                &nbsp;•&nbsp;
              </span>
            )}
            {book.year} • {book.wordcount.toLocaleString()} words • {book.genre}
          </p>
          <p className="tc2 mb-0">{book.paragraph1}</p>
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
                <p className="tc2 mt-3">{book.paragraph2}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-semibold tc2">ISBN: </span>
                    <span className="tc3">{book.ISBN}</span>
                  </div>
                  <div>
                    <span className="font-semibold tc2">Ratings: </span>
                    <span className="tc3">{book.n_good_ratings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold tc2 hover:underline cursor-pointer group" onClick={(e) => { onNavigate(book.ISBN); e.stopPropagation(); }}>
                      Discussion
                      <FaArrowRight className="inline ml-1 -translate-y-[1.5px] group-hover:translate-x-[2px] transition-transform" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mt-2">
                  <div className="p-3 bg3 rounded">
                    <span className="font-semibold tc1">Trivia: </span>
                    <span className="tc2">{book.trivia}</span>
                  </div>
                  <div className="ml-3 flex flex-row items-center gap-3 pt-2">
                    {isLoggedIn && (
                      <>
                        <a href={`/${book.book_file}`} download className="book-download-button" onClick={(e) => e.stopPropagation()}>
                          <FaDownload className="mr-2 inline" /> EPUB
                        </a>
                        <button
                          onClick={(e) => onToggleRead(book, e)}
                          disabled={isLoadingRead}
                          className={`px-3 py-2 rounded-md transition-all flex items-center justify-center font-medium ${isReadBook ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-600 text-white hover:bg-gray-700"} ${isLoadingRead ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <FaCheck className="mr-2" /> {isLoadingRead ? "..." : isReadBook ? "Read" : "Mark"}
                        </button>
                      </>
                    )}
                    <div className="flex items-stretch ml-auto font-weight-[500] text-white user-select-none overflow-hidden" style={{ backgroundColor: "var(--khg)", borderRadius: "0.375rem" }}>
                      <div className="shop-toggle-icon flex items-center justify-center cursor-pointer ml-0 mr-0 w-10" style={{ backgroundColor: "var(--khp)" }} onClick={onToggleShop}>
                        <FaTablet className="absolute text-white transition-opacity duration-200" style={{ opacity: shopType === "kobo" ? 1 : 0, transitionDelay: shopType !== "kobo" ? "0.1s" : "" }} />
                        <FaBook className="absolute text-white transition-opacity duration-200" style={{ opacity: shopType === "kobo" ? 0 : 1, transitionDelay: shopType === "kobo" ? "0.1s" : "" }} />
                      </div>
                      <a href={book[`${shopType}_link`] || "#"} target="_blank" rel="noopener noreferrer" className="pl-2 pr-3 pt-[0.5rem] pb-[0.5rem]" onClick={(e) => e.stopPropagation()}>
                        Shop
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

const loadFromStorage = (key: string, defaultValue: string) => {
  if (typeof window === "undefined") return defaultValue;
  const storedValue = localStorage.getItem(key);
  return storedValue ? storedValue : defaultValue;
};

export default function Books() {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>(() => loadFromStorage("booksSortBy", "title"));
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => loadFromStorage("booksSortOrder", "asc") as "asc" | "desc");
  const [gridColumns, setGridColumns] = useState<number>(3);
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shopType, setShopType] = useState<"kobo" | "thriftbooks">(() => loadFromStorage("booksShopType", "kobo") as "kobo" | "thriftbooks");
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => loadFromStorage("booksViewMode", "grid") as "grid" | "list");
  const [booksRead, setBooksRead] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>(() => loadFromStorage("booksSearchQuery", ""));
  const { isLoggedIn, username, token } = useAuth();
  const animationTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [isLoadingReadStatus, setIsLoadingReadStatus] = useState<Record<string, boolean>>({});

  // One-time cleaned data from JSON — no state or effect needed
  const cleanedBooks = useMemo<Book[]>(() =>
    bookData.map((book: Book) => ({
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
    })),
    []);

  // Derived sorted + filtered books — replaces sort effect, filter effect, books state, inFiltered state, and dataRef
  const displayedBooks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = cleanedBooks;
    if (query) {
      filtered = cleanedBooks.filter((book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.book_series?.toLowerCase().includes(query) ||
        book.year.toString().includes(query)
      );
    }
    return [...filtered].sort((a, b) => {
      const valueA = a[sortBy as keyof Book];
      const valueB = b[sortBy as keyof Book];
      if (valueA === undefined) return sortOrder === "asc" ? -1 : 1;
      if (valueB === undefined) return sortOrder === "asc" ? 1 : -1;
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
      return sortOrder === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [cleanedBooks, sortBy, sortOrder, searchQuery]);

  // Fetch read status from API
  useEffect(() => {
    if (!isLoggedIn || !username || !token) return;
    (async () => {
      try {
        const response = await fetch('/.netlify/functions/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getBooksRead', username, token }),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        if (data.booksRead) {
          setBooksRead(
            data.booksRead.reduce((acc: Record<string, boolean>, item: { ISBN: string }) => {
              acc[item.ISBN] = true;
              return acc;
            }, {} as Record<string, boolean>)
          );
        }
      } catch (error) {
        console.error("Error fetching read status:", error);
      }
    })();
  }, [isLoggedIn, username, token]);

  // Persist preferences to localStorage
  useEffect(() => {
    localStorage.setItem("booksSortBy", sortBy);
    localStorage.setItem("booksSortOrder", sortOrder);
    localStorage.setItem("booksViewMode", viewMode);
    localStorage.setItem("booksSearchQuery", searchQuery);
    localStorage.setItem("booksShopType", shopType);
  }, [sortBy, sortOrder, viewMode, searchQuery, shopType]);

  // Detect grid columns from screen width
  useEffect(() => {
    const updateGridColumns = () => {
      const width = window.innerWidth;
      setGridColumns(width < 768 ? 1 : width < 1024 ? 2 : 3);
    };
    updateGridColumns();
    window.addEventListener("resize", updateGridColumns);
    return () => window.removeEventListener("resize", updateGridColumns);
  }, []);

  // Scroll selected book into view
  useEffect(() => {
    if (selectedBook !== null && bookRefs.current[selectedBook]) {
      const delay = viewMode === "list" ? 100 : 0;
      if (animationTimeout.current) clearTimeout(animationTimeout.current);
      animationTimeout.current = setTimeout(() => {
        bookRefs.current[selectedBook]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, delay);
    }
    return () => { if (animationTimeout.current) clearTimeout(animationTimeout.current); };
  }, [selectedBook, viewMode]);

  // Stable callbacks — won't cause child re-renders on every parent render
  const handleSort = (criteria: string) => {
    console.log("Sorting by:", sortBy, "->", criteria, "Current order:", sortOrder);
    setSortBy((prev) => {
      if (prev === criteria) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortOrder("asc");
      }
      return criteria;
    });
  };

  const handleBookClick = useCallback((index: number) => {
    setSelectedBook((prev) => (prev === index ? null : index));
  }, []);

  const toggleShopType = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShopType((prev) => (prev === "kobo" ? "thriftbooks" : "kobo"));
  }, []);

  const toggleReadStatus = useCallback(async (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn || !username || !token) return;
    setIsLoadingReadStatus((prev) => ({ ...prev, [book.ISBN]: true }));
    try {
      const response = await fetch('/.netlify/functions/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markBookRead', username, token,
          ISBN: book.ISBN, title: book.title,
          mark: !booksRead[book.ISBN],
        }),
      });
      if (response.ok) {
        setBooksRead((prev) => ({ ...prev, [book.ISBN]: !prev[book.ISBN] }));
      }
    } catch (error) {
      console.error('Error updating read status:', error);
    } finally {
      setIsLoadingReadStatus((prev) => ({ ...prev, [book.ISBN]: false }));
    }
  }, [isLoggedIn, username, token, booksRead]);

  const navigateToBook = useCallback((isbn: string) => {
    router.push(`/books/focus?ISBN=${isbn}`);
  }, [router]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedBook === null) return;
    const len = displayedBooks.length;
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          if (viewMode === "list") return Math.min(prev + 1, len - 1);
          const currentRow = Math.floor(prev / gridColumns);
          const lastInRow = Math.min((currentRow + 1) * gridColumns - 1, len - 1);
          return prev < lastInRow ? prev + 1 : prev;
        });
        break;
      case "ArrowLeft":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          if (viewMode === "list") return Math.max(prev - 1, 0);
          const firstInRow = Math.floor(prev / gridColumns) * gridColumns;
          return prev > firstInRow ? prev - 1 : prev;
        });
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          if (viewMode === "list") return Math.min(prev + 1, len - 1);
          const next = prev + gridColumns;
          return next < len ? next : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedBook((prev) => {
          if (prev === null) return prev;
          if (viewMode === "list") return Math.max(prev - 1, 0);
          const next = prev - gridColumns;
          return next >= 0 ? next : prev;
        });
        break;
      case "Escape":
        e.preventDefault();
        setSelectedBook(null);
        break;
    }
  }, [selectedBook, displayedBooks.length, viewMode, gridColumns]);

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
          className={`active:opacity-50 transition-opacity duration-150 cursor-pointer px-3 py-1 rounded-md ${sortBy === "title" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("title")}
        >
          Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`active:opacity-50 transition-opacity duration-150 cursor-pointer px-3 py-1 rounded-md ${sortBy === "author" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("author")}
        >
          Author {sortBy === "author" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`active:opacity-50 transition-opacity duration-150 cursor-pointer px-3 py-1 rounded-md ${sortBy === "book_series" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("book_series")}
        >
          Series {sortBy === "book_series" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`active:opacity-50 transition-opacity duration-150 cursor-pointer px-3 py-1 rounded-md ${sortBy === "good_score" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("good_score")}
        >
          Rating {sortBy === "good_score" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`active:opacity-50 transition-opacity duration-150 cursor-pointer px-3 py-1 rounded-md ${sortBy === "wordcount" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("wordcount")}
        >
          Word Count{" "}
          {sortBy === "wordcount" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className={`active:opacity-50 transition-opacity duration-150 cursor-pointer px-3 py-1 rounded-md ${sortBy === "year" ? "bg-blue-600 text-white" : "bg3 tc1"
            }`}
          onClick={() => handleSort("year")}
        >
          Year {sortBy === "year" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>

        {/* Search Input */}
        <div className="flex gap-2 items-center flex-grow">
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
      </div>

      {/* Book Cards - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-100">
          {displayedBooks.map((book, index) => (
            <BookGridCard
              key={book.ISBN}
              book={book}
              index={index}
              isSelected={selectedBook === index}
              isReadBook={booksRead[book.ISBN] === true}
              isLoggedIn={isLoggedIn}
              isLoadingRead={isLoadingReadStatus[book.ISBN] || false}
              shopType={shopType}
              onCardClick={() => handleBookClick(index)}
              onToggleShop={toggleShopType}
              onToggleRead={toggleReadStatus}
              onNavigate={navigateToBook}
              cardRef={(el) => { bookRefs.current[index] = el; }}
            />
          ))}
        </div>
      )}

      {/* Book List - List View */}
      {viewMode === "list" && (
        <div className="space-y-0 mb-100 rounded-xl overflow-hidden">
          {displayedBooks.map((book, index) => (
            <BookListItem
              key={book.ISBN}
              book={book}
              index={index}
              isSelected={selectedBook === index}
              isReadBook={booksRead[book.ISBN] === true}
              isLoggedIn={isLoggedIn}
              isLoadingRead={isLoadingReadStatus[book.ISBN] || false}
              shopType={shopType}
              onCardClick={() => handleBookClick(index)}
              onToggleShop={toggleShopType}
              onToggleRead={toggleReadStatus}
              onNavigate={navigateToBook}
              cardRef={(el) => { bookRefs.current[index] = el; }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
