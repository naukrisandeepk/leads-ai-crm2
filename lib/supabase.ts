import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string) => {
  // 1. Try import.meta.env (Standard Vite)
  // We check if import.meta.env exists before accessing the key to prevent crashes
  try {
    const meta = import.meta as any;
    if (typeof meta !== 'undefined' && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch (e) {
    // Ignore access errors
  }

  // 2. Try process.env (Fallback injected by vite.config.ts define)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore access errors
  }

  return '';
};

// Access environment variables safely
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! The app will fail to load data. Please check your .env file or Vercel environment variables.");
}

// Use a valid placeholder URL to prevent the 'supabaseUrl is required' error during initialization.
// If the real URL is missing, API calls will simply fail gracefully in the App's error handler.
const url = supabaseUrl && supabaseUrl.length > 0 ? supabaseUrl : 'https://placeholder.supabase.co';
const key = supabaseAnonKey && supabaseAnonKey.length > 0 ? supabaseAnonKey : 'placeholder-key';

export const supabase = createClient(url, key);