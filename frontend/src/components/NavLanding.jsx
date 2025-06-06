import React from 'react';
import Tutorin_Logo from '../assets/Tutorin_Logo.png';

const NavLanding = ({ onSignInClick }) => {
  return (
    <nav className="w-full flex items-center justify-between p-6 px-8 relative z-10">
      <div className="flex items-center space-x-4">
        <img src={Tutorin_Logo} alt="Tutorin Logo" className="w-12 h-auto" />
        <span className="font-bold text-3xl">Tutorin-UI</span>
      </div>
      <div className="flex flex-wrap items-center space-x-4 md:space-x-6">
        <button className="flex items-center hover:text-gray-300 rounded-md py-2 px-4">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          Talk to sales
        </button>
        <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-full">
          Get free trial
        </button>
        <button
          onClick={onSignInClick}
          className="hover:text-gray-300 rounded-md py-2 px-4"
        >
          Sign in
        </button>
      </div>
    </nav>
  );
};

export default NavLanding;
