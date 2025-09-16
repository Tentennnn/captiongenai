import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxorrtzdmhmspkwkkrjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4b3JydHpkbWhtc3Brd2trcmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5OTU2ODYsImV4cCI6MjA3MzU3MTY4Nn0.Y0FbBGc6PCD1Kb8-rFR7LC_jvWKFka3avjJMUHPyHMA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);