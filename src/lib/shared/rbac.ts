import type { RoleDefinition, UserAttributes } from "./_types.ts";

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