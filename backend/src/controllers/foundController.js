const { supabaseAdmin, createUserClient } = require('../lib/supabase');

/**
 * Create a new found item
 */
const createFoundItem = async (req, res) => {
  try {
    const { title, category, description, location, foundAt, submissionType, imageUrls, verificationNotes } = req.body;
    const finderId = req.user.id;

    // Prepare data
    const itemData = {
      finder_id: finderId,
      title,
      category,
      description,
      location,
      found_at: foundAt,
      submission_type: submissionType,
      image_urls: imageUrls || [],
      verification_notes: verificationNotes || null,
      status: 'available',
      is_verified: false,
      match_confidence: 0,
    };

    // Insert into database
    const { data: item, error } = await supabaseAdmin
      .from('found_items')
      .insert(itemData)
      .select()
      .single();

    if (error) {
      console.error('Create found item error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to create found item',
        code: 'CREATE_FAILED',
        details: error.message,
      });
    }

    // Fetch finder profile
    const { data: finderProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, profile_pic, trust_score')
      .eq('id', finderId)
      .single();

    // Format response
    const response = {
      id: item.id,
      finderId: item.finder_id,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      foundAt: item.found_at,
      submissionType: item.submission_type,
      imageUrls: item.image_urls || [],
      status: item.status,
      finder: {
        id: finderProfile?.id || finderId,
        name: finderProfile?.name || 'Unknown',
        avatarUrl: finderProfile?.profile_pic || '',
        trustScore: finderProfile?.trust_score || 50,
        isTrustedHelper: (finderProfile?.trust_score || 50) >= 80,
      },
      verification: {
        verified: item.is_verified,
        notes: item.verification_notes || null,
        matchConfidence: item.match_confidence || 0,
      },
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    return res.status(201).json({
      success: true,
      message: 'Found item created successfully',
      data: { item: response },
    });
  } catch (err) {
    console.error('Create found item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create found item',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Get all found items with filtering, pagination, and search
 */
const getFoundItems = async (req, res) => {
  try {
    const {
      status,
      category,
      location,
      finderId,
      page = 1,
      limit = 20,
      sortBy = 'found_at',
      sortOrder = 'desc',
      search,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    // Build query
    let query = supabaseAdmin
      .from('found_items')
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    } else {
      // Default: show available items to public, all items to authenticated users
      if (!req.user) {
        query = query.eq('status', 'available');
      }
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (finderId) {
      query = query.eq('finder_id', finderId);
    }

    // Search (full-text search on title and description)
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    const validSortFields = ['found_at', 'created_at', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'found_at';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    query = query.order(sortField, { ascending: sortDirection === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: items, error, count } = await query;

    if (error) {
      console.error('Get found items error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch found items',
        code: 'FETCH_FAILED',
        details: error.message,
      });
    }

    // Format response
    const formattedItems = items.map((item) => {
      const finderProfile = item.profiles || {};
      return {
        id: item.id,
        finderId: item.finder_id,
        title: item.title,
        category: item.category,
        description: item.description,
        location: item.location,
        foundAt: item.found_at,
        submissionType: item.submission_type,
        imageUrls: item.image_urls || [],
        status: item.status,
        finder: {
          id: finderProfile.id || item.finder_id,
          name: finderProfile.name || 'Unknown',
          avatarUrl: finderProfile.profile_pic || '',
          trustScore: finderProfile.trust_score || 50,
          isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
        },
        verification: {
          verified: item.is_verified,
          notes: item.verification_notes || null,
          matchConfidence: item.match_confidence || 0,
        },
        claimedBy: item.claimed_by || null,
        claimedAt: item.claimed_at || null,
        returnedAt: item.returned_at || null,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });

    const totalPages = Math.ceil((count || 0) / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        items: formattedItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages,
        },
      },
    });
  } catch (err) {
    console.error('Get found items error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch found items',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Get a specific found item by ID
 */
const getFoundItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: item, error } = await supabaseAdmin
      .from('found_items')
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)')
      .eq('id', id)
      .single();

    if (error || !item) {
      return res.status(404).json({
        success: false,
        error: 'Found item not found',
        code: 'NOT_FOUND',
      });
    }

    // Check access: public can view available items, authenticated can view their own items
    if (item.status !== 'available' && (!req.user || (req.user.id !== item.finder_id && req.user.id !== item.claimed_by))) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        code: 'ACCESS_DENIED',
      });
    }

    const finderProfile = item.profiles || {};

    const response = {
      id: item.id,
      finderId: item.finder_id,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      foundAt: item.found_at,
      submissionType: item.submission_type,
      imageUrls: item.image_urls || [],
      status: item.status,
      finder: {
        id: finderProfile.id || item.finder_id,
        name: finderProfile.name || 'Unknown',
        avatarUrl: finderProfile.profile_pic || '',
        trustScore: finderProfile.trust_score || 50,
        isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
      },
      verification: {
        verified: item.is_verified,
        notes: item.verification_notes || null,
        matchConfidence: item.match_confidence || 0,
      },
      claimedBy: item.claimed_by || null,
      claimedAt: item.claimed_at || null,
      returnedAt: item.returned_at || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    return res.status(200).json({
      success: true,
      data: { item: response },
    });
  } catch (err) {
    console.error('Get found item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch found item',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Update a found item (finder only)
 */
const updateFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, location, foundAt, submissionType, imageUrls, verificationNotes } = req.body;

    // First, check if item exists and user is the finder
    const { data: existingItem, error: fetchError } = await supabaseAdmin
      .from('found_items')
      .select('finder_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Found item not found',
        code: 'NOT_FOUND',
      });
    }

    if (existingItem.finder_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own found items',
        code: 'ACCESS_DENIED',
      });
    }

    // Build update object
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (location !== undefined) updates.location = location;
    if (foundAt !== undefined) updates.found_at = foundAt;
    if (submissionType !== undefined) updates.submission_type = submissionType;
    if (imageUrls !== undefined) updates.image_urls = imageUrls;
    if (verificationNotes !== undefined) updates.verification_notes = verificationNotes;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
        code: 'VALIDATION_ERROR',
      });
    }

    // Update item
    const { data: item, error } = await supabaseAdmin
      .from('found_items')
      .update(updates)
      .eq('id', id)
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)')
      .single();

    if (error) {
      console.error('Update found item error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to update found item',
        code: 'UPDATE_FAILED',
        details: error.message,
      });
    }

    const finderProfile = item.profiles || {};

    const response = {
      id: item.id,
      finderId: item.finder_id,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      foundAt: item.found_at,
      submissionType: item.submission_type,
      imageUrls: item.image_urls || [],
      status: item.status,
      finder: {
        id: finderProfile.id || item.finder_id,
        name: finderProfile.name || 'Unknown',
        avatarUrl: finderProfile.profile_pic || '',
        trustScore: finderProfile.trust_score || 50,
        isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
      },
      verification: {
        verified: item.is_verified,
        notes: item.verification_notes || null,
        matchConfidence: item.match_confidence || 0,
      },
      claimedBy: item.claimed_by || null,
      claimedAt: item.claimed_at || null,
      returnedAt: item.returned_at || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    return res.status(200).json({
      success: true,
      message: 'Found item updated successfully',
      data: { item: response },
    });
  } catch (err) {
    console.error('Update found item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update found item',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Delete a found item (finder only)
 */
const deleteFoundItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists and user is the finder
    const { data: existingItem, error: fetchError } = await supabaseAdmin
      .from('found_items')
      .select('finder_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Found item not found',
        code: 'NOT_FOUND',
      });
    }

    if (existingItem.finder_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own found items',
        code: 'ACCESS_DENIED',
      });
    }

    // Delete item
    const { error } = await supabaseAdmin
      .from('found_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete found item error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to delete found item',
        code: 'DELETE_FAILED',
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Found item deleted successfully',
    });
  } catch (err) {
    console.error('Delete found item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete found item',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Get current user's found items
 */
const getMyFoundItems = async (req, res) => {
  try {
    const {
      status,
      category,
      page = 1,
      limit = 20,
      sortBy = 'found_at',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    // Build query for user's items
    let query = supabaseAdmin
      .from('found_items')
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)', { count: 'exact' })
      .eq('finder_id', req.user.id);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    // Apply sorting
    const validSortFields = ['found_at', 'created_at', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'found_at';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    query = query.order(sortField, { ascending: sortDirection === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: items, error, count } = await query;

    if (error) {
      console.error('Get my found items error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch found items',
        code: 'FETCH_FAILED',
        details: error.message,
      });
    }

    // Format response
    const formattedItems = items.map((item) => {
      const finderProfile = item.profiles || {};
      return {
        id: item.id,
        finderId: item.finder_id,
        title: item.title,
        category: item.category,
        description: item.description,
        location: item.location,
        foundAt: item.found_at,
        submissionType: item.submission_type,
        imageUrls: item.image_urls || [],
        status: item.status,
        finder: {
          id: finderProfile.id || item.finder_id,
          name: finderProfile.name || 'Unknown',
          avatarUrl: finderProfile.profile_pic || '',
          trustScore: finderProfile.trust_score || 50,
          isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
        },
        verification: {
          verified: item.is_verified,
          notes: item.verification_notes || null,
          matchConfidence: item.match_confidence || 0,
        },
        claimedBy: item.claimed_by || null,
        claimedAt: item.claimed_at || null,
        returnedAt: item.returned_at || null,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });

    const totalPages = Math.ceil((count || 0) / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        items: formattedItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages,
        },
      },
    });
  } catch (err) {
    console.error('Get my found items error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch found items',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Claim a found item
 */
const claimFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { claimMessage } = req.body;

    // Check if item exists and is available
    const { data: existingItem, error: fetchError } = await supabaseAdmin
      .from('found_items')
      .select('finder_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Found item not found',
        code: 'NOT_FOUND',
      });
    }

    if (existingItem.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: 'Item is not available for claiming',
        code: 'ITEM_NOT_AVAILABLE',
      });
    }

    if (existingItem.finder_id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot claim your own found item',
        code: 'INVALID_CLAIM',
      });
    }

    // Update item to claimed status
    const { data: item, error } = await supabaseAdmin
      .from('found_items')
      .update({
        claimed_by: req.user.id,
        claimed_at: new Date().toISOString(),
        status: 'matched',
        verification_notes: claimMessage || null,
      })
      .eq('id', id)
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)')
      .single();

    if (error) {
      console.error('Claim found item error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to claim found item',
        code: 'CLAIM_FAILED',
        details: error.message,
      });
    }

    const finderProfile = item.profiles || {};

    const response = {
      id: item.id,
      finderId: item.finder_id,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      foundAt: item.found_at,
      submissionType: item.submission_type,
      imageUrls: item.image_urls || [],
      status: item.status,
      finder: {
        id: finderProfile.id || item.finder_id,
        name: finderProfile.name || 'Unknown',
        avatarUrl: finderProfile.profile_pic || '',
        trustScore: finderProfile.trust_score || 50,
        isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
      },
      verification: {
        verified: item.is_verified,
        notes: item.verification_notes || null,
        matchConfidence: item.match_confidence || 0,
      },
      claimedBy: item.claimed_by,
      claimedAt: item.claimed_at,
      returnedAt: item.returned_at || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    return res.status(200).json({
      success: true,
      message: 'Found item claimed successfully',
      data: { item: response },
    });
  } catch (err) {
    console.error('Claim found item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to claim found item',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Unclaim a found item
 */
const unclaimFoundItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabaseAdmin
      .from('found_items')
      .select('finder_id, claimed_by, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Found item not found',
        code: 'NOT_FOUND',
      });
    }

    // Check if user is the finder or the claimer
    if (existingItem.finder_id !== req.user.id && existingItem.claimed_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only unclaim items you found or claimed',
        code: 'ACCESS_DENIED',
      });
    }

    // Update item back to available
    const { data: item, error } = await supabaseAdmin
      .from('found_items')
      .update({
        claimed_by: null,
        claimed_at: null,
        status: 'available',
      })
      .eq('id', id)
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)')
      .single();

    if (error) {
      console.error('Unclaim found item error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to unclaim found item',
        code: 'UNCLAIM_FAILED',
        details: error.message,
      });
    }

    const finderProfile = item.profiles || {};

    const response = {
      id: item.id,
      finderId: item.finder_id,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      foundAt: item.found_at,
      submissionType: item.submission_type,
      imageUrls: item.image_urls || [],
      status: item.status,
      finder: {
        id: finderProfile.id || item.finder_id,
        name: finderProfile.name || 'Unknown',
        avatarUrl: finderProfile.profile_pic || '',
        trustScore: finderProfile.trust_score || 50,
        isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
      },
      verification: {
        verified: item.is_verified,
        notes: item.verification_notes || null,
        matchConfidence: item.match_confidence || 0,
      },
      claimedBy: item.claimed_by,
      claimedAt: item.claimed_at,
      returnedAt: item.returned_at || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    return res.status(200).json({
      success: true,
      message: 'Found item unclaimed successfully',
      data: { item: response },
    });
  } catch (err) {
    console.error('Unclaim found item error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to unclaim found item',
      code: 'SERVER_ERROR',
    });
  }
};

