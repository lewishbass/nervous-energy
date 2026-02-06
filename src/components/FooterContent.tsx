import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import { BiSolidCoffee } from "react-icons/bi";

import { copyToClipboard } from '@/scripts/clipboard';

interface FooterContentProps {
}

export default function FooterContent(props: FooterContentProps) {
  const currentYear = new Date().getFullYear();

  return (
		<footer className="w-full bg2 border-t-3 border-gray-300 dark:border-gray-700 mt-auto opacity-50">
			<div className="max-w-2xl mx-auto px-8 py-4">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-base font-semibold mb-3 tc1">About</h3>
            <p className="tc2 text-sm">
							A platform for me to publish various projects, and learn about web development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 tc1">Links</h3>
						<ul className="-mt-1">
              <li>
                <Link href="/" className="tc2 text-sm hover:tc1 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="tc2 text-sm hover:tc1 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="tc2 text-sm hover:tc1 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="tc2 text-sm hover:tc1 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold mb-3 tc1">Support</h3>
						<ul className="-mt-1">
              <li>
                <a 
                  href="https://github.com/lewishbass/nervous-energy/issues/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tc2 text-sm hover:tc1 transition-colors"
                >
                  Report Issue
                </a>
              </li>
              <li>
                <Link href="/faq" className="tc2 text-sm hover:tc1 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="tc2 text-sm hover:tc1 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-base font-semibold mb-3 tc1">Connect</h3>
            <div className="flex space-x-3 mb-4">
              <a 
                href="https://github.com/lewishbass" 
                target="_blank" 
                rel="noopener noreferrer"
								className="tc2 hover:tc1 transition-colors cursor-pointer select-none"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
								className="tc2 hover:tc1 transition-colors cursor-pointer select-none"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a 
								href="https://www.linkedin.com/in/lewis-bass/" 
                target="_blank" 
                rel="noopener noreferrer"
								className="tc2 hover:tc1 transition-colors cursor-pointer select-none"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
							<a 
								className="tc2 hover:tc1 transition-colors cursor-pointer select-none"
								onClick={() => copyToClipboard('lewishbass@gmail.com')}
              >
                <FaEnvelope size={18} />
              </a>
            </div>
            <div>
              <p className="tc2 text-xs mb-2">Newsletter</p>
              <div className="flex items-center bg4 rounded-full shadow-md w-40">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="flex-1 px-4 py-2 text-sm bg-transparent border-none rounded-full focus:outline-none tc4 w-2 "
                />
                <button className="cursor-pointer select-none mr-[2px] h-8 w-8 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center rounded-full">
                  <FaEnvelope size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
				<div className="mt-1 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs tc2">
						<p className="mb-1">
              © {currentYear} Nervous Energy. All rights reserved.
            </p>
            <p>
							Made with <FaHeart className="inline text-red-400 mb-1" size={16} /> and <BiSolidCoffee className="inline text-brown-400 mb-0.5" size={16} /> by{' '}
              <a 
                href="https://lewisbass.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:tc1 transition-colors"
              >
                Lewis Bass
              </a>
              . Hosted on{' '}
              <a 
                href="https://www.netlify.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:tc1 transition-colors"
              >
                Netlify
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
