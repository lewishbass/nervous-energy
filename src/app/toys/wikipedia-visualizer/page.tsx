"use client";

import CircleAnimation from "@/components/backgrounds/CircleAnimmation";
import { DownloadButton, GitHubButton } from "@/scripts/sourceButtons";
import "./page.css";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function WikipediaVisualizerPage() {
	const [activePage, setActivePage] = React.useState("Global Map");
  const menu_items = [
    {
      title: "Global Map",
      description: "Large map of overall structure of Wikipedia",
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
        <div className="mt-20 px-5 flex justify-between items-center">
          <Link
            href="/toys"
            className="inline-flex items-center px-4 py-2 opacity-80 backdrop-blur-sm rounded-lg text-white hover:opacity-100 hover:translate-x-[-2px] transition-all duration-200 shadow-md"
            style={{ background: "var(--khg)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Toys
          </Link>

          <div className="flex gap-2">
            <DownloadButton
              relativePath="src/app/toys/wikipedia-visualizer/page.tsx"
              fileName="WikipediaVisualizer_page.tsx"
            />
            <GitHubButton relativePath="src/app/toys/wikipedia-visualizer/" />
          </div>
        </div>

        <div className="absolute top-0 bg-white/20 backdrop-blur-[4px] w-[220px] lg:w-[320px] h-screen -z-10 ">
          <h1 className="mt-30 p-8 text-black text-3xl font-bold -mb-8">Menu</h1>
					<ul className="p-2 space-y-2">
						<li className="wg p-3 rounded-lg hover:bg-white/20 hover:translate-y-[-2px] hover:shadow transition-all duration-300 select-none cursor-text flex items-center align-middle">
							<FaSearch className="inline-block mr-2 text-xl text-black/40" />
							<input
								type="text"
								placeholder="Search..."
								className="bg-transparent outline-none w-full text-black/60 placeholder:text-black/30"
							/>
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
        </div>
				<div className="absolute bg-black/5 h-screen w-[calc(100%-220px)] lg:w-[calc(100%-320px)] left-[220px] lg:left-[320px] top-0 flex items-center justify-center flex-col -z-5">
					{activePage === "Global Map" &&
						<>
						<div className="max-w-[70vh] w-[60%] aspect-[1/1] rounded-lg bg-white">
							<Image src="/images/wiki-examples/Global.jpg" alt="Global Map" width={800} height={800} className="w-full h-full object-cover rounded-lg"/>
								
						</div>
						<h2 className="text-2xl font-bold mt-4 w-[50%]">Global Map</h2>
						<p className="text-gray-700 w-[55%] mt-2">
							Each dot represents a Wikipedia article grouped by its relevancy to close articles.<br />
							The size of the dot indicates how popular the page is.<br />
							The color indicates how often the page is edited.
						</p>
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
					<>
						<div className="max-w-[70vh] w-[60%] aspect-[1/1] rounded-lg bg-white">
							<Image src="/images/wiki-examples/bar.png" alt="Global Map" width={800} height={800} className="w-full h-full object-cover rounded-lg" /></div>
						<h2 className="text-2xl font-bold mt-4 w-[50%]">Article Stats</h2>
						<p className="text-gray-700 w-[55%] mt-2">
							Statistics and a preview of a single article displayed here<br />
							including the number of edits, word count, and last edit date.<br />
							You can also view the article's content and its edit history.
						</p>
						</>
					}
				</div>
      </div>
    </div>
  );
}
