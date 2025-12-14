// Paper Link Component
//displays the name of a paper and redirects to its page when clicked
// on hover, loads a preview of the paper

import { set } from "mongoose";
import { useState, useRef, JSX } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface PaperLinkProps {
  title: string;
  url?: string;
  pdfPath?: string; // path to the PDF file for preview
  arxivId?: string; // arxiv id for preview
  preferredPreview?: "arxiv" | "pdf" | "url"; // preferred preview type
}

const PaperLink = ({
  title,
  url,
  pdfPath,
  arxivId,
  preferredPreview,
}: PaperLinkProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | undefined>(
    undefined
  );
  const [previewElement, setPreviewElement] = useState<JSX.Element | undefined>(
    undefined
  );

  const loadingHook = useRef<NodeJS.Timeout | null>(null);
  const unfocusHook = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);

    // stop unfocus timeout if it exists
    if (unfocusHook.current) {
      clearTimeout(unfocusHook.current);
    }

    loadPreview();
  };

  const handleMouseLeave = () => {
    if (unfocusHook.current) {
      clearTimeout(unfocusHook.current);
    }
    unfocusHook.current = setTimeout(() => {
      setIsHovered(false);
      if (loadingHook.current) {
        clearTimeout(loadingHook.current);
      }
    }, 200);
  };

  const handleClick = () => {
    if (typeof window !== "undefined") {
      if (url) {
        window.open(url, "_blank");
      } else if (arxivId) {
				window.open(`https://arxiv.org/abs/${arxivId}`, "_blank");
      } else if (pdfPath) {
        window.open(pdfPath, "_blank");
      }
    }
  };

  const loadPreview = () => {
    // if we already have preview element, don't load again
    if (previewElement) return;
    setLoadingPreview(true);
    setPreviewError(undefined);
    // placeholder loading preview text
    if (loadingHook.current) {
      clearTimeout(loadingHook.current);
    }

    // load preferred preview type first
    if (preferredPreview === "arxiv" && arxivId) {
      loadArxivPreview(arxivId);
      return;
    } else if (preferredPreview === "pdf" && pdfPath) {
      loadPDFPreview(pdfPath);
      return;
    } else if (preferredPreview === "url" && url) {
      loadURLPreview(url);
      return;
    }

    if (arxivId) {
      loadArxivPreview(arxivId);
    } else if (pdfPath) {
      loadPDFPreview(pdfPath);
    } else if (url) {
      loadURLPreview(url);
    } else {
      setPreviewError("No preview available");
      setLoadingPreview(false);
    }

    return;
  };

  function openInNewTab(url: string) {
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }

  function loadURLPreview(url: string) {
    setPreviewElement(
      <div className="w-full aspect-1/1 overflow-hidden">
        <iframe
          src={url}
          title="Article Preview"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    );
    loadingHook.current = setTimeout(() => {
      setLoadingPreview(false);
    }, 500);
    setPreviewError(undefined);
  }

  function loadPDFPreview(pdfPath: string) {
    setPreviewElement(
      <div className="w-full aspect-1/1">
        <iframe
          src={pdfPath}
          title="PDF Preview"
          className="w-full h-full"
        ></iframe>
      </div>
    );
    loadingHook.current = setTimeout(() => {
      setLoadingPreview(false);
    }, 500);
    setPreviewError(undefined);
  }

  function loadArxivPreview(arxivId: string) {
    // fetch the abstract from arxiv api
    fetch(`/.netlify/functions/arxive_fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ arxivId }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { title, authors, abstract, pdfUrl } = data;
        if (!data || !title) {
          console.error(data);
          throw new Error("Invalid data from arXiv");
        }
        setPreviewElement(
          <div className="m-3 mr-2 pr-1 max-h-60 overflow-y-scroll mini-scroll">
            <h3
              className="font-bold tc1 cursor-pointer user-select-none hover:underline"
              onClick={() => openInNewTab(pdfUrl || `https://arxiv.org/abs/${arxivId}`)}
            >
              {title || "No title available"}
            </h3>
            <p className="text-sm tc3">{authors || "No authors available"}</p>
            <p className="text-sm tc2 text-justify">
              {abstract || "No abstract available"}
            </p>
          </div>
        );
      })
      .catch((error) => {
        console.error(error);
        setPreviewError("Error loading preview");
      })
      .finally(() => {
        setLoadingPreview(false);
      });
  }

  return (
    <>
      <span
        className="tc1 cursor-pointer user-select-none font-semibold"
        onClick={handleClick}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        {title}
        <FaExternalLinkAlt className="inline ml-1 text-blue-600" size={13} />
      </span>
      {isHovered && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-0 mt-0 w-96 max-w-full"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
        >
          {loadingPreview && <p className="m-3 ml-6">Loading preview...</p>}
          {previewError && <p className="text-red-500">{previewError}</p>}
          {!loadingPreview && !previewError && previewElement && (
            <div>{previewElement}</div>
          )}
        </div>
      )}
    </>
  );
};

export default PaperLink;
