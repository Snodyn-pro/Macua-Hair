/**
 * This is a simplified script to manually set up an admin user in the database.
 * 
 * Instructions:
 * 1. Replace YOUR_USER_ID with your actual user ID from Supabase
 * 2. Run this SQL in the Supabase SQL Editor:
 * 
 * -- Check if the user already has a profile
 * SELECT * FROM profiles WHERE id = 'YOUR_USER_ID';
 * 
 * -- If no profile exists, create one with admin role
 * INSERT INTO profiles (id, role, created_at, updated_at)
 * VALUES ('YOUR_USER_ID', 'admin', NOW(), NOW());
 * 
 * -- If profile exists, update it to have admin role
 * UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
 * 
 * After running this SQL, you should be able to access the admin panel.
 */ 