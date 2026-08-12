import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = 'https://rnpjtvpmihbrdxgzoabs.supabase.co'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)