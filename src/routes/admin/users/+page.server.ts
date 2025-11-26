import { Users } from "../../../app/lib/server/collections.ts";

export const load = async () => {
  const col = await Users();
  const users = await col.find().toArray();
  return { users };
};