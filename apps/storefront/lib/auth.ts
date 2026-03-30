const TOKEN_KEY = 'luxe_auth_token';

/**
 * Retrieve the stored JWT token from localStorage.
 * Returns null if not available (SSR, no token stored, or localStorage unavailable).
 */
export function getToken(): string | null {
  if (globalThis.window === undefined) return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Store a JWT token in localStorage.
 */
export function setToken(token: string): void {
  if (globalThis.window === undefined) return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage quota exceeded or unavailable — silently fail
  }
}

/**
 * Remove the stored JWT token from localStorage.
 */
export function removeToken(): void {
  if (globalThis.window === undefined) return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Check whether a user is currently authenticated (token exists in storage).
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  // Basic check: ensure the token is a non-empty string and looks like a JWT
  // (three base64url segments separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  // Optionally check token expiry from payload without a library
  try {
    const payload = JSON.parse(atob(parts[1])) as { exp?: number };
    if (payload.exp !== undefined) {
      const expiresAt = payload.exp * 1000; // convert seconds → ms
      if (Date.now() >= expiresAt) {
        removeToken(); // clean up expired token
        return false;
      }
    }
  } catch {
    // Payload decoding failed — treat token as valid (server will reject if stale)
  }

  return true;
}

/**
 * Build an Authorization header object for authenticated API requests.
 * Returns an empty object when no token is available (for unauthenticated requests).
 */
export function getAuthHeaders(): { Authorization: string } | Record<string, never> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