/**
 * Update found item status
 */
const updateFoundItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabaseAdmin
      .from('found_items')
      .select('finder_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Found item not found',
        code: 'NOT_FOUND',
      });
    }

    // Check if user is the finder (or admin in future)
    if (existingItem.finder_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update status of your own found items',
        code: 'ACCESS_DENIED',
      });
    }

    // Build update object
    const updates = { status };
    if (notes !== undefined) {
      updates.verification_notes = notes;
    }

    // If status is returned, set returned_at
    if (status === 'returned') {
      updates.returned_at = new Date().toISOString();
    }

    // Update item
    const { data: item, error } = await supabaseAdmin
      .from('found_items')
      .update(updates)
      .eq('id', id)
      .select('*, profiles!found_items_finder_id_fkey(id, name, email, profile_pic, trust_score)')
      .single();

    if (error) {
      console.error('Update status error:', error);
      return res.status(400).json({
        success: false,
        error: 'Failed to update status',
        code: 'UPDATE_FAILED',
        details: error.message,
      });
    }

    const finderProfile = item.profiles || {};

    const response = {
      id: item.id,
      finderId: item.finder_id,
      title: item.title,
      category: item.category,
      description: item.description,
      location: item.location,
      foundAt: item.found_at,
      submissionType: item.submission_type,
      imageUrls: item.image_urls || [],
      status: item.status,
      finder: {
        id: finderProfile.id || item.finder_id,
        name: finderProfile.name || 'Unknown',
        avatarUrl: finderProfile.profile_pic || '',
        trustScore: finderProfile.trust_score || 50,
        isTrustedHelper: (finderProfile.trust_score || 50) >= 80,
      },
      verification: {
        verified: item.is_verified,
        notes: item.verification_notes || null,
        matchConfidence: item.match_confidence || 0,
      },
      claimedBy: item.claimed_by || null,
      claimedAt: item.claimed_at || null,
      returnedAt: item.returned_at || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: { item: response },
    });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update status',
      code: 'SERVER_ERROR',
    });
  }
};

module.exports = {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
  getMyFoundItems,
  claimFoundItem,
  unclaimFoundItem,
  updateFoundItemStatus,
};

