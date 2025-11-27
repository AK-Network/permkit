export type PermissionString = string; // e.g. "posts.write", "billing:invoice.read"

export interface UserAttributes {
  id: string;
  roles?: string[];
  permissions?: PermissionString[];
  [key: string]: any;
}

export interface ResourceAttributes {
  [key: string]: any;
}

export interface EnvironmentAttributes {
  ip?: string;
  time?: Date;
  featureFlags?: Record<string, any>;
  [key: string]: any;
}

/**
 * Context passed to ABAC, PBAC, or RBAC evaluation.
 */
export interface PermissionContext {
  user: UserAttributes;
  permission: PermissionString;
  resource?: ResourceAttributes;
  env?: EnvironmentAttributes;
}

/**
 * An individual ABAC rule.
 */
export interface ABACRule {
  name: string;
  description?: string;

  // “allow” or “deny”
  effect: "allow" | "deny";

  // lower = earlier
  priority: number;

  // async condition
  condition: (ctx: PermissionContext) => boolean | Promise<boolean>;
}

/**
 * Result returned by any permission check.
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason: string | null;
  rule?: ABACRule;
}

export interface RoleDefinition {
  [role: string]: PermissionString[];
}

export interface RuleSource {
  load: () => Promise<ABACRule[]>;
  watch?: (onChange: () => void) => void | (() => void);
}