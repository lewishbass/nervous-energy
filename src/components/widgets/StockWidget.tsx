"use client";
import { useState, useEffect } from 'react';
//import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';
import { JSX } from 'react';
import { FaGear } from 'react-icons/fa6';

// TypeScript interfaces
interface StockData {
	prices: {
		date: string;
		value: number;
	}[];
	symbol: string;
	companyName: string;
	currentPrice: number;
	previousClose: number;
	open: number;
	high: number;
	low: number;
	volume: number;
	totalShares: number;
	website: string;
	logo: string;
	industry: string;
	marketCap: number;
	peRatio: number;
}
/*
interface ChartDataPoint {
	time: string;
	price: number;
	index: number;
}

// Define interface for tooltip props
interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		value: number;
		dataKey: string;
		payload?: {
			time: string;
			price: number;
		};
	}>;
	label?: string;
}*/

/*/ Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps): JSX.Element | null => {
	if (active && payload && payload.length && label) {
		const price = payload[0].value;
		return (
			<div className="bg1 p-2 rounded-md shadow">
				<p className="tc1 text-sm font-semibold">
					${price.toFixed(2)} <span className="ml-2">{label}</span>
				</p>
			</div>
		);
	}
	return null;
};*/

// Format large numbers (like volume, market cap)
const formatNumber = (num: number): string => {
	if (num >= 1_000_000_000) {
		return (num / 1_000_000_000).toFixed(2) + 'B';
	}
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(2) + 'M';
	}
	if (num >= 1_000) {
		return (num / 1_000).toFixed(2) + 'K';
	}
	return num.toString();
};

interface StockWidgetProps {
	className?: string;
}

