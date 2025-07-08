"use client";

import CircleAnimation from "@/components/backgrounds/CircleAnimmation";
import { DownloadButton, GitHubButton } from "@/scripts/sourceButtons";
import "./page.css";
import "@/styles/sliders.css";
import Image from "next/image";
import React from "react";
import { FaSearch, FaCheck } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import { GlobalWordHistogram, GlobalLengthHistogram, GlobalMap, ArticleWordChart } from "@/app/toys/wikipedia-visualizer/WikiGraphs";
import ClusterComparison from "@/app/toys/wikipedia-visualizer/ClusterComparison";

// IndexedDB utilities
const DB_NAME = 'WikipediaVisualizerDB';
const DB_VERSION = 1;
const STORE_NAME = 'downloads';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const checkDatasetInCache = async (): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result > 0);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error checking dataset in cache:", error);
    return false;
  }
};

const saveToIndexedDB = async (id: string, data: ArrayBuffer, filename: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  await store.put({
    id,
    data,
    filename,
    timestamp: Date.now(),
    size: data.byteLength
  });
};

const getFromIndexedDB = async (id: string): Promise<any> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};


const pretty_print_size = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  for (let i = 0; i < units.length; i++) {
    if (bytes < 1024) {
      return `${("\u00A0\u00A0\u00A0" + bytes.toFixed(1)).slice(-5).slice(-6)}${units[i]}`;
    }
    bytes /= 1024;
  }
  return `${bytes.toFixed(2)}BB`;
}

