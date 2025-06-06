import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 border-b border-indigo-500 text-white shadow-md">
      <div className="flex items-center">
        {/* Hamburger icon for mobile */}
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold ml-4">Tutorin-UI</h1>
      </div>

      <div className="flex items-center">
        <span className="text-white font-medium">Welcome</span>
        <button className="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
