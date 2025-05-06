
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

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
