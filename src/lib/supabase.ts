
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for the Supabase URL and key
// This is safe for client-side code as these are public values
const supabaseUrl = 'https://lzeqtohcyusdorwyztuq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZXF0b2hjeXVzZG9yd3l6dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTcwNjIsImV4cCI6MjA2MDE5MzA2Mn0.odIPeqPbt1N6iLhxqWBezq0x2vm--Yj6hG6060BxgxY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
