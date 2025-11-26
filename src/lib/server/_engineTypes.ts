import type {
  PermissionContext,
  PermissionCheckResult,
  ABACRule,
  RoleDefinition,
  RuleSource
} from "../shared/_types.ts";

export interface PermissionEngineOptions {
  roles: RoleDefinition;
  permissions?: string[]; // optional schema
  ruleSource: RuleSource;
  defaultDeny?: boolean;
  onRulesLoaded?: (rules: ABACRule[]) => void;
}

export interface PermissionEngine {
  check(ctx: PermissionContext): Promise<PermissionCheckResult>;
  getRules(): ABACRule[];
  replaceRules(rules: ABACRule[]): Promise<void>;
  stop(): void;
}