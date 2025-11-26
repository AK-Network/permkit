import { pbacAllows } from "./pbac.ts";
import type { PermissionContext } from "./_types.ts";

export function basePermissionAllows(
  ctx: PermissionContext
): boolean {
  const assigned = ctx.user.permissions ?? [];
  return pbacAllows(ctx.permission, assigned);
}