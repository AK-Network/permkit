import { createPermissionEngine } from "../../../lib/index.ts";
import { mongoRuleSource } from "./mongoRuleLoader.ts";
import { loadRoles } from "./loadRoles.ts";

export async function createEngine() {
	console.log('Creating the Engine')
  const roles = await loadRoles();

  const engine = await createPermissionEngine({
    roles,
    ruleSource: mongoRuleSource,
    defaultDeny: true,
    onRulesLoaded: (rules) => {
      console.log("ABAC rules loaded:", rules.map(r => r.name));
    }
  });

  return engine;
}