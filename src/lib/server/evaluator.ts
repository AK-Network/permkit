import { expandRoles } from "../shared/rbac.ts";
import { basePermissionAllows } from "../shared/matcher.ts";
import { evaluateABAC } from "../shared/abac.ts";

import type {
  PermissionContext,
  PermissionCheckResult,
  ABACRule,
  RoleDefinition
} from "../shared/_types.ts";

export async function evaluatePermission(
  ctx: PermissionContext,
  roles: RoleDefinition,
  rules: ABACRule[],
  denyByDefault: boolean
): Promise<PermissionCheckResult> {
  // 1. Expand roles into PBAC permissions
  const rolePermissions = expandRoles(ctx.user, roles);

  // 2. Combine role permissions + direct PBAC permissions
  ctx.user.permissions = [
    ...(ctx.user.permissions ?? []),
    ...rolePermissions
  ];

  // 3. Base PBAC check (no resource/attributes yet)
  const baseAllows = basePermissionAllows(ctx);
  // if (!baseAllows && denyByDefault) {
  //   // PBAC alone denies before ABAC?
  //   // No — ABAC can override this if effect="allow"
  //   // So we don't early-return; ABAC can still grant.
  // }


	if (baseAllows) {
    return {
      allowed: true,
      reason: "no-rule-match"
    };
  }

  // 4. Run ABAC rules
  return await evaluateABAC(ctx, rules, denyByDefault);
}