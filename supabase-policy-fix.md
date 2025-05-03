# Fixing Infinite Recursion in Supabase RLS Policies

This document provides detailed steps to fix the infinite recursion error in Supabase Row Level Security (RLS) policies.

## The Problem

The error `infinite recursion detected in policy for relation "profiles"` occurs when a row-level security policy creates a circular reference. This typically happens in one of these scenarios:

1. A policy references itself directly or indirectly
2. Multiple policies form a circular dependency chain
3. A policy uses a function that internally references the same table with the policy applied

## Step 1: Create a Safe RPC Function

First, create a SECURITY DEFINER function to bypass RLS policies:

```sql
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
```

This function runs with the privileges of the user who created it (typically the database owner), not the calling user, allowing it to bypass RLS.

## Step 2: Review and Fix Existing Policies

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Policies
3. Look for policies on the "profiles" table
4. Identify policies with circular references

Common issues include:

### Self-Referential Policies

```sql
-- Problematic policy that creates recursion
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
-- The nested SELECT causes recursion
```

### Fix:

```sql
-- Fixed policy
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);
```

### Role-Based Access Policies with Circular References

```sql
-- Problematic policy chain
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
```

### Fix:

```sql
-- Fixed policy using the RPC function
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (
  auth.uid() IN (SELECT * FROM get_user_role(auth.uid()) WHERE role = 'admin')
);
```

## Step 3: Implement Client-Side Fallbacks

For maximum reliability, implement fallback mechanisms in your application code:

```typescript
// Use multiple methods to determine admin status
async function isAdmin(user) {
  if (!user) return false;

  // Check via API
  try {
    const response = await fetch(`/api/check-admin-fixed?userId=${user.id}`);
    const data = await response.json();
    if (data.success && data.data?.isAdmin) return true;
  } catch (error) {
    console.warn('API admin check failed:', error);
  }

  // Try RPC function
  try {
    const { data } = await supabase
      .rpc('get_user_role', { user_id: user.id })
      .single();
    if (data?.role === 'admin') return true;
  } catch (error) {
    console.warn('RPC admin check failed:', error);
  }

  // Add more fallbacks as needed
  return false;
}
```

## Step 4: Test Your Solution

1. Log in as a regular user
2. Verify they can only access appropriate resources
3. Log in as an admin
4. Verify they can access admin resources
5. Check the browser console for any errors

## Getting Help

If you continue to face issues:

1. Check the SQL logs in Supabase Dashboard
2. Temporarily disable problematic policies for testing
3. Consider simplifying your RLS structure

Remember that RLS policies should be as simple as possible to avoid these complex interactions. 