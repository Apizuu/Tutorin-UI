import React, { useState } from 'react';

const SignInModal = ({ onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    year_joined: '',
    major: '',
    faculty: '',
  });

  const handleToggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      year_joined: '',
      major: '',
      faculty: '',
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignIn
      ? 'http://127.0.0.1:5000/auth/login'
      : 'http://127.0.0.1:5000/auth/register';

    const payload = isSignIn
      ? {
          username: formData.username,
          password: formData.password,
        }
      : {
          username: formData.username,
          password: formData.password,
          year_joined: parseInt(formData.year_joined),
          major: formData.major,
          faculty: formData.faculty,
        };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        if (isSignIn) {
          // ✅ Save token and redirect
          localStorage.setItem('token', data.token);
          window.location.href = '/dashboard';
        } else {
          // ✅ Show success message, switch to sign-in
          alert('Register successful! Please sign in.');
          setIsSignIn(true);
          setFormData({
            username: '',
            password: '',
            confirmPassword: '',
            year_joined: '',
            major: '',
            faculty: '',
          });
        }
      } else {
        alert(data.message || data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Network error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 border-gray-600"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 border-gray-600"
              placeholder="********"
              required
            />
          </div>
          {!isSignIn && (
            <>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 border-gray-600"
                  placeholder="********"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="year_joined" className="block text-gray-300 text-sm font-bold mb-2">
                  Year Joined
                </label>
                <input
                  type="number"
                  id="year_joined"
                  value={formData.year_joined}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 border-gray-600"
                  placeholder="2022"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="major" className="block text-gray-300 text-sm font-bold mb-2">
                  Major
                </label>
                <input
                  type="text"
                  id="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 border-gray-600"
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="faculty" className="block text-gray-300 text-sm font-bold mb-2">
                  Faculty
                </label>
                <input
                  type="text"
                  id="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 border-gray-600"
                  placeholder="Engineering"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full w-full"
          >
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              onClick={handleToggleForm}
              className="text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
