import { handlePermissions, type UserAttributes } from "./lib/index.ts"; // @ak-network/permkit
import { createEngine } from "./app/lib/server/engine.ts";
import { Users } from "./app/lib/server/collections.ts";

const enginePromise = createEngine();

export const handle = handlePermissions({
  engine: await enginePromise,

  getUser: async (event) => {
    // const userId = event.cookies.get("uid");

		const userId = "u_admin"
    if (!userId) return null;

    const users = await Users();
		const user = await users.findOne({ email: 'editor@example.com' }, {
			projection: {
				_id: 0,
				id: "$_id",
				email: 1,
				roles: 1
			}
		}) as unknown as UserAttributes | null;

		console.log(user)
    return user
  },

  getEnv: async (event) => ({
    ip: event.getClientAddress(),
    time: new Date()
  }),

  clientExpose: (user) => ({
    id: user._id,
    roles: user.roles
  })
});