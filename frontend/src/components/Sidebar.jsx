import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [username, setUsername] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const res = await response.json();
      setUsername(res.username || 'User');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUsername('User');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <aside
      className={`bg-gradient-to-b from-[#0a1e3f] to-blue-950 text-white w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 shadow-lg`}
    >
      {/* Profile section */}
      <div className="flex items-center space-x-3 px-2">
        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{username}</h2>
        </div>
      </div>

      {/* Navigation section */}
      <nav className="mt-6">
        <Link
          to="/dashboard"
          className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-blue-900"
        >
          Dashboard
        </Link>
        <Link
          to="/TopUp"
          className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-blue-900"
        >
          TopUp
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
