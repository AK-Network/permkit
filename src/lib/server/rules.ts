import { PermissionValidationError } from "../shared/errors.ts";
import type { ABACRule } from "../shared/_types.ts";

/**
 * @internal
 * Validates an array of ABAC rules and throws if invalid
 */
export function validateRules(rules: ABACRule[]): void {
  const names = new Set<string>();

  for (const r of rules) {
    if (!r.name) {
      throw new PermissionValidationError("ABAC rule missing `name`");
    }
    if (names.has(r.name)) {
      throw new PermissionValidationError(`Duplicate ABAC rule name: ${r.name}`);
    }
    names.add(r.name);

    if (r.priority === undefined || r.priority === null) {
      throw new PermissionValidationError(
        `Rule "${r.name}" missing required 'priority'`
      );
    }

    if (r.effect !== "allow" && r.effect !== "deny") {
      throw new PermissionValidationError(
        `Rule "${r.name}" effect must be 'allow' or 'deny'`
      );
    }

    if (typeof r.condition !== "function") {
      throw new PermissionValidationError(
        `Rule "${r.name}" missing condition function`
      );
    }
  }
}