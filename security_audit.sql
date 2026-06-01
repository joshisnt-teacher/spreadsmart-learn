-- =====================================================
-- RLS SECURITY AUDIT & FIX FOR CIRCUIT
-- =====================================================

-- Step 1: Check which tables are missing RLS
SELECT 
  schemaname,
  tablename,
  relrowsecurity AS rls_enabled,
  relforcerowsecurity AS force_rls
FROM pg_tables
JOIN pg_class ON pg_tables.tablename = pg_class.relname
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;

-- Step 2: Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  cmd,
  qual::text
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
