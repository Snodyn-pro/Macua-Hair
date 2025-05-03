-- Replace 'YOUR_USER_ID' with your actual Supabase user ID
-- Or replace 'YOUR_EMAIL' with your actual email in the second command

-- Option 1: Update by user ID
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID';

-- If the profile doesn't exist yet, create it
INSERT INTO profiles (id, role, created_at, updated_at)
SELECT 'YOUR_USER_ID', 'admin', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = 'YOUR_USER_ID'
);

-- Option 2: Update by email (use this if you know your email but not your ID)
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'samuelmataraso@gmail.com'
); 