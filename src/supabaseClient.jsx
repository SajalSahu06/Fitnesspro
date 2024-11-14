import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nplllqyjcujfzkjvhxzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dmhuZmdlanFibXd1ZXhyeXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3ODAxNTAsImV4cCI6MjAzODM1NjE1MH0.bSMnuG_f5q0DWkWQu6pZcdfsjMgsSfGKKZSKvmBJ0J8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
