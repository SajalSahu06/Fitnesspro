// src/pages/SomeProtectedPage.js

import React, { useState } from 'react';
import { validateApiKey } from '../components/validateApiKey';

const SomeProtectedPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [accessGranted, setAccessGranted] = useState(null);

  const handleApiKeyValidation = async () => {
    const result = await validateApiKey(apiKey);

    if (result.valid) {
      setAccessGranted(true);
    } else {
      setAccessGranted(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={handleApiKeyValidation}>Validate API Key</button>

      {accessGranted === null ? (
        <div>Enter your key to check access</div>
      ) : accessGranted ? (
        <div>Access granted! You can now use the service.</div>
      ) : (
        <div>Invalid API Key. Please try again.</div>
      )}
    </div>
  );
};

export default SomeProtectedPage;
