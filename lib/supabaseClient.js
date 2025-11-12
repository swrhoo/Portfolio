import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndrgmyhofnqvryxsmyka.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcmdteWhvZm5xdnJ5eHNteWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzkwMDEsImV4cCI6MjA3ODUxNTAwMX0.nvVASCTM4Pl9e-rpZLjxIS2nl49ytrmgPWrLlkFRfMQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)