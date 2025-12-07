const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

/**
 * Supabase client with service role key for backend operations.
 * Use this for admin operations that bypass RLS.
 */
const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Supabase client with anon key for operations that should respect RLS.
 */
const supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey);

/**
 * Create a Supabase client authenticated with a user's JWT token.
 * Use this for user-scoped operations that should respect RLS.
 * @param {string} accessToken - User's JWT access token
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
const createUserClient = (accessToken) => {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

/**
 * Verify a JWT token and return the user data.
 * @param {string} token - JWT access token
 * @returns {Promise<{user: object | null, error: Error | null}>}
 */
const verifyToken = async (token) => {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error) {
      return { user: null, error };
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
};

module.exports = {
  supabaseAdmin,
  supabaseClient,
  createUserClient,
  verifyToken,
};
