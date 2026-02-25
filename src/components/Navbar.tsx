'use client';

import Image from "next/image";
import Link from "next/link";


interface NavbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 print:hidden">
      <div className="flex justify-between items-center h-full px-6">
        {/* Logo placeholder */}
        <Link className="w-10 h-10" href='/'>
          <Image src="/filter.svg" alt="Logo" width={40} height={40} style={{width:40, height:40}}/>
        </Link>

        {/* Menu Button */}
        <button 
          onClick={onMenuToggle} 
          className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-50"
          style={{pointerEvents: isMenuOpen ? 'none' : 'auto'}}
        >
          <div className={`w-6 h-0.5 bg4 transition-transform ${
            isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}></div>
          <div className={`w-6 h-0.5 bg4 transition-opacity ${
            isMenuOpen ? 'opacity-0' : ''
            }`}></div>
          <div className={`w-6 h-0.5 bg4 transition-transform ${
            isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}></div>
        </button>
      </div>
    </nav>
  );
}