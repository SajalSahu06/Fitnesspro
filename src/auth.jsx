import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Auth = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null); // Reset error state before attempting sign-in
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback', // Adjust this if needed
      }
    });
    if (error) {
      setError('Error signing in: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        onLogin(data.session.user);
      }
    };
    checkSession();
  }, [onLogin]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <button
        onClick={signInWithGoogle}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {error && (
        <p className="mt-4 text-red-500">{error}</p> // Display the error message to the user
      )}
    </div>
  );
};

export default Auth;
