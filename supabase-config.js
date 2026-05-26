// supabase-config.js
// Initialize Supabase Client
// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'https://xaesvrormnlsnyronogc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZXN2cm9ybW5sc255cm9ub2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzgxNDAsImV4cCI6MjA5NTExNDE0MH0.TW1nMgQZyt5B7GrsIUFZXfofV9OjkHrsX6KBOlOqXUE';

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase credentials not configured. Please add your URL and Anon Key to supabase-config.js");
    }
} else {
    console.error("Supabase library not loaded.");
}

window.supabaseClient = supabaseClient;
