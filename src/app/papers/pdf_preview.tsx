'use client';

import { useState } from 'react';
import { FaExpand, FaCompress, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

interface PDFPreviewProps {
  pdfPath: string;
  title: string;
}

export default function PDFPreview({ pdfPath, title }: PDFPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const openInNewTab = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed z-50 bottom-0 right-4">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-6 py-3 bg3 hover:brightness-70 tc1 rounded-t-lg transition-colors duration-200 shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          Preview PDF
        </button>
      </div>

      {/* PDF Preview Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          
          
          {/* PDF Container */}
          <div className={`relative right-4 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl transition-all duration-100 ${
            isExpanded ? 'w-[600px] h-[700px]' : 'w-[400px] h-[500px]'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold tc1 truncate">{title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  onClick={openInNewTab}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Open in new tab"
                >
                  <FaExternalLinkAlt />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="h-full pb-16">
              <iframe
                src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0"
                title={title}
              />
            </div>

            
          </div>
        </div>
      )}
    </>
  );
}