const { verifyToken, supabaseAdmin } = require('../lib/supabase');

/**
 * Authentication middleware that validates Supabase JWT tokens.
 * Attaches user data to req.user if valid.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
        code: 'AUTH_MISSING_TOKEN',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        code: 'AUTH_NO_TOKEN',
      });
    }

    const { user, error } = await verifyToken(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'AUTH_INVALID_TOKEN',
      });
    }

    // Attach user and token to request
    req.user = user;
    req.accessToken = token;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR',
    });
  }
};

/**
 * Optional authentication middleware.
 * Attaches user if token is valid, but doesn't block if missing.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const { user } = await verifyToken(token);
        if (user) {
          req.user = user;
          req.accessToken = token;
        }
      }
    }

    next();
  } catch (err) {
    // Silently continue without auth
    next();
  }
};

/**
 * Role-based authorization middleware.
 * Must be used after authenticate middleware.
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    try {
      // Fetch user profile to get role
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !profile) {
        return res.status(403).json({
          success: false,
          error: 'User profile not found',
          code: 'PROFILE_NOT_FOUND',
        });
      }

      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'AUTH_FORBIDDEN',
        });
      }

      req.userRole = profile.role;
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      return res.status(500).json({
        success: false,
        error: 'Authorization failed',
        code: 'AUTH_ERROR',
      });
    }
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
};
