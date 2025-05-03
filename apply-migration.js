// apply-migration.js
const { createClient } = require('@supabase/supabase-js');

// Get Supabase URL and service role key from environment variables
// Be sure to use the service role key, not the anonymous key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// The SQL to execute (content of your migration file)
const sql = `
-- Create a function to safely get a user's role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TABLE (role TEXT) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.role 
  FROM profiles p 
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql;
`;

async function runMigration() {
  console.log('Running migration...');
  
  try {
    // Execute the SQL directly
    const { error } = await supabase.rpc('pgexec', { commands: sql });
    
    if (error) {
      throw error;
    }
    
    console.log('Migration applied successfully');
  } catch (error) {
    console.error('Error applying migration:', error);
  }
}

runMigration(); 