import type { PermissionEngineOptions } from "./_engineTypes.ts";
import { PermissionValidationError } from "../shared/errors.ts";

export function validateEngineOptions(opts: PermissionEngineOptions) {
  if (!opts.roles) {
    throw new PermissionValidationError("Engine missing required 'roles'");
  }
  if (!opts.ruleSource) {
    throw new PermissionValidationError("Engine missing required 'ruleSource'");
  }
}