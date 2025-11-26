import { Roles } from "../../../app/lib/server/collections.ts";

export const load = async () => {
	const col = await Roles();
	const roles = await col.find({}, 
		{ projection: { _id: 0, name: 1, permissions: 1 } }
	).toArray();
	
	return { roles };
};