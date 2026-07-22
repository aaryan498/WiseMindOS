/**
 * Input Sanitization Utility
 * Provides consistent trimming, length limits, and XSS prevention
 * for all user-controlled fields stored in MongoDB.
 */

// Max length constants
export const LIMITS = {
  name:        { max: 50 },
  username:    { max: 30 },
  bio:         { max: 200 },
  title:       { max: 100 },
  description: { max: 500 },
  notebookName:{ max: 50 },
  content:     { max: 50000 },
};

export function stripHtml(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeField(value, fieldName, { required = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) return { value: null, error: `${fieldName} is required.` };
    return { value: '', error: null };
  }

  if (typeof value !== 'string') {
    return { value: null, error: `${fieldName} must be a string.` };
  }

  const cleaned = stripHtml(value);
  const limit = LIMITS[fieldName];

  if (limit && cleaned.length > limit.max) {
    return {
      value: null,
      error: `${fieldName} must be ${limit.max} characters or fewer.`,
    };
  }

  return { value: cleaned, error: null };
}