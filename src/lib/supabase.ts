
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnlyjbwdcrcufuhqgysn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubHlqYndkY3JjdWZ1aHFneXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjU3NzUsImV4cCI6MjA2MTk0MTc3NX0.Ul1MsnpqXlphTkrlRcPwscZlOABXQKkxqOhUIenuGqo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Document = {
  id: string;
  title: string;
  authors: string[];
  date: string;
  tags: string[];
  favorite: boolean;
  file_path: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};
