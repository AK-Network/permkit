import { ABACRules } from "../../../app/lib/server/collections.ts";

export const load = async () => {
  const col = await ABACRules();
  const rules = await col.find({}, {
		projection: { _id: 0, name: 1, effect: 1, priority: 1, condition: 1 }
	}).sort({ priority: 1 }).toArray();
  return { rules };
};