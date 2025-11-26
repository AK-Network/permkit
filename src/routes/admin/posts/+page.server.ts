import {getDatabase} from '../../../app/lib/server/mongodb.ts'

export const load = async () => {
	const db = await getDatabase();

	const posts = await db.collection("posts").aggregate([
		//
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
	
	
	// .find({}, {
	// 	projection: {
	// 		_id: 1,
	// 		title: 1,
	// 		content: 1,
	// 		ownerId: 1,
	// 	},
	// }).toArray();



  return { posts };
};