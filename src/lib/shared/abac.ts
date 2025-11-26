import type {
  PermissionContext,
  ABACRule,
  PermissionCheckResult
} from "./_types.ts";

export async function evaluateABAC(
  ctx: PermissionContext,
  rules: ABACRule[],
  denyByDefault: boolean
): Promise<PermissionCheckResult> {
  // Sort rules by priority ascending
  const sorted = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sorted) {
    const ok = await rule.condition(ctx);
    if (!ok) continue;

    if (rule.effect === "deny") {
      return {
        allowed: false,
        reason: rule.name,
        rule
      };
    }

    if (rule.effect === "allow") {
      return {
        allowed: true,
        reason: rule.name,
        rule
      };
    }
  }

  return {
    allowed: !denyByDefault,
    reason: denyByDefault ? "deny-by-default" : "no-rule-match"
  };
}
