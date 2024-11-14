// src/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient('https://nplllqyjcujfzkjvhxzr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dmhuZmdlanFibXd1ZXhyeXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3ODAxNTAsImV4cCI6MjAzODM1NjE1MH0.bSMnuG_f5q0DWkWQu6pZcdfsjMgsSfGKKZSKvmBJ0J8');

export default supabase;
