import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type MissingItem = {
  id: string;
  created_at: string;
  type: 'item' | 'pet' | 'person';
  name: string;
  description: string;
  last_seen_location: {
    lat: number;
    lng: number;
    address?: string;
  };
  image_url?: string;
  status: 'missing' | 'found';
  user_id?: string;
};
