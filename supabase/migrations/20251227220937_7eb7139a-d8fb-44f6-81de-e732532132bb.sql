-- Grant necessary permissions on profiles table to authenticated and anon roles
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Also ensure the service role has full access
GRANT ALL ON public.profiles TO service_role;