export default function StockWidget({ className = "" }: StockWidgetProps): JSX.Element {
	const [stockData, setStockData] = useState<StockData>({
		prices: [],
		symbol: "",
		companyName: "",
		currentPrice: 0,
		previousClose: 0,
		open: 0,
		high: 0,
		low: 0,
		volume: 0,
		totalShares: 0,
		website: "",
		logo: "",
		industry: "",
		marketCap: 0,
		peRatio: 0
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	//const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
	const [symbol, setSymbol] = useState<string>("NVDA");
	const [searchInput, setSearchInput] = useState<string>("");
	const [priceChange, setPriceChange] = useState<number>(0);
	const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
	const [finnhubKey, setFinnhubKey] = useState<string | null>(null);
	const [useRealData, setUseRealData] = useState<boolean>(false);

	const [previousBackgroundImage, setPreviousBackgroundImage] = useState<string | null>(null);
	const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);

	const [searchPreview, setSearchPreview] = useState<Array<Record<string, string>>>([]);
	const [searchFocused, setSearchFocused] = useState<boolean>(false);

	const companies: Record<string, string> = {
		"AAPL" : "Apple Inc.",
		"MSFT" : "Microsoft Corporation",
		"GOOGL": "Alphabet Inc.",
		"AMZN" : "Amazon.com Inc.",
		"META" : "Meta Platforms Inc.",
		"TSLA" : "Tesla Inc.",
		"NVDA" : "NVIDIA Corporation",
		"NFLX" : "Netflix Inc.",
		"JPM"  : "JPMorgan Chase & Co.",
		"WMT"  : "Walmart Inc.",
		"BAC"  : "Bank of America Corp.",
		"V"    : "Visa Inc.",
		"PG"   : "Procter & Gamble Company",
		"JNJ"	 : "Johnson & Johnson",
		"UNH"	 : "UnitedHealth Group Incorporated",
		"MA"	 : "Mastercard Incorporated",
		"HD"	 : "The Home Depot, Inc.",
		"XOM"	 : "Exxon Mobil Corporation",
		"TSM"	 : "Taiwan Semiconductor Manufacturing",
		"ORCL" : "Oracle Corporation",
		"CSCO" : "Cisco Systems, Inc.",
		"CVX"	 : "Chevron Corporation",
		"KO"	 : "The Coca-Cola Company",
		"PEP"  : "PepsiCo, Inc.",
		"MRK"  : "Merck & Co., Inc.",
		"PFE"  : "Pfizer Inc.",
		"TMO"  : "Thermo Fisher Scientific Inc.",
		"TSN"  : "Tyson Foods, Inc.",
		"CRM"  : "Salesforce, Inc.",
		"ABBV" : "AbbVie Inc.",
		"ACN"  : "Accenture plc",
		"CMCSA": "Comcast Corporation",
		"DIS"  : "The Walt Disney Company",
		"NKE"  : "NIKE, Inc.",
		"TMUS" : "T-Mobile US, Inc.",
		"TXN"  : "Texas Instruments Incorporated",
		"AVGO" : "Broadcom Inc.",
		"COST" : "Costco Wholesale Corporation",
		"DHR"  : "Danaher Corporation",
		"LLY"  : "Eli Lilly and Company",
		"NEE"  : "NextEra Energy, Inc.",
		"ADBE" : "Adobe Inc.",
		"ASML" : "ASML Holding N.V.",
		"BABA": "Alibaba Group Holding Limited",
		"INTC" : "Intel Corporation",
		"AMD"  : "Advanced Micro Devices, Inc.",
		"IBM"  : "International Business Machines",
		"F"    : "Ford Motor Company",
		"GM"   : "General Motors Company",
		"GE"   : "General Electric Company",
		"BA"   : "Boeing Co.",
		"AAL"  : "American Airlines Group Inc.",
		"DAL"  : "Delta Air Lines, Inc.",
		"UAL"  : "United Airlines Holdings, Inc.",
		"SBUX" : "Starbucks Corporation",
		"MCD"  : "McDonald's Corporation",
		"PYPL" : "PayPal Holdings, Inc.",
		"SQ"   : "Block, Inc.",
		"T"    : "AT&T Inc.",
		"VZ"   : "Verizon Communications Inc.",
		"CAT"  : "Caterpillar Inc.",
		"CVS"  : "CVS Health Corporation",
		"WBA"  : "Walgreens Boots Alliance, Inc.",
		"LOW"  : "Lowe's Companies, Inc."
	};

	/* Gradient based on whether stock is up or down
	const getStockPriceGradient = (change: number): string => {
		if (change > 0) {
			return "linear-gradient(to bottom right, #134e5e, #71b280)"; // Green gradient for positive
		} else if (change < 0) {
			return "linear-gradient(to bottom right,rgb(237, 104, 117),rgb(76, 48, 46))"; // Red gradient for negative
		} else {
			return "linear-gradient(to bottom right, #5c5c5c, #cfcfcf)"; // Gray gradient for neutral
		}
	};*/

	useEffect(() => {
		if (error) {
			console.error("Error:", error);
		}
	});

	// Fetch Finnhub API key from backend
	const fetchApiKey = async (): Promise<void> => {
		try {
			const response = await fetch('/.netlify/functions/keys', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ action: 'finnhub' }),
			});

			if (!response.ok) {
				throw new Error('Failed to fetch API key');
			}

			const data = await response.json();
			if (data.key) {
				setFinnhubKey(data.key);
				setUseRealData(true);
				console.log('Finnhub API key fetched successfully');
			} else {
				throw new Error('No API key in response');
			}
		} catch (err) {
			console.error('Error fetching Finnhub API key:', err);
			setUseRealData(false);
		}
	};

	// Fetch real stock data from Finnhub API
	const fetchRealStockData = async (stockSymbol: string): Promise<StockData | null> => {
		if (!finnhubKey) return null;
		
		try {
			// Get quote data
			const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${finnhubKey}`);
			if (!quoteResponse.ok) throw new Error('Failed to fetch quote data');
			const quoteData = await quoteResponse.json();
			
			// Get company profile
			const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stockSymbol}&token=${finnhubKey}`);
			if (!profileResponse.ok) throw new Error('Failed to fetch company profile');
			const profileData = await profileResponse.json();
			
			// Get historical data
			const today = new Date();
			const pastDate = new Date();
			pastDate.setDate(today.getDate() - 60);
			
			/*const fromTimestamp = Math.floor(pastDate.getTime() / 1000);
			const toTimestamp = Math.floor(today.getTime() / 1000);
			
			/*const candleResponse = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stockSymbol}&resolution=D&from=${fromTimestamp}&to=${toTimestamp}&token=${finnhubKey}`);
			if (!candleResponse.ok) throw new Error('Failed to fetch historical data');
			const candleData = await candleResponse.json();
			
			if (candleData.s !== 'ok') throw new Error('Invalid candle data response');
			
			 Process historical prices
			const historicalPrices = [];
			for (let i = 0; i < candleData.t.length; i++) {
				const date = new Date(candleData.t[i] * 1000);
				historicalPrices.push({
					date: date.toISOString().split('T')[0],
					value: candleData.c[i]
				});
			}*/
			
			console.log("quoteData", quoteData);
			console.log("profileData", profileData);

			const historicalPrices = [] as { date: string; value: number }[];
			
			const currentPrice = quoteData.c; // Current price
			const previousClose = quoteData.pc; // Previous close
			const priceChangeVal = currentPrice - previousClose;
			const priceChangePercentVal = (priceChangeVal / previousClose) * 100;
			
			const stockData: StockData = {
				prices: historicalPrices,
				symbol: stockSymbol,
				companyName: profileData.name || getCompanyName(stockSymbol),
				currentPrice: currentPrice,
				previousClose: previousClose,
				open: quoteData.o,
				high: quoteData.h,
				low: quoteData.l,
				volume: quoteData.v || 0,
				marketCap: profileData.marketCapitalization ? profileData.marketCapitalization * 1000000 : 0,
				totalShares: profileData.shareOutstanding || 0,
				website: profileData.weburl || "",
				logo: profileData.logo || "",
				industry: profileData.finnhubIndustry || "",
				peRatio: profileData.pe || 0
			};
			
			setPriceChange(priceChangeVal);
			setPriceChangePercent(priceChangePercentVal);
			
			return stockData;
		} catch (err) {
			console.error("Error fetching real stock data:", err);
			return null;
		}
	};

	// Preload the background image
	const preloadBackgroundImage = (imageUrl: string) => {
		if (!imageUrl) return;
		
		const img = new Image();
		img.onload = () => {
			setBackgroundImage(imageUrl);
			setImageLoaded(true);
			console.log("Image loaded:", imageUrl);
			setTimeout(() => {
				setPreviousBackgroundImage(imageUrl);
				console.log("Previous image set:", imageUrl);
			}
			, 1000); // Delay to allow transition effect
		};
		img.onerror = () => {
			setBackgroundImage(null);
			setImageLoaded(false);
		};
		img.src = imageUrl;
	};

	// Combined function to fetch stock data - tries real API first, falls back to mock data
	const fetchStockData = async (stockSymbol: string): Promise<void> => {
		try {
			setLoading(true);
			setError(null);
			setImageLoaded(false); // Reset image loaded state
			
			let data: StockData | null = null;
			
			// Try to use real data if API key is available
			if (useRealData && finnhubKey) {
				data = await fetchRealStockData(stockSymbol);
			}
			
			// Fall back to mock data if real data fetch failed or not enabled
			if (!data) {
				console.log("Could not fetch data");
				return;
			}
			setStockData(data);
			
			// Format data for the chart
			/*const formattedData: ChartDataPoint[] = data.prices.map((price, index) => {
				return {
					time: price.date.slice(5), // Just show MM-DD
					price: price.value,
					index: index
				};
			});
			
			setChartData(formattedData);*/
			setLoading(false);
			
			// Preload the logo as background if available
			if (data.logo) {
				preloadBackgroundImage(data.logo);
			} else {
				setBackgroundImage(null);
				setImageLoaded(false);
			}
		} catch (err) {
			setError("Failed to fetch stock data");
			console.error("Error fetching stock data:", err);
			setLoading(false);
		}
	};

	// Get company name from symbol
	const getCompanyName = (sym: string): string => {
		return companies[sym] || sym;
	};

	// Handle search form submission
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim()) {
			setSymbol(searchInput.toUpperCase());
			setSearchInput("");
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
		if (!e) {
			e = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
		}
		setSearchInput(e.target.value.toUpperCase());
		const searchTerm = e.target.value.toUpperCase();
		const filteredCompanies = Object.entries(companies)
			.filter(([symbol]) => symbol.includes(searchTerm))
			.map(([symbol, name]) => ({ symbol, name }));
		setSearchPreview(filteredCompanies);
	};

	useEffect(() => {
		// Fetch API key only once when component mounts
		fetchApiKey();
	}, []);

	useEffect(() => {
		fetchStockData(symbol);
	}, [symbol, finnhubKey]);

	return (
		<div
			className={`p-4 rounded-lg shadow relative overflow-hidden ${className}`}
			style={{
				//background: `${getStockPriceGradient(priceChange)}, linear-gradient(45deg, var(--fallback-bg2, black), var(--fallback-bg, black))`,
				minHeight: 'fit-content',
				height: '',
				transition: 'all 0.5s ease-in-out',
				
			}}
		>
			{/* Black overlay for better text readability */}

			<div
				className="absolute inset-0 bg-black z-0 brightness-60 dark:brightness-20 blur-xs"
				style={{
					transition: 'opacity 0.75s ease-in-out',
					backgroundColor: 'black',
					backgroundImage: previousBackgroundImage ? `url(${previousBackgroundImage})` : "",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			></div>
			<div
				className="absolute inset-0 bg-black z-0 brightness-60 dark:brightness-20 blur-xs"
				style={{
					transition: 'opacity 0.75s ease-in-out',
					backgroundColor: 'black',
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					opacity: imageLoaded && previousBackgroundImage !== backgroundImage ? 1 : 0, // Fade in effect
				}}
			></div>
			

			{/* Add a CSS variable for the fallback background color that changes with dark mode */}
			<style jsx>{`
        :global(:root) {
          --fallback-bg: white;
          --fallback-bg2: #88f;
        }
        :global(.dark) {
          --fallback-bg: black;
          --fallback-bg2: #008;
        }
      `}</style>

			<div className="flex items-center justify-between mb-3 relative z-10">
				<h2 className="text-xl font-semibold text-white">Stock Tracker<FaGear className="inline ml-3 animate-spin"
					style={{
					opacity: loading ? 1 : 0,
					transition: 'opacity 0.5s ease-in-out',
				}}/></h2>
				<div className="relative">
					<form onSubmit={handleSearch} className="flex">
						<input
							type="text"
							value={searchInput}
							onChange={(e) => handleSearchInputChange(e)}
							placeholder="Symbol (e.g. AAPL)"
							className="bg-white/30 dark:bg-black/40 tc1 dark:placeholder-white/70 placeholder-black/70 text-sm px-2 py-1 rounded-l outline-none w-58"
							onFocus={() => { setSearchFocused(true); setSearchInput(""); handleSearchInputChange(null); }}
							onBlur={() => setTimeout(() => setSearchFocused(false), 200)} // Delay to allow click on search preview
						/>
						<button type="submit" className="wg bg-white/40 dark:bg-black/30 tc1 px-2 py-1 rounded-r cursor-pointer">
							<FaSearch />
						</button>
					</form>

					<div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-md z-30 overflow-y-scroll mini-scroll"
						style={{ maxHeight: (searchFocused && searchPreview.length > 0) ? "200px" : "0px", transition: 'max-height 0.3s ease-in-out' }}>
						<ul>
							{searchPreview.map((item) => (
								<li
									key={item.symbol}
									className="px-4 py-2 text-black text-sm hover:bg-gray-100 cursor-pointer z-90 select-none"
									onClick={() => {
										setSymbol(item.symbol);
										setSearchInput("");
										setSearchPreview([]);
									}}
								>
									{item.symbol} - {item.name}
								</li>
							))}
						</ul>
					</div>

				</div>
			</div>

			<>
					{/* Stock Info Header */}
					<div className="mb-6 relative z-0">
						<div className="flex justify-between items-center">
							<div>
										<h3 className="text-2xl font-bold text-white">
											<a href={stockData.website ? stockData.website : '#'} target='blank_' className='hover:underline text-white/90 hover:text-white transition-all transition-ease duration-200'>{stockData.symbol}</a> 

											{stockData.logo && (
												<img 
													src={stockData.logo} 
													alt={`${stockData.companyName} logo`} 
													className="h-6 ml-1 inline-block rounded border-1 border-white/50" 
													onError={(e) => {
														e.currentTarget.style.display = 'none';
													}}
												/>
											)}
								</h3>
								<p className="text-white/80 text-sm">{stockData.companyName}</p>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold text-white">${stockData.currentPrice.toFixed(2)}</p>
								<p className={`flex items-center ${priceChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
									{priceChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
									${Math.abs(priceChange).toFixed(2)} ({priceChangePercent.toFixed(2)}%)
								</p>
							</div>
						</div>
					</div>

					{/* Stock Price Chart /}
					<div className="h-40 mb-6 relative z-5">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
								<XAxis
									dataKey="time"
									axisLine={{ stroke: '#ffffff50' }}
									tick={{ fill: '#fff', fontSize: 10 }}
									tickLine={{ stroke: '#ffffff50' }}
									tickCount={5}
								/>
								<YAxis
									domain={['dataMin - 5', 'dataMax + 5']}
									axisLine={{ stroke: '#ffffff50' }}
									tick={{ fill: '#fff', fontSize: 10 }}
									tickLine={{ stroke: '#ffffff50' }}
									tickCount={5}
									width={40}
									tickFormatter={(value) => '$' + value.toFixed(0)}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Line
									type="monotone"
									dataKey="price"
									stroke="#fff"
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 6, fill: '#fff' }}
								/>
								<ReferenceLine
									y={stockData.previousClose}
									stroke="#ffffff80"
									strokeDasharray="3 3"
									label={{
										value: 'Prev Close',
										position: 'insideBottomRight',
										fill: '#fff',
										fontSize: 10,
									}}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					{/* Stock Data Cards */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-5">
						<div className="bg-white/20 dark:bg-black/30 backdrop-blur-[2px] p-3 rounded">
							<h3 className="tc2 text-sm font-medium text-white">Open</h3>
							<p className="tc1 text-xl text-white">${stockData.open.toFixed(2)}</p>
						</div>
						<div className="bg-white/20 dark:bg-black/30 backdrop-blur-[2px] p-3 rounded">
							<h3 className="tc2 text-sm font-medium text-white">High / Low</h3>
							<p className="tc1 text-xl text-white text-nowrap">${stockData.high.toFixed(2)} / ${stockData.low.toFixed(2)}</p>
						</div>
						<div className="bg-white/20 dark:bg-black/30 backdrop-blur-[2px] p-3 rounded">
							<h3 className="tc2 text-sm font-medium text-white">Volume</h3>
							<p className="tc1 text-xl text-white">{formatNumber(stockData.volume)}</p>
						</div>
						<div className="bg-white/20 dark:bg-black/30 backdrop-blur-[2px] p-3 rounded">
							<h3 className="tc2 text-sm font-medium text-white">Market Cap</h3>
							<p className="tc1 text-xl text-white">{formatNumber(stockData.marketCap)}</p>
						</div>
					</div>

					{/* Disclaimer */}
				<p className="text-white/50 text-xs mt-4 italic text-center relative z-10 pointer-events-none">
								Data shown is for demonstration purposes only.
								Please use a reputable source for real-time stock data.
					</p>
				</>
			
		</div>
	);
}
