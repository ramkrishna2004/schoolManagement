import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation links as a function for reuse
  const navLinkClass =
    "rounded-full px-4 py-2 text-sky-800 font-semibold hover:bg-sky-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200 shadow-sm";
  const navLinks = (
    <>
      <Link to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</Link>
      
      {(user?.role === 'admin' || user?.role === 'teacher') && (
        <>
          <Link to="/students" className={navLinkClass} onClick={() => setMenuOpen(false)}>Students</Link>
          <Link to="/schedules" className={navLinkClass} onClick={() => setMenuOpen(false)}>Schedule</Link>
          <Link to="/tests" className={navLinkClass} onClick={() => setMenuOpen(false)}>Tests</Link>
          <Link to="/materials" className={navLinkClass} onClick={() => setMenuOpen(false)}>Materials</Link>
        </>
      )}
      {user?.role === 'student' && (
        <>
          <Link to="/student/classes" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Classes</Link>
          <Link to="/student/tests" className={navLinkClass} onClick={() => setMenuOpen(false)}>Tests</Link>
          <Link to="/materials" className={navLinkClass} onClick={() => setMenuOpen(false)}>Materials</Link>
        </>
      )}
      <Link to="/scores" className={navLinkClass} onClick={() => setMenuOpen(false)}>Scores</Link>
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-sky-200 to-sky-100 shadow-xl sticky top-0 z-30 border-b border-sky-300 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between h-16 items-center min-w-0">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 min-w-0">
            <span className="inline-block bg-sky-400 rounded-full p-2 shadow-lg">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#38bdf8"/><text x="16" y="21" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">SMS</text></svg>
            </span>
            <Link to="/" className="text-l font-extrabold tracking-tight text-sky-800 hover:text-blue-700 transition-colors duration-200">School Management System</Link>
          </div>
          {/* Hamburger for mobile */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-full text-sky-700 hover:text-white hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-400 shadow transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          {/* Desktop menu */}
          <div className="hidden xl:flex xl:items-center xl:space-x-8">
            {user && (
              <div className="flex items-center gap-2">{navLinks}</div>
            )}
            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/profile"
                  className="text-sky-700 hidden xl:inline hover:text-blue-700 font-bold transition-colors duration-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  style={{ textDecoration: 'none' }}
                  aria-label="View Profile"
                >
                  {user.name ? (user.name.split(' ')[0] || user.name.substring(0, 6)) : ''}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-sky-400 to-blue-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:scale-105 hover:shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-sky-400 to-blue-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:scale-105 hover:shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200"
                >
                  Login
                </Link>
                
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menuOpen */}
      <div className={`xl:hidden transition-all duration-200 ${menuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="w-full max-w-xs mx-auto px-2 pt-2 pb-3 space-y-1 bg-gradient-to-br from-sky-100 to-sky-200 shadow-2xl rounded-b-2xl border-t border-sky-200 animate-fadeIn overflow-y-auto max-h-[90vh]">
          {user && (
            <div className="flex flex-col space-y-1">{navLinks}</div>
          )}
          {/* Auth buttons */}
          {user ? (
            <>
              <Link
                to="/profile"
                className="block text-sky-700 font-bold px-4 py-2 rounded-full text-sm hover:bg-sky-200 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                onClick={() => setMenuOpen(false)}
                aria-label="View Profile"
              >
                {user.name ? (user.name.split(' ')[0] || user.name.substring(0, 6)) : ''}
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:scale-105 hover:shadow-lg hover:bg-blue-500 mt-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 mt-2">
              <Link
                to="/login"
                className="text-sky-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 