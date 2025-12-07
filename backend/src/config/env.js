require('dotenv').config();

const env = {
  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,

  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Validate required environment variables
const requiredEnvVars = ['supabaseUrl', 'supabaseAnonKey', 'supabaseServiceRoleKey'];

for (const varName of requiredEnvVars) {
  if (!env[varName]) {
    console.warn(`Warning: Missing required environment variable: ${varName.toUpperCase().replace(/([A-Z])/g, '_$1')}`);
  }
}

module.exports = env;
