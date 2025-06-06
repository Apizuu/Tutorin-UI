import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const TopUpPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [balance, setBalance] = useState('Loading...');
  const [currentUsername, setCurrentUsername] = useState('Memuat...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

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

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengambil saldo');
      }

      const data = await response.json();
      setBalance(data.balance);
      setCurrentUsername(data.username);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err.message);
      showMessage(`Error: ${err.message}`, 'error');
      setBalance('Gagal memuat');
      setCurrentUsername('Tidak diketahui');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (!topUpAmount || isNaN(topUpAmount) || parseFloat(topUpAmount) <= 0) {
      showMessage('Jumlah tidak valid', 'error');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUsername,
          amount: parseFloat(topUpAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Top-up gagal');
      }

      showMessage(data.message, 'success');
      setIsTopUpModalOpen(false);
      setTopUpAmount('');
      fetchBalance();
    } catch (err) {
      console.error('Top-up error:', err);
      showMessage(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 relative">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Informasi Saldo Anda
          </h2>

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
                  {messageType === 'success' ? 'Berhasil!' : 'Error!'}
                </h3>
                <p className="text-gray-700 text-center">{message}</p>
              </div>
            </div>
          )}

          {/* Konten utama saldo dan tombol */}
          <div className="flex justify-center items-center mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border-b-4 border-purple-500">
              {loading ? (
                <div className="text-gray-600 text-xl">Memuat saldo...</div>
              ) : error ? (
                <div className="text-red-600 text-xl">Error: {error}</div>
              ) : (
                <>
                  <p className="text-gray-700 text-lg mb-4">
                    Selamat datang kembali, <span className="font-bold text-blue-700">{currentUsername}</span>!
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-900">{balance}</h3>
                  <p className="text-gray-500 mt-2 mb-6">Saldo Anda saat ini</p>
                  <button
                    onClick={() => setIsTopUpModalOpen(true)}
                    className="mt-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300"
                  >
                    Top Up Saldo
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Modal Top Up */}
          {isTopUpModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
                <button
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold mb-4 text-center text-purple-700">Top Up Saldo</h3>
                <form onSubmit={handleTopUpSubmit}>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Masukkan jumlah top-up"
                    className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
                  >
                    Konfirmasi Top Up
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TopUpPage;
