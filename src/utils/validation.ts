/**
 * Input Validation Utilities
 * Security-focused validation for user inputs
 */

/**
 * Email validation regex (RFC 5322 compliant simplified)
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;

/**
 * Sanitize string input to prevent XSS
 * Removes potentially dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 500); // Limit length
};

/**
 * Sanitize name (allows letters, spaces, hyphens, apostrophes)
 */
export const sanitizeName = (name: string): string => {
  if (!name) return '';
  return name
    .trim()
    .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '') // Allow only letters, accents, spaces, hyphens, apostrophes
    .slice(0, 100);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return { valid: false, error: 'L\'email est requis.' };
  }

  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'L\'email est trop long.' };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: 'Format d\'email invalide.' };
  }

  return { valid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Le mot de passe est requis.' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.` };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Le mot de passe est trop long (max 128 caractères).' };
  }

  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins une majuscule.' };
  }

  if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins une minuscule.' };
  }

  if (!PASSWORD_NUMBER_REGEX.test(password)) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins un chiffre.' };
  }

  return { valid: true };
};

/**
 * Validate name (not empty, reasonable length, no special chars)
 */
export const validateName = (name: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeName(name);

  if (!sanitized || sanitized.length < 2) {
    return { valid: false, error: 'Le nom doit contenir au moins 2 caractères.' };
  }

  if (sanitized.length > 100) {
    return { valid: false, error: 'Le nom est trop long (max 100 caractères).' };
  }

  return { valid: true };
};

/**
 * Simple rate limiter for client-side use
 * Returns true if action is allowed, false if rate limited
 */
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remainingAttempts: number; resetIn: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up old entry
  if (entry && now - entry.firstAttempt > windowMs) {
    rateLimitStore.delete(key);
  }

  const currentEntry = rateLimitStore.get(key);

  if (!currentEntry) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetIn: windowMs };
  }

  if (currentEntry.count >= maxAttempts) {
    const resetIn = windowMs - (now - currentEntry.firstAttempt);
    return { allowed: false, remainingAttempts: 0, resetIn };
  }

  currentEntry.count++;
  return {
    allowed: true,
    remainingAttempts: maxAttempts - currentEntry.count,
    resetIn: windowMs - (now - currentEntry.firstAttempt)
  };
};

/**
 * Reset rate limit for a key (e.g., after successful login)
 */
export const resetRateLimit = (key: string): void => {
  rateLimitStore.delete(key);
};