export default function WikipediaVisualizerPage() {
  const [activePage, setActivePage] = React.useState("Global Map");
  const [downloadState, setDownloadState] = React.useState<boolean | number>(false);
  const [downloadProgress, setDownloadProgress] = React.useState([0, 0]);

  const [dataset, setDataset] = React.useState<Record<string, any> | null>(null);
  const [cachedDatasetInfo, setCachedDatasetInfo] = React.useState<{ size?: number } | null>(null);

  const [searchResults, setSearchResults] = React.useState<{ title: string, id: number, preview: string }[]>([]);
  const [searchState, setSearchState] = React.useState<"idle" | "loading" | "error" | "loaded">("idle");
  const [searchDropdownOpen, setSearchDropdownOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const dropdownElement = React.useRef<HTMLUListElement>(null);
  const searchDelayRef = React.useRef<NodeJS.Timeout | null>(null);

  const [activeArticleID, setActiveArticleID] = React.useState<number | null>(null);
  const [activeArticleData, setActiveArticleData] = React.useState<{ [key: string]: any } | null>(null);
  const [articleMinLetters, setArticleMinLetters] = React.useState(3);
  const [selectedClusters, setSelectedClusters] = React.useState<number[]>([]);
  const [availableClusters, setAvailableClusters] = React.useState<number[]>([]);

  const [clusterCenters, setClusterCenters] = React.useState<{ [key: number]: string }>({});

  React.useEffect(() => {
    if (!dataset || activeArticleID === null) return;
    const data: { [key: string]: any } = {};
    Object.keys(dataset).forEach(key => {
      data[key] = dataset[key][activeArticleID];
    });
    console.log("Active Article Data:", data);
    setActiveArticleData(data);
  }, [activeArticleID, dataset]);

  // Extract available clusters from dataset
  React.useEffect(() => {
    if (!dataset || !dataset.cluster) return;
    const uniqueClusters = Array.from(new Set(dataset.cluster)) as number[];
    uniqueClusters.sort((a, b) => a - b);
    setAvailableClusters(uniqueClusters);
    setClusterCenters(prev => {
      const newCenters: { [key: number]: string } = {};
      uniqueClusters.forEach(cluster => {
        const firstIndex = dataset.cluster.findIndex((c: number) => c === cluster);
        newCenters[cluster] = dataset["cluster_center"][firstIndex] || "N/A";
      });
      return { ...prev, ...newCenters };
    });
  }, [dataset]);

  const handleClusterToggle = (cluster: number) => {
    setSelectedClusters(prev =>
      prev.includes(cluster)
        ? prev.filter(c => c !== cluster)
        : [...prev, cluster]
    );
  };

  const handleSearch = (query: string) => {
    if (searchDelayRef.current) {
      clearTimeout(searchDelayRef.current);
    }
    if (!dataset) {
      console.warn("Dataset not loaded yet, cannot search");
      return;
    }
    if (query.length === 0) {
      setSearchResults([]);
      setSearchState("idle");
      return;
    }
    setSearchState("loading");
    searchDelayRef.current = setTimeout(async () => {

      let results = await searchData(query);
      results = results.slice(0, Math.min(20, results.length));
      // sort query position in title
      results.sort((a: any, b: any) => {
        let aIndex = a.title.toLowerCase().indexOf(query.toLowerCase());
        let bIndex = b.title.toLowerCase().indexOf(query.toLowerCase());
        if (aIndex < 0) aIndex = Infinity; // Ensure non-matching titles go to the end
        if (bIndex < 0) bIndex = Infinity; // Ensure non-matching titles go to the end
        return aIndex - bIndex; // Sort by index
      });

      // get text from dataset['text'] based on results
      // add to summary
      results = results.map((result: any) => {
        const text = dataset['text'][result.id] || "";
        const preview = text.length > 100 ? text.slice(0, 50) + "..." : text;
        return { ...result, preview };
      });

      setSearchResults(results ?? []);
      dropdownElement.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setSearchState("loaded");
    }, 500); // Simulate a delay for search results
  }

  async function searchData(query: string) {
    if (!dataset) {
      console.warn("Dataset not loaded yet, cannot search");
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    // search 
    let results = dataset['title'].map((title: string, index: number) => {
      if (title.toLowerCase().includes(query.toLowerCase())) {
        return { title, id: index };
      }
    })
    results = results.filter((result: any) => result !== undefined && result['title']); // Filter out undefined results
    return results;
  }

  React.useEffect(() => {
    // Check if dataset is already cached
    if (dataset) return;
    checkDatasetInCache().then((isCached) => {
      if (isCached) {
        console.log("Dataset is already cached");
        setDownloadState(true);
        loadDatasetFromCache();
      } else {
        console.log("Dataset is not cached");
      }
    });
  }, []);

  // Use direct download link for Google Drive
  const downloadLink = "https://huggingface.co/datasets/W0rldsing3R/wiki_info/resolve/main/wiki_dataset.json";

  const loadDatasetFromCache = async () => {
    try {
      const cachedData = await getFromIndexedDB('wikipedia_dataset');
      if (cachedData) {
        const jsonData = new TextDecoder().decode(cachedData.data);
        setDataset(JSON.parse(jsonData));
        setCachedDatasetInfo({ size: cachedData.size });
        console.log("Loaded dataset from cache");
      }
    } catch (error) {
      console.error("Error loading dataset from cache:", error);

    }
  }

  const clearCache = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await store.clear();
      console.log("Cache cleared");
      setDataset(null);
      setCachedDatasetInfo(null);
      setDownloadState(false);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  const handleDownload = () => {
    console.log("Download button clicked");
    if (typeof (downloadState) !== "boolean") return;
    setDownloadState(0);
    console.log("Downloading dataset...");

    fetch(downloadLink)
      .then(async (response) => {
        if (!response.body) throw new Error("No response body");
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length")!;
        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;
          setDownloadState(contentLength ? receivedLength / contentLength : 0.5);
          setDownloadProgress([receivedLength, contentLength]);
        }

        // Combine all chunks into a single ArrayBuffer
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }

        // Save to IndexedDB
        const filename = 'wikipedia_dataset.bin';
        const fileId = 'wikipedia_dataset';

        await saveToIndexedDB(fileId, result.buffer, filename);
        console.log("✅ File saved to IndexedDB successfully");

        // Print preview
        loadDatasetFromCache();

        setDownloadState(true);
        console.log("Download complete");

      })
      .catch((error) => {
        setDownloadState(false);
        console.error("❌ Download failed:", error);
      });
  }

  React.useEffect(() => {
    if (typeof downloadState === "number") {
      document.documentElement.style.setProperty("--download-progress", (Math.floor(downloadState * 100) - 100).toString() + "%");
      document.documentElement.style.setProperty("--download-progress-opacity", "1");
    } else if (downloadState === true) {
      document.documentElement.style.setProperty("--download-progress", "0%");
      document.documentElement.style.setProperty("--download-progress-opacity", "0");
    }
    else {
      document.documentElement.style.setProperty("--download-progress", "-100%");
      document.documentElement.style.setProperty("--download-progress-opacity", "0");
    }
  }, [downloadState]);

  const menu_items = [
    {
      title: "Dataset Info",
      description: "Overview and details about the Wikipedia dataset",
    },
    {
      title: "Global Map",
      description: "Large map of overall structure of Wikipedia",
    },
    {
      title: "Clusters",
      description: "Compare different clusters and their statistics",
    },
    {
      title: "Local Connections",
      description: "A focused page and its connections",
    },
    {
      title: "Article Stats",
      description: "Statistics about the article",
    },
  ];


  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Background animation */}
      <div className="fixed inset-0 z-1 invert dark:invert-0 wiki-main">
        <CircleAnimation
          radiusRange={[10, 800]}
          seed={123}
          style={{ opacity: 0.5 }}
        />
      </div>

      <div className="absolute z-10 w-full">


        <div className="absolute top-0 bg-white/20 backdrop-blur-[4px] w-[220px] lg:w-[320px] h-screen -z-10 ">
          <div className="mt-15 -mb-2 lg:flex flex-row items-center justify-between p-4">
            <h1 className=" p-3 text-black text-3xl font-bold ">Menu</h1>
            <div className="">
              <button className={`mx-3 progress-button h-fit inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white transition-all duration-200 shadow-md ${(typeof (downloadState) !== 'number') && "active:translate-y-[1px] active:opacity-70 hover:opacity-100 hover:translate-y-[-1px]"}`}
                onClick={handleDownload}
                style={{
                  background: downloadState == false ? "var(--khr)" : downloadState == true ? "var(--khg)" : "var(--khb)",
                  cursor: (typeof (downloadState) !== 'number') ? "pointer" : "not-allowed",
                }}
                disabled={typeof (downloadState) === 'number'}>
                <div className="relative w-6 aspect-[1/1] mr-2 -ml-1">
                  <FaDownload className="text-xl absolute inset-0 m-auto "
                    style={{
                      opacity: downloadState == false ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out"
                    }} />
                  <FaGear className="text-xl absolute inset-0 m-auto animate-spin"
                    style={{
                      opacity: downloadState == false || downloadState == true ? 0 : 1,
                      transition: "opacity 0.3s ease-in-out"
                    }} />
                  <FaCheck className="text-xl absolute inset-0 m-auto"
                    style={{
                      opacity: downloadState == true ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out"
                    }} />
                </div>
                Dataset
              </button>
              <div
                className="absolute whitespace-nowrap text-xs text-black/70 mx-4"
                style={{
                  maxHeight: typeof downloadState === 'number' ? "20px" : "0px",
                  overflowY: "hidden",
                  transition: "max-height 0.3s ease-in-out",
                  fontFamily: "Consolas, monospace"
                }}
              >
                {pretty_print_size(downloadProgress[0])}/{pretty_print_size(downloadProgress[1])}
              </div>
            </div>
          </div>
          <ul className="p-2 space-y-2">
            <li className="group flex flex-col relative" onMouseLeave={() => setSearchDropdownOpen(false)}>
              <div
                className="wg p-3 rounded-lg hover:bg-white/20 hover:shadow transition-all duration-300 select-none cursor-text flex items-center align-middle active:bg-white/30"
                onClick={() => {
                  setSearchDropdownOpen(searchTerm.length > 0);
                }}
              >
                <FaSearch className="inline-block mr-2 text-xl text-black/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none w-full text-black/60 placeholder:text-black/30"
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setSearchDropdownOpen(e.target.value.length > 0);
                    handleSearch(e.target.value);
                  }}
                />

              </div>
              <div
                className={`absolute bottom-0 translate-y-[100%] p-1 z-50 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg overflow-y-hidden transition-all duration-300 w-full`}
                style={{
                  maxHeight: searchDropdownOpen ? "200px" : "0px",
                  opacity: searchDropdownOpen ? 1 : 0,
                  pointerEvents: searchDropdownOpen ? "auto" : "none"
                }}
                tabIndex={0}
              >
                <ul className="p-2 overflow-y-scroll mini-scroll" style={{ maxHeight: "190px" }} ref={dropdownElement}>
                  {
                    searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <li key={index}
                          className="p-2 hover:shadow hover:bg-gray-200 transition-all duration-300 select-none cursor-pointer leading-0"
                          onClick={() => { setActiveArticleID(result.id); setSearchDropdownOpen(false); setSearchTerm(""); }}
                        >
                          <b className="text-sm">{result.title}</b> : <span className="text-gray-500 text-sm">{result.preview}</span>
                        </li>
                      )))
                      : ( //<"idle" | "loading" | "error" | "loaded">
                        searchState === "loading" ? (
                          <li className="p-2 text-gray-500">Loading...</li>
                        ) : searchState === "error" ? (
                          <li className="p-2 text-red-500">Error loading results</li>
                        ) : searchState === "loaded" ? (
                          <li className="p-2 text-gray-500">No results found</li>
                        ) : (
                          <li className="p-2 text-gray-500">Idle search</li>
                        )
                      )
                  }
                </ul>
              </div>
            </li>
            <hr className="bg-black/30 h-[3px] mt-2 rounded-lg border-none" />
            {menu_items.map((item, index) => (
              <>
                <li
                  key={index}
                  className="p-3 rounded-lg hover:bg-white/20 hover:translate-y-[-2px] hover:shadow transition-all duration-300 select-none cursor-pointer"
                  onClick={() => setActivePage(item.title)}
                >
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-700">{item.description}</p>
                </li>
                {index < menu_items.length - 1 && (
                  <hr className="bg-black/30 h-[3px] mt-2 rounded-lg border-none" />
                )}
              </>
            ))}
          </ul>

          {/* Links */}
          <div className="bottom-1 absolute flex justify-between items-left flex-col space-y-2 p-4 w-full">


            <DownloadButton
              relativePath="src/app/toys/wikipedia-visualizer/page.tsx"
              fileName="WikipediaVisualizer_page.tsx"
            />
            <GitHubButton relativePath="src/app/toys/wikipedia-visualizer/" />

          </div>

        </div>
				<div className="absolute bg-black/5 h-screen w-[calc(100%-220px)] lg:w-[calc(100%-320px)] left-[220px] lg:left-[320px] top-0 flex items-center justify-center flex-col -z-5">
					{activePage === "Global Map" &&
						<>
            <div className="max-w-[90vh] w-[90%] aspect-[1/1] rounded-lg bg-white">
              {/*<Image src="/images/wiki-examples/Global.jpg" alt="Global Map" width={800} height={800} className="w-full h-full object-cover rounded-lg"/>*/}
              <GlobalMap data={dataset} mapping_type="tsne" />
            </div>
						</>
					}

					{activePage === "Local Connections" &&
						<>
						<div className="max-w-[70vh] w-[60%] aspect-[1/1] rounded-lg bg-white">
							<Image src="/images/wiki-examples/Local.png" alt="Global Map" width={800} height={800} className="w-full h-full object-cover rounded-lg" /></div>
						<h2 className="text-2xl font-bold mt-4 w-[50%]">Local Connections</h2>
						<p className="text-gray-700 w-[55%] mt-2">
							The centered node represents the selected article.<br />
							Related articles linked via hyperlink are connected with edges.<br />
							The line thickness indicates the relevance of the connection.
						</p>
						</>
					}

          {activePage === "Article Stats" &&
            ((activeArticleID !== null && activeArticleData) ?
            <>
              <div className="max-w-[90%] w-[100%] rounded-lg bg-white">
                {activeArticleData.url ? (
                  <iframe
                    src={activeArticleData.url}
                    title="Article Preview"
                    className="w-full h-[70vh] rounded-lg border-2"
                    style={{ minHeight: 400, background: "#f9f9f9", boxShadow: "4px 4px 3px rgba(0, 0, 0, 0.3)" }}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                ) : (
                  <div className="p-4 text-gray-500">No URL available for preview.</div>
                )}
              </div>
              <div className="w-full max-w-[90%] rounded-lg bg-white mt-4">
                <ArticleWordChart
                  topWords={activeArticleData.top_words || []}
                  minLetters={articleMinLetters}
                  onMinLettersChange={setArticleMinLetters}
                />
              </div>
              <h2 className="text-2xl font-bold mt-4 w-[50%]">{activeArticleData.title || "Title"}</h2>
              <p className="text-gray-700 w-[55%] mt-2">
                Word frequency analysis for the selected article
              </p>
            </>
              : (<div className="p-6 text-gray-700">
                select an article from the search bar to view its stats
              </div>))
          }

          {activePage === "Dataset Info" &&
            <div className="h-[90%] max-w-[1300px] w-[calc(100%-50px)] lg:w-[calc(100%-100px)] left-[220px] lg:left-[320px] mt-16">
              <div className="w-full rounded-lg bg-white p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 w-full text-center">Dataset Info</h2>
                <ul className="text-gray-700 w-full list-disc pl-6 space-y-1">
                  <li>
                    <b>Source:</b>{" "}
                    <a
                      href="https://huggingface.co/datasets/W0rldsing3R/wiki_info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-800 hover:text-blue-600 transition-colors"
                      style={{ textDecoration: "none" }}
                    >
                      HuggingFace: W0rldsing3R/wiki_info
                    </a></li>
                  <li><b>Format:</b> JSON</li>
                  <li><b>Size:</b> {cachedDatasetInfo?.size ? pretty_print_size(cachedDatasetInfo.size) : "Unknown"}</li>
                  <li><b>Cached:</b> {downloadState === true ? <><span>Yes </span><button className="opacity-25 hover:opacity-50 cursor-pointer active:translate-y-[1px] transition-all duration-200" onClick={() => clearCache()}>(Clear Cache)</button></> : "No"} </li>
                  {
                    dataset && <><li><b>Features: </b>
                      {
                        Object.keys(dataset).map((key, indx) => (
                          <span key={key}>{key}{indx < Object.keys(dataset).length - 1 ? ", " : ""}</span>
                        ))

                      }
                    </li>
                      <li><b>Entries:</b> <span>{dataset["title"].length.toLocaleString()}</span></li>
                    </>

                  }

                </ul>
              </div>
              <div className="w-full flex flex-col xl:flex-row items-center justify-between py-6 space-y-6 xl:space-y-0 xl:space-x-6">
                {/* Length Histogram */}
                <div className="w-full xl:w-1/2 bg-white rounded-lg shadow-md">
                  <GlobalLengthHistogram
                    data={dataset ? dataset['text_length'] : []}
                    clusterData={dataset ? dataset['cluster'] : []}
                    selectedClusters={selectedClusters}
                  />
                  {availableClusters.length > 0 && (
                    <div style={{ padding: "10px", borderTop: "1px solid #eee" }}>
                      <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
                        Filter by Clusters:
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", maxHeight: "100px", overflowY: "auto", padding: "5px" }}>
                        {availableClusters.map(cluster => (
                          <label key={cluster} style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedClusters.includes(cluster)}
                              onChange={() => handleClusterToggle(cluster)}
                              style={{
                                opacity: 0,
                                position: "absolute",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer"
                              }}
                            />
                            <div style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: selectedClusters.includes(cluster)
                                ? `linear-gradient(135deg, hsl(${(cluster * 137.5) % 360}, 70%, 60%), hsl(${(cluster * 137.5 + 60) % 360}, 70%, 40%))`
                                : "linear-gradient(135deg, #e5e7eb, #d1d5db)",
                              border: selectedClusters.includes(cluster) ? "2px solid #ffffff" : "2px solid #9ca3af",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "bold",
                              color: selectedClusters.includes(cluster) ? "#ffffff" : "#6b7280",
                              transition: "all 0.2s ease-in-out",
                              boxShadow: selectedClusters.includes(cluster)
                                ? "0 2px 4px rgba(0,0,0,0.2)"
                                : "0 1px 2px rgba(0,0,0,0.1)",
                              transform: selectedClusters.includes(cluster) ? "scale(1.1)" : "scale(1)",
                              pointerEvents: "none"
                            }}>
                              <span style={{ pointerEvents: "none" }}>
                                {cluster}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Word Distribution */}
                <div className="w-full xl:w-1/2 bg-white rounded-lg shadow-md">
                  <GlobalWordHistogram data={dataset ? dataset['top_words'] : []} />
                  <div style={{ padding: "10px", textAlign: "center" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
                      Minimum Letters: 3
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      defaultValue="3"
                      style={{ width: "200px" }}
                      onChange={(e) => {
                        // This will be handled by the GlobalWordHistogram component
                        // For now, we'll keep it simple and not implement real-time updates
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          }

          {activePage === "Clusters" &&
            <div className="h-[90%] max-w-[1300px] w-[calc(100%-50px)] lg:w-[calc(100%-100px)] left-[220px] lg:left-[320px] mt-16">
              <ClusterComparison
                data={dataset}
                availableClusters={availableClusters}
                clusterCenters={clusterCenters}
              />
            </div>
          }
				</div>
      </div>
    </div>
  );
}

