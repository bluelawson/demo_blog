import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

function createBaseClient(supabaseUrl: string, supabaseKey: string) {
  const cookieStore = cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const updatedOptions: CookieOptions = {
                ...options,
                httpOnly: true, // Ensure HttpOnly is set
                secure: true,   // Ensure Secure is set
                sameSite: 'Strict', // Set SameSite to Strict or 'Lax', 'None' based on requirement
              };
              cookieStore.set(name, value, updatedOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export function createClient() {
  return createBaseClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

export function createAdminClient() {
  return createBaseClient(process.env.SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!);
}