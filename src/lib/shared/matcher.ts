import { pbacAllows } from "./pbac.ts";
import type { PermissionContext } from "./_types.ts";

/**
 * Check if a user’s assigned permissions satisfy a required permission.
 * Uses PBAC (pattern-based access control) matching.
 */
export function basePermissionAllows(
  ctx: PermissionContext
): boolean {
  const assigned = ctx.user.permissions ?? [];
  return pbacAllows(ctx.permission, assigned);
}