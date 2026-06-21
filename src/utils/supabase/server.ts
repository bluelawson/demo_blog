import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function createBaseClient(supabaseUrl: string, supabaseKey: string) {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: CookieOptions;
        }>,
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            const updatedOptions: CookieOptions = {
              ...options,
              // cookieの情報を攻撃者から防御
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
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
  });
}

export async function createClient() {
  return createBaseClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

export async function createAdminClient() {
  return createBaseClient(
    process.env.SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
  );
}
