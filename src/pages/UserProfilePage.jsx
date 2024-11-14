// src/pages/UserProfilePage.js

import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

const UserProfilePage = () => {
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      const user = supabase.auth.user(); // Get the logged-in user ID

      if (user) {
        // Fetch the API key from the database for the logged-in user
        const { data, error } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching API key:', error.message);
        } else {
          setApiKey(data.api_key);
        }
      }
    };

    fetchApiKey();
  }, []);

  return (
    <div>
      {apiKey ? (
        <div>
          <h2>Your API Key: {apiKey}</h2>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserProfilePage;
