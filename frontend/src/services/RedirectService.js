// src/services/RedirectService.js

const BACKEND_LOGIN_INITIATE_URL = 'http://192.168.232.87:5000/auth/login';

const RedirectService = () => {
  // Directly redirect the browser to your backend's login endpoint.
  // The backend will then issue a 302 redirect to the SSO UI.
  window.location.href = BACKEND_LOGIN_INITIATE_URL;
};

export default RedirectService;