import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Adjust path if different
import Navbar from '../components/Navbar';   // Adjust path if different
import SessionPage from './SessionPage';    // Import the SessionPage component

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility
  const [showForm, setShowForm] = useState(false);
  const [showSessionsPage, setShowSessionsPage] = useState(false); // New state for navigation
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    limit: '',
    fee: '',
  });
  const [message, setMessage] = useState(''); // State for success/error messages
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to display messages in a modal
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    // Automatically hide message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleCardClick = (type) => {
    if (type === 'Tutors') {
      setShowForm(true);
    } else if (type === 'Tutees') {
      setShowSessionsPage(true); // Set state to show SessionPage
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/sessions/create_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          date: formData.date,
          location: formData.location,
          limit: parseInt(formData.limit),
          fee: parseFloat(formData.fee),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showMessage(`Error: ${result.error || 'Failed to create session'}`, 'error');
      } else {
        showMessage(`Session created! ID: ${result.session_id}`, 'success');
        setShowForm(false);
        setFormData({ date: '', location: '', limit: '', fee: '' });
      }
    } catch (error) {
      console.error(error);
      showMessage('Failed to send request.', 'error');
    }
  };

  // If showSessionsPage is true, render the SessionPage instead of the dashboard content
  if (showSessionsPage) {
    return <SessionPage />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 relative">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Welcome to the Dashboard!
          </h2>

          {/* Message Modal */}
          {message && (
            <div className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in`}>
              <div className={`bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl relative ${messageType === 'success' ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}>
                <button
                  onClick={() => setMessage('')}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold bg-transparent border-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  &times;
                </button>
                <h3 className={`text-xl font-bold mb-4 text-center ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {messageType === 'success' ? 'Success!' : 'Error!'}
                </h3>
                <p className="text-gray-700 text-center">{message}</p>
              </div>
            </div>
          )}

          {/* Modal Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl animate-fade-in-up relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold bg-transparent border-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create a New Session</h3>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="date" className="block mb-2 text-sm font-semibold text-gray-700">Date & Time</label>
                    <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block mb-2 text-sm font-semibold text-gray-700">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="limit" className="block mb-2 text-sm font-semibold text-gray-700">Participant Limit</label>
                    <input
                      type="number"
                      id="limit"
                      name="limit"
                      value={formData.limit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition duration-200"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="fee" className="block mb-2 text-sm font-semibold text-gray-700">Session Fee</label>
                    <input
                      type="number"
                      id="fee"
                      name="fee"
                      value={formData.fee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition duration-200"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    >
                      Create Session
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center mt-20">
            {/* Tutors Card */}
            <div
              className="bg-white p-8 rounded-lg shadow-xl cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex flex-col items-center justify-center w-72 h-80 text-center border-b-4 border-blue-500"
              onClick={() => handleCardClick('Tutors')}
            >
              <div className="mb-4">
                <svg
                  className="w-28 h-28"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="blue"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="32" cy="20" r="12" />
                  <path d="M16 52c0-8.84 7.16-16 16-16s16 7.16 16 16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tutors</h3>
              <p className="text-gray-600 text-sm">
                Create and manage your own learning sessions for others to join.
              </p>
            </div>

            {/* Tutees Card */}
            <div
              className="bg-white p-8 rounded-lg shadow-xl cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex flex-col items-center justify-center w-72 h-80 text-center border-b-4 border-green-500"
              onClick={() => handleCardClick('Tutees')}
            >
              <div className="mb-4 text-green-600">
                <svg
                  className="w-28 h-28"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="32" cy="20" r="12" />
                  <path d="M16 52c0-8.84 7.16-16 16-16s16 7.16 16 16" />
                  <line x1="48" y1="20" x2="58" y2="20" />
                  <line x1="53" y1="15" x2="53" y2="25" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tutees</h3>
              <p className="text-gray-600 text-sm">
                Browse available learning sessions and join as a participant.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
