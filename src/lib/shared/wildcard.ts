// Supports patterns like:
//  - posts.*
//  - billing:invoice.*
//  - users.** (future extension)
// For now: simple "*" wildcard system.

/**
 * Match a requested permission string against an available permission pattern.
 *
 * Supports wildcards like:
 * - "posts.*" matches "posts.read", "posts.write"
 * - "billing:invoice.*" matches "billing:invoice.create", etc.
 *
 * @param requested The requested permission
 * @param available The permission pattern to check
 * @returns true if allowed, false otherwise
 */
export function matchPermission(
  requested: string,
  available: string
): boolean {
  if (available === "*") return true;
  if (requested === available) return true;

  const req = requested.split(":");
  const have = available.split(":");

  // Wildcard at end allowed: "posts:*"
  if (have[have.length - 1] === "*" && req.length >= have.length) {
    // Check prefix matches
    for (let i = 0; i < have.length - 1; i++) {
      if (have[i] !== req[i]) return false;
    }
    return true;
  }

  // Must have same number of segments otherwise
  if (req.length !== have.length) {
    return false;
  }

	// Segment-wise match with wildcard support: "*"
  for (let i = 0; i < req.length; i++) {
    if (have[i] === "*") continue;
    if (have[i] !== req[i]) return false;
  }
  return true;
}