import type { PermissionEngineOptions } from "./_engineTypes.ts";
import { PermissionValidationError } from "../shared/errors.ts";

/**
 * @internal
 * Validates PermissionEngineOptions
 * Throws PermissionValidationError if invalid
 */
export function validateEngineOptions(opts: PermissionEngineOptions) {
  if (!opts.roles) {
    throw new PermissionValidationError("Engine missing required 'roles'");
  }
  if (!opts.ruleSource) {
    throw new PermissionValidationError("Engine missing required 'ruleSource'");
  }
}