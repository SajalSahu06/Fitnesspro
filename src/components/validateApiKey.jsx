// src/utils/validateApiKey.js

import supabase from '../supabaseClient';

export const validateApiKey = async (apiKey) => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('api_key', apiKey)
    .single();

  if (error) {
    return { valid: false };
  } else {
    return { valid: true, userId: data.user_id };
  }
};
