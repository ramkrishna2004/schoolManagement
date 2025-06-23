import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-sky-200 to-sky-100 border-t border-sky-300 text-blue-900 pt-10 pb-6 mt-12 shadow-inner overflow-hidden">
      {/* Animated SVG accents */}
      <svg className="absolute left-0 top-0 w-24 h-24 sm:w-32 sm:h-32 opacity-30 z-0" viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="100" rx="100" ry="60" fill="#bae6fd" /></svg>
      <svg className="absolute right-0 bottom-0 w-24 h-24 sm:w-32 sm:h-32 opacity-20 z-0" viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="100" rx="100" ry="60" fill="#7dd3fc" /></svg>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
        {/* Brand & Slogan */}
        <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-sky-400 rounded-full p-2 shadow-lg">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#38bdf8"/><text x="16" y="21" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">SMS</text></svg>
            </span>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-sky-800">SchoolMS</span>
          </div>
          <div className="text-xs sm:text-sm text-blue-800 mt-1 text-center md:text-left">Empowering Schools, Teachers & Students</div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex flex-col items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center md:justify-start">
            <Link to="/about">
              <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs sm:text-sm">About Us</button>
            </Link>
            <Link to="/contact">
              <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs sm:text-sm">Contact Us</button>
            </Link>
          </div>
        </div>
        {/* Contact & Social */}
        <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
          <div className="font-semibold text-sm sm:text-base">Contact Us</div>
          <div className="text-xs sm:text-sm flex items-center gap-2"><span role="img" aria-label="phone">📞</span> <a href="tel:9059448685" className="hover:text-sky-600 transition">9059448685</a></div>
          <div className="text-xs sm:text-sm flex items-center gap-2"><span role="img" aria-label="email">✉️</span> <a href="mailto:mnrkchari@gmail.com" className="hover:text-sky-600 transition">mnrkchari@gmail.com</a></div>
         
        </div>
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto mt-8 border-t border-sky-200 pt-4 text-center text-xs sm:text-sm text-blue-800 flex flex-col md:flex-row justify-between items-center gap-2 px-2 sm:px-6 lg:px-8 xl:px-12 2xl:px-20">
        <span className="block">&copy; {new Date().getFullYear()} Student Management System. All rights reserved.</span>
        <span className="block text-gray-500 font-normal">Crafted by 
          <Link to="/aboutUs">
            <button
              className="inline-block ml-1 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 text-xs sm:text-sm border-0 cursor-pointer"
              aria-label="About Rama Krishna Chari MN"
              onClick={() => { window.scrollTo(0, 0); }}
            >
              Rama Krishna Chari MN
            </button>
          </Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer; 