import React, { useEffect, useState } from 'react';

// Main application component for the CAS callback page
const App = () => {
  // State to store the CAS ticket received from the URL
  const [ticket, setTicket] = useState(null);
  // State to manage the validation status: 'idle', 'loading', 'success', 'failure'
  const [validationStatus, setValidationStatus] = useState('idle');
  // State to store messages related to the validation process
  const [validationMessage, setValidationMessage] = useState('');
  // State to store the authenticated username if validation is successful
  const [username, setUsername] = useState(null);

  // useEffect hook to run side effects (fetching data) after render
  useEffect(() => {
    // Parse URL parameters to get the 'ticket'
    const params = new URLSearchParams(window.location.search);
    const receivedTicket = params.get('ticket');

    if (receivedTicket) {
      setTicket(receivedTicket);
      setValidationStatus('loading'); // Set status to loading while validating
      setValidationMessage('Validating ticket with CAS server...');
      
      // Define the CAS service URL for validation
      // IMPORTANT: Replace 'http://localhost:5173/callback' with your actual callback URL
      // registered with your CAS server.
      const serviceURL = encodeURIComponent('http://localhost:5173/callback');
      const casValidateURL = `https://sso.ui.ac.id/cas2/serviceValidate?ticket=${receivedTicket}&service=${serviceURL}`;

      // Function to perform the ticket validation fetch request
      const validateTicket = async () => {
        try {
          // Make the GET request to the CAS validation endpoint
          const response = await fetch(casValidateURL);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // Get the response text (expected to be XML)
          const responseText = await response.text();
          console.log('CAS Validation Response:', responseText);

          // Parse the XML response
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(responseText, "text/xml");

          // Check for authentication success
          const authenticationSuccess = xmlDoc.querySelector('cas\\:authenticationSuccess, authenticationSuccess');
          if (authenticationSuccess) {
            const userElement = authenticationSuccess.querySelector('cas\\:user, user');
            const authenticatedUser = userElement ? userElement.textContent : 'Unknown User';
            
            setUsername(authenticatedUser);
            setValidationStatus('success');
            setValidationMessage(`Authentication successful for user: ${authenticatedUser}`);
          } else {
            // Check for authentication failure
            const authenticationFailure = xmlDoc.querySelector('cas\\:authenticationFailure, authenticationFailure');
            const errorCode = authenticationFailure ? authenticationFailure.getAttribute('code') : 'UNKNOWN_ERROR';
            const errorMessage = authenticationFailure ? authenticationFailure.textContent : 'No specific error message.';

            setValidationStatus('failure');
            setValidationMessage(`Authentication failed. Code: ${errorCode}. Message: ${errorMessage.trim()}`);
            setError('CAS ticket validation failed.');
          }

        } catch (err) {
          console.error('Error during CAS ticket validation:', err);
          setValidationStatus('failure');
          setValidationMessage(`Failed to validate ticket: ${err.message}`);
        }
      };

      validateTicket(); // Call the validation function
    } else {
      // If no ticket is found in the URL
      setValidationStatus('failure');
      setValidationMessage('No CAS ticket found in the URL. Authentication may have failed.');
      console.error('No CAS ticket found in the URL after SSO redirection.');
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // Render the UI based on validation status
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-800 via-blue-900 to-gray-900 text-white font-sans flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 rounded-md bg-purple-700 px-6 py-3 shadow-xl">SSO Callback Handler</h1>

      {validationStatus === 'loading' && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center animate-pulse">
          <p className="text-xl mb-2">Processing...</p>
          <p className="text-lg">{validationMessage}</p>
        </div>
      )}

      {validationStatus === 'success' && (
        <div className="bg-green-700 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl mb-2 font-semibold">Login successful!</p>
          <p className="text-lg">
            Welcome, <span className="font-mono text-yellow-300">{username || 'User'}</span>!
          </p>
          <p className="mt-4 text-sm text-green-200">
            Your CAS ticket was successfully validated.
          </p>
          {ticket && (
            <div className="mt-4 p-3 bg-green-800 rounded-md break-all">
              <strong className="text-green-300">Received CAS Ticket:</strong><br/>
              <span className="font-mono text-sm text-green-100">{ticket}</span>
            </div>
          )}
        </div>
      )}

      {validationStatus === 'failure' && (
        <div className="bg-red-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl mb-2 font-semibold">Authentication Failed</p>
          <p className="text-lg">
            {validationMessage || 'An unknown error occurred during authentication.'}
          </p>
          {ticket && (
            <div className="mt-4 p-3 bg-red-900 rounded-md break-all">
              <strong className="text-red-300">Attempted Ticket:</strong><br/>
              <span className="font-mono text-sm text-red-100">{ticket}</span>
            </div>
          )}
        </div>
      )}

      {validationStatus === 'idle' && (
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl mb-2">Waiting for CAS Redirection...</p>
          <p className="text-lg">Please ensure you are redirected from the CAS login page.</p>
        </div>
      )}
    </div>
  );
};

export default App;
