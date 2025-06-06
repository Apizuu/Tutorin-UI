import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const SessionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [openParticipants, setOpenParticipants] = useState({});

  const currentUsername = localStorage.getItem('username');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/sessions/sessions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
      showMessage(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleJoinSession = async (sessionId) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/sessions/join_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const result = await response.json();

      if (!response.ok) {
        showMessage(`Error: ${result.error || 'Failed to join session'}`, 'error');
      } else {
        showMessage(result.message || 'Successfully joined session!', 'success');
        fetchSessions();
      }
    } catch (err) {
      console.error('Error joining session:', err);
      showMessage('Failed to send request to join session.', 'error');
    }
  };

  const toggleParticipants = (sessionId) => {
    setOpenParticipants((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 relative">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Sessions</h2>

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

          {loading ? (
            <div className="text-center text-gray-600 text-lg mt-20">Loading sessions...</div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg mt-20">Error fetching sessions: {error}</div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-gray-600 text-lg mt-20">No sessions available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 flex flex-col items-start w-full text-left border-l-4 border-blue-500"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Session Details</h3>
                  <p className="text-gray-700 mb-1"><span className="font-semibold">Date & Time:</span> {new Date(session.date).toLocaleString()}</p>
                  <p className="text-gray-700 mb-1"><span className="font-semibold">Location:</span> {session.location}</p>
                  <p className="text-gray-700 mb-1"><span className="font-semibold">Participants:</span> {session.tutees.length} / {session.limit}</p>
                  <p className="text-gray-700 mb-1"><span className="font-semibold">Fee:</span> {session.fee}</p>
                  <p className="text-gray-700 mb-4"><span className="font-semibold">Tutor:</span> {session.tutor}</p>

                  {/* Toggle Participants */}
                  <span
                    onClick={() => toggleParticipants(session.id)}
                    className="text-sm text-blue-600 font-medium cursor-pointer hover:underline mb-3"
                  >
                    {openParticipants[session.id] ? 'Hide Participants' : 'Show Participants'}
                  </span>

                  {/* Participants list with bullet points */}
                  {openParticipants[session.id] && (
                    <ul className="list-disc list-inside text-sm text-gray-800 mb-3 pl-2">
                      {session.tutees.length === 0 ? (
                        <li className="italic text-gray-500">No participants yet.</li>
                      ) : (
                        session.tutees.map((tutee, index) => (
                          <li key={index}>{tutee}</li>
                        ))
                      )}
                    </ul>
                  )}

                  <button
                    onClick={() => handleJoinSession(session.id)}
                    className={`mt-auto px-6 py-3 rounded-lg font-semibold transition duration-200 w-full text-center
                      ${currentUsername === session.tutor
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : session.tutees.length >= session.limit
                          ? 'bg-red-500 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                      }`}
                    disabled={currentUsername === session.tutor || session.tutees.length >= session.limit}
                  >
                    {currentUsername === session.tutor
                      ? 'Your Session'
                      : session.tutees.length >= session.limit
                        ? 'Session Full'
                        : 'Join Session'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SessionPage;
