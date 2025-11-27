import { ABACRules } from "./collections.ts";
import type { ABACRule, RuleSource } from "../../../lib/index.ts";

export const mongoRuleSource: RuleSource = {
  load: async (): Promise<ABACRule[]> => {
    const col = await ABACRules();
    const docs = await col.find().sort({ priority: 1 }).toArray();

		console.log('[permissions] Loaded', docs.length, 'rules from ', col.dbName)
		
    return docs.map((r) => ({
      name: r.name,
      effect: r.effect,
      priority: r.priority,
      condition: new Function("ctx", r.condition) as any
    }));
  },

  // watch: async (onChange) => {
  //   // const col = await ABACRules();
  //   // const stream = col.watch();

  //   // stream.on("change", async () => {
  //   //   await onChange(); // triggers engine reload
  //   // });

  //   // return () => stream.close();


	// 	console.warn(
  //     "[permissions] ChangeStream not supported: MongoDB is not a replica set. Falling back to polling."
  //   );

  //   let timer = setInterval(onChange, 10000); // every 10 seconds

  //   return () => clearInterval(timer);
  // }
};