import React from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Login error:', error.message);
      alert('Failed to log in. Please try again.');
    }
  };

  React.useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If logged in, generate key and navigate to homepage
        const user = data.session.user;
        const key = generateUniqueKey();

        const { error } = await supabase
          .from('api_keys')
          .insert({ user_id: user.id, api_key: key });

        if (error) {
          console.error('Error storing API key:', error.message);
          alert('Failed to generate API key.');
        } else {
          localStorage.setItem('apiKey', key); // Store in localStorage
          navigate('/'); // Redirect to homepage
        }
      }
    };

    handleSession();
  }, [navigate]);

  const generateUniqueKey = () => {
    return 'key-' + Math.random().toString(36).substr(2, 10);
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
