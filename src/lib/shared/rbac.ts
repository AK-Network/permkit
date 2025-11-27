import type { RoleDefinition, UserAttributes } from "./_types.ts";

/**
 * Expand a user's roles into a flat list of permissions.
 *
 * @param user The user attributes, including assigned roles
 * @param roles Role definitions mapping role names to permissions
 * @returns Array of permissions granted to the user
 */
export function expandRoles(
  user: UserAttributes,
  roles: RoleDefinition
): string[] {
  const r = user.roles ?? [];
  const expanded: Set<string> = new Set();

  for (const role of r) {
    const perms = roles[role];
    if (perms) {
      for (const p of perms) expanded.add(p);
    }
  }

  return Array.from(expanded);
}