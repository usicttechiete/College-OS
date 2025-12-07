const express = require('express');
const { supabaseAdmin } = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /auth/signup
 * Register a new user with email and password
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, enrollment, batch, branch, profilePic } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required',
        code: 'VALIDATION_ERROR',
      });
    }

    // Validate email domain (campus email)
    if (!email.endsWith('.edu') && !email.includes('college')) {
      return res.status(400).json({
        success: false,
        error: 'Please use your campus email address',
        code: 'INVALID_EMAIL_DOMAIN',
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
        code: 'WEAK_PASSWORD',
      });
    }

    // Create user in Supabase Auth with metadata
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for development; disable in production
      user_metadata: {
        name,
        enrollment,
        batch,
        branch,
        profile_pic: profilePic,
      },
    });

    if (error) {
      console.error('Signup error:', error);

      // Handle specific errors
      if (error.message.includes('already registered')) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists',
          code: 'EMAIL_EXISTS',
        });
      }

      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'SIGNUP_FAILED',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.name,
        },
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create account',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        code: 'VALIDATION_ERROR',
      });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          ...profile,
        },
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at,
          expiresIn: data.session.expires_in,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Login failed',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /auth/logout
 * Sign out the current user
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    const { error } = await supabaseAdmin.auth.admin.signOut(req.accessToken);

    if (error) {
      console.error('Logout error:', error);
      // Still return success as the client should clear tokens anyway
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      success: false,
      error: 'Logout failed',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh the access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
        code: 'VALIDATION_ERROR',
      });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      console.error('Refresh error:', error);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at,
          expiresIn: data.session.expires_in,
        },
      },
    });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * GET /auth/me
 * Get current authenticated user's profile
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
        code: 'PROFILE_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          ...profile,
        },
      },
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * PATCH /auth/profile
 * Update current user's profile
 */
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const { name, enrollment, batch, branch, profilePic } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (enrollment !== undefined) updates.enrollment = enrollment;
    if (batch !== undefined) updates.batch = batch;
    if (branch !== undefined) updates.branch = branch;
    if (profilePic !== undefined) updates.profile_pic = profilePic;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
        code: 'VALIDATION_ERROR',
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to update profile',
        code: 'UPDATE_FAILED',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile },
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * POST /auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
        code: 'VALIDATION_ERROR',
      });
    }

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      // Don't reveal if email exists or not
    }

    // Always return success to prevent email enumeration
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process request',
      code: 'SERVER_ERROR',
    });
  }
});

module.exports = router;
