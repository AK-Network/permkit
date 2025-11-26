import type {
  PermissionEngine,
  PermissionEngineOptions
} from "./_engineTypes.ts";

import type {
  PermissionContext,
  PermissionCheckResult,
  ABACRule
} from "../shared/_types.ts";

import { RuleLoader } from "./ruleLoader.ts";
import { evaluatePermission } from "./evaluator.ts";

export async function createPermissionEngine(
  opts: PermissionEngineOptions
): Promise<PermissionEngine> {
  const {
    roles,
    ruleSource,
    defaultDeny = true,
    onRulesLoaded
  } = opts;

  let rules: ABACRule[] = [];

  const loader = new RuleLoader(ruleSource);

  await loader.init((newRules) => {
    rules = newRules;
    if (onRulesLoaded) onRulesLoaded(newRules);
  });

  return {
    async check(ctx: PermissionContext): Promise<PermissionCheckResult> {
      return evaluatePermission(ctx, roles, rules, defaultDeny);
    },

    getRules() {
      return rules;
    },

    async replaceRules(newRules: ABACRule[]): Promise<void> {
      loader.replaceRules(newRules);
      rules = newRules;
      if (onRulesLoaded) onRulesLoaded(newRules);
    },

    stop() {
      loader.stop();
    }
  };
}