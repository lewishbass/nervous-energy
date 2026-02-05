import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaE } from 'react-icons/fa6';

function FooterContent() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg2 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-base font-semibold mb-3 tc1">About</h3>
            <p className="tc2 text-sm">
              A platform for sharing thoughts and ideas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 tc1">Links</h3>
            <ul className="space-y-1.5">
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
            <ul className="space-y-1.5">
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
                className="tc2 hover:tc1 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="tc2 hover:tc1 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="tc2 hover:tc1 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="mailto:contact@example.com"
                className="tc2 hover:tc1 transition-colors"
                aria-label="Email"
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
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs tc2">
            <p>
              © {currentYear} Nervous Energy. All rights reserved.
            </p>
            <p>
              Made with ❤️ by{' '}
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

export { FooterContent };