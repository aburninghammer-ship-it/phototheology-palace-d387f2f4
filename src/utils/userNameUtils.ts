/**
 * Extracts the first name from a full display name.
 * Examples:
 * - "Ivor Myers" -> "Ivor"
 * - "John Doe Smith" -> "John"
 * - "Mary" -> "Mary"
 * - null/undefined -> fallback
 */
export const getFirstName = (displayName: string | null | undefined, fallback: string = "friend"): string => {
  if (!displayName || typeof displayName !== 'string') {
    return fallback;
  }
  
  const trimmed = displayName.trim();
  if (!trimmed) {
    return fallback;
  }
  
  // Split by space and return first part
  const firstName = trimmed.split(/\s+/)[0];
  return firstName || fallback;
};
