"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import bookData from "../book_info.json";
import Discussion from "@/components/messages/Discussion";
import { FaBook, FaTablet, FaDownload, FaStar, FaCheck } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

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

function BookContent() {
	const searchParams = useSearchParams();
	const isbn = searchParams.get("ISBN");
	const [book, setBook] = useState<Book | null>(null);
	const [shopType, setShopType] = useState<"kobo" | "thriftbooks">("kobo");
	const [isRead, setIsRead] = useState(false);
	const [isLoadingReadStatus, setIsLoadingReadStatus] = useState(false);
	const { isLoggedIn, username, token } = useAuth();

	useEffect(() => {
		if (isbn) {
			const foundBook = bookData.find((b: Book) => b.ISBN === isbn);
			if (foundBook) {
				setBook({
					author: foundBook.author || "N/A",
					title: foundBook.title || "N/A",
					year: Number(foundBook.year),
					wordcount: Number(foundBook.wordcount),
					good_score: Number(foundBook.good_score),
					n_good_ratings: Number(foundBook.n_good_ratings),
					sold: foundBook.sold || "N/A",
					ISBN: foundBook.ISBN || "N/A",
					book_series: foundBook.book_series || undefined,
					reading_order: foundBook.reading_order || undefined,
					trivia: foundBook.trivia || "N/A",
					paragraph1: foundBook.paragraph1 || "N/A",
					paragraph2: foundBook.paragraph2 || "N/A",
					genre: foundBook.genre || "N/A",
					cover_file: foundBook.cover_file || "N/A",
					book_file: foundBook.book_file || "N/A",
					kobo_link: foundBook.kobo_link || undefined,
					thriftbooks_link: foundBook.thriftbooks_link || undefined,
				});
			}
		}
	}, [isbn]);

	// Fetch book read status when logged in and book is loaded
	useEffect(() => {
		const fetchReadStatus = async () => {
			if (!isLoggedIn || !username || !token || !book) return;

			try {
				const response = await fetch('/.netlify/functions/profile', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						action: 'getBooksRead',
						username,
						token
					})
				});

				if (response.ok) {
					const data = await response.json();
					const bookIsRead = data.booksRead.some((b: any) => b.ISBN === book.ISBN);
					setIsRead(bookIsRead);
				}
			} catch (error) {
				console.error('Error fetching read status:', error);
			}
		};

		fetchReadStatus();
	}, [isLoggedIn, username, token, book]);

	const toggleShopType = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShopType(shopType === "kobo" ? "thriftbooks" : "kobo");
	};

	const toggleReadStatus = async () => {
		if (!isLoggedIn || !username || !token || !book) return;

		setIsLoadingReadStatus(true);
		try {
			const response = await fetch('/.netlify/functions/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'markBookRead',
					username,
					token,
					ISBN: book.ISBN,
					title: book.title,
					mark: !isRead
				})
			});

			if (response.ok) {
				setIsRead(!isRead);
			} else {
				console.error('Failed to update read status');
			}
		} catch (error) {
			console.error('Error updating read status:', error);
		} finally {
			setIsLoadingReadStatus(false);
		}
	};

	if (!book) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-xl tc2">Book not found</p>
			</div>
		);
	}

	return (
		<div className="p-6 mx-auto mb-100 w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
			{/* Header Section with Title and Cover */}
			<div className="flex items-start gap-4 mb-6">
				<div className="flex-1">
					<h1 className="text-4xl md:text-5xl font-bold tc1 mb-3 leading-tight">{book.title}</h1>
					<h2 className="text-xl md:text-2xl tc2 mb-2">by <span className="font-semibold tc1">{book.author}</span></h2>
					
					<div className="flex flex-row items-center gap-4 mt-2">
						{book.book_series && (
							<p className="text-base md:text-lg tc3 font-medium">
								{book.book_series}
								{book.reading_order && <span className="ml-1">• Book #{book.reading_order}</span>}
							</p>
						)}
						{book.good_score && (
							<div className="flex items-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg shadow-md">
								<FaStar className="mr-1.5 text-sm" />
								<span className="text-md font-bold">{book.good_score.toFixed(1)}</span>
							</div>
						)}
					</div>
					
					<div className="flex flex-wrap gap-2 mt-2 mb-2">
						<span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full tc1 text-sm font-medium border border-purple-500/30">{book.genre}</span>
						<span className="px-4 py-2 bg3 rounded-full tc2 text-sm font-medium">{book.year}</span>
						<span className="px-4 py-2 bg3 rounded-full tc2 text-sm font-medium">{book.wordcount.toLocaleString()} words</span>
					</div>
					<p className="tc2 leading-relaxed text-base">{book.paragraph1}</p>
				</div>

				{/* Book Cover */}
				<div className="flex-shrink-0 ml-4 hidden sm:block">
					<div className="relative w-40 md:w-48 rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '2/3' }}>
						<Image
							src={`/${book.cover_file}`}
							alt={`Cover of ${book.title}`}
							className="object-cover"
							fill
							sizes="(max-width: 768px) 160px, 192px"
							priority
						/>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="space-y-4 mb-6">
				
				<p className="tc2 leading-relaxed text-base">{book.paragraph2}</p>
			</div>

			{/* Book Details */}
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-5 mb-6 border border-gray-200/50 dark:border-gray-700/50">
				<h3 className="font-bold tc1 mb-3 text-lg">Book Details</h3>
				<div className="flex flex-wrap gap-3 text-sm">
					<div>
						<span className="tc2 font-medium">ISBN: </span>
						<span className="tc3">{book.ISBN}</span>
					</div>
					<div>
						<span className="tc2 font-medium">Ratings: </span>
						<span className="tc3">{book.n_good_ratings.toLocaleString()}</span>
					</div>
					<div className="col-span-2">
						<span className="tc2 font-medium">Sold: </span>
						<span className="tc3">{book.sold}</span>
					</div>
				</div>
			</div>

			{/* Trivia */}
			<div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-xl p-5 mb-6 border border-purple-500/20">
				<h3 className="font-bold tc1 mb-2 text-lg flex items-center">
					<span className="mr-2">💡</span> Did You Know?
				</h3>
				<p className="tc2 text-sm leading-relaxed">{book.trivia}</p>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				{isLoggedIn && (
					<a
						href={`/${book.book_file}`}
						download
						className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center font-medium cursor-pointer "
					>
						<FaDownload className="mr-2" /> Download EPUB
					</a>
				)}

				{isLoggedIn && (
					<button
						onClick={toggleReadStatus}
						disabled={isLoadingReadStatus}
						className={`px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center font-medium cursor-pointer ${
							isRead
								? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
								: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
						} ${isLoadingReadStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						<FaCheck className="mr-2" /> {isLoadingReadStatus ? 'Updating...' : (isRead ? "Marked as Read" : "Mark as Read")}
					</button>
				)}

				<div
					className="flex items-stretch sm:ml-auto font-medium text-white select-none overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all"
					style={{ backgroundColor: "var(--khg)" }}
				>
					<div
						className="flex items-center justify-center cursor-pointer w-12 hover:brightness-110 transition-all"
						style={{ backgroundColor: "var(--khp)" }}
						onClick={toggleShopType}
					>
						<FaTablet
							className="absolute text-white transition-opacity duration-200"
							style={{ opacity: shopType === "kobo" ? 1 : 0, transitionDelay: shopType !== "kobo" ? "0.1s" : "" }}
						/>
						<FaBook
							className="absolute text-white transition-opacity duration-200"
							style={{ opacity: shopType === "kobo" ? 0 : 1, transitionDelay: shopType === "kobo" ? "0.1s" : "" }}
						/>
					</div>
					<a
						href={book[`${shopType}_link`] || "#"}
						target="_blank"
						rel="noopener noreferrer"
						className="pl-4 pr-5 py-3 hover:brightness-110 transition-all min-w-40"
					>
						Buy on {shopType === "kobo" ? "Digital" : "Physical"}
					</a>
				</div>
			</div>

			{/* Discussion Section */}
			<section className="backdrop-blur-lg bg-white/30 dark:bg-black/30 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg mt-8">
				<Discussion
					baseThreadID={`book-${book.ISBN.replace(/-/g, '')}`}
					baseThreadTitle={`Discussion: ${book.title}`}
					baseThreadContent={`Discuss "${book.title}" by ${book.author}. Share your thoughts, favorite moments, and interpretations!`}
				/>
			</section>
		</div>
	);
}

export default function BooksPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-xl tc2">Loading book details...</p>
				</div>
			</div>
		}>
			<BookContent />
		</Suspense>
	);
}