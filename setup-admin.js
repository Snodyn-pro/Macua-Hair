// setup-admin.js
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

// Replace with the user's email or ID you want to make an admin
const USER_ID = process.env.ADMIN_USER_ID || '';
const USER_EMAIL = process.env.ADMIN_USER_EMAIL || '';

if (!USER_ID && !USER_EMAIL) {
  console.error('Please provide either ADMIN_USER_ID or ADMIN_USER_EMAIL environment variable');
  process.exit(1);
}

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    let userId = USER_ID;
    
    // If we have an email but no ID, find the user ID
    if (!userId && USER_EMAIL) {
      console.log(`Looking up user ID for email: ${USER_EMAIL}`);
      
      // Query auth.users to find user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        throw new Error(`Error fetching users: ${userError.message}`);
      }
      
      const user = userData.users.find(u => u.email === USER_EMAIL);
      
      if (!user) {
        throw new Error(`No user found with email: ${USER_EMAIL}`);
      }
      
      userId = user.id;
      console.log(`Found user ID: ${userId}`);
    }
    
    // Check if user already has a profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw profileError;
    }
    
    if (profileData) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
      
      if (updateError) {
        throw updateError;
      }
      
      console.log(`User ${userId} profile updated with admin role`);
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: 'admin' }]);
      
      if (insertError) {
        throw insertError;
      }
      
      console.log(`User ${userId} profile created with admin role`);
    }
    
    console.log('Admin setup complete!');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin(); 