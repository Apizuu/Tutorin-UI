import React, { useState } from 'react';

import SignInModal from '../components/SignInModal';
import NavLanding from '../components/NavLanding';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignInClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 text-white font-sans flex flex-col">
      {/* Navbar */}
      <NavLanding onSignInClick={handleSignInClick} />

      {/* Main Content */}
      <main className="relative flex-grow w-full flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="z-10 w-full max-w-screen-xl text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Temukan dan Atur Sesi Belajar
            <br />
            dengan Mudah di Tutorin
          </h1>
          <p className="text-lg md:text-xl mb-8">
            adalah platform yang dirancang untuk mempermudah tutor dan siswa dalam merencanakan sesi belajar secara fleksibel dan efisien. Tutor dapat membuat jadwal sesi belajar lengkap dengan informasi topik dan peserta. Siswa dapat melihat daftar sesi yang tersedia dan langsung bergabung sesuai kebutuhan mereka.
          </p>
          <div className="mt-4">
            <a href="#" className="text-blue-400 hover:underline text-2xl font-semibold">
              Learn more &gt;
            </a>
          </div>
        </div>
      </main>

      {/* Sign In Modal */}
      {isModalOpen && <SignInModal onClose={handleCloseModal} />}
    </div>
  );
};

export default LandingPage;
