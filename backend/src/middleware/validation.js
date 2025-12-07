/**
 * Validation middleware for request validation
 */

/**
 * Validate found item creation/update data
 */
const validateFoundItem = (req, res, next) => {
  const { title, category, description, location, foundAt, submissionType, imageUrls, verificationNotes } = req.body;

  const errors = [];

  // Title validation
  if (req.method === 'POST' && (!title || typeof title !== 'string')) {
    errors.push('Title is required and must be a string');
  } else if (title && (typeof title !== 'string' || title.length < 3 || title.length > 200)) {
    errors.push('Title must be between 3 and 200 characters');
  }

  // Category validation
  const validCategories = ['Electronics', 'Bags', 'Accessories', 'Keys', 'Books', 'ID Cards', 'Other'];
  if (req.method === 'POST' && (!category || typeof category !== 'string')) {
    errors.push('Category is required');
  } else if (category && !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  // Description validation
  if (req.method === 'POST' && (!description || typeof description !== 'string')) {
    errors.push('Description is required and must be a string');
  } else if (description && (typeof description !== 'string' || description.length < 10 || description.length > 2000)) {
    errors.push('Description must be between 10 and 2000 characters');
  }

  // Location validation
  if (req.method === 'POST' && (!location || typeof location !== 'string')) {
    errors.push('Location is required and must be a string');
  } else if (location && (typeof location !== 'string' || location.length < 3 || location.length > 200)) {
    errors.push('Location must be between 3 and 200 characters');
  }

  // FoundAt validation
  if (req.method === 'POST' && !foundAt) {
    errors.push('Found date is required');
  } else if (foundAt) {
    const foundDate = new Date(foundAt);
    if (isNaN(foundDate.getTime())) {
      errors.push('Found date must be a valid ISO 8601 datetime');
    } else if (foundDate > new Date()) {
      errors.push('Found date cannot be in the future');
    }
  }

  // SubmissionType validation
  const validSubmissionTypes = ['keep-with-me', 'submit-to-desk'];
  if (req.method === 'POST' && (!submissionType || typeof submissionType !== 'string')) {
    errors.push('Submission type is required');
  } else if (submissionType && !validSubmissionTypes.includes(submissionType)) {
    errors.push(`Submission type must be one of: ${validSubmissionTypes.join(', ')}`);
  }

  // ImageUrls validation
  if (imageUrls !== undefined) {
    if (!Array.isArray(imageUrls)) {
      errors.push('Image URLs must be an array');
    } else if (imageUrls.length > 5) {
      errors.push('Maximum 5 images allowed');
    } else {
      // Validate each URL
      const urlPattern = /^https?:\/\/.+/;
      for (const url of imageUrls) {
        if (typeof url !== 'string' || !urlPattern.test(url)) {
          errors.push('All image URLs must be valid HTTP/HTTPS URLs');
          break;
        }
      }
    }
  }

  // VerificationNotes validation
  if (verificationNotes && (typeof verificationNotes !== 'string' || verificationNotes.length > 500)) {
    errors.push('Verification notes must be a string with maximum 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors,
    });
  }

  next();
};

/**
 * Validate status update
 */
const validateStatusUpdate = (req, res, next) => {
  const { status, notes } = req.body;

  const validStatuses = ['available', 'matched', 'returned', 'verification-pending'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status',
      code: 'VALIDATION_ERROR',
      details: [`Status must be one of: ${validStatuses.join(', ')}`],
    });
  }

  if (notes && (typeof notes !== 'string' || notes.length > 500)) {
    return res.status(400).json({
      success: false,
      error: 'Notes must be a string with maximum 500 characters',
      code: 'VALIDATION_ERROR',
    });
  }

  next();
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
    return res.status(400).json({
      success: false,
      error: 'Page must be a positive integer',
      code: 'VALIDATION_ERROR',
    });
  }

  if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Limit must be between 1 and 100',
      code: 'VALIDATION_ERROR',
    });
  }

  next();
};

module.exports = {
  validateFoundItem,
  validateStatusUpdate,
  validatePagination,
};

