import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dgnvksdnxwtzkzlrypra.supabase.co";
const supabaseAnonKey = "sb_publishable_LKjUMp8fimUR5e5o8XAsgg_D88YpFhG";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

