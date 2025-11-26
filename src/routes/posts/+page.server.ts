import { getDatabase } from "../../app/lib/server/mongodb.ts";
import { guard } from "../../lib/index.ts";

export const load = guard(
  "posts:write",
  async (event) => {
		const db = await getDatabase()
		const posts = await db.collection("posts").aggregate([

			{
				$project: {
					_id: 0,
					id: { $toString: "$_id" },
					title: 1,
					content: 1,
					ownerId: 1,
				},
			}


		]).toArray()
		
		
		
		// .find({}).toArray();
    return { adminThings: "You can edit posts", posts };
  },
  (event) => ({ ownerId: event.locals.user?.id })
);