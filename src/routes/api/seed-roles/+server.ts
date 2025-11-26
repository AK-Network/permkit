import { Roles } from "../../../app/lib/server/collections.ts";

export const POST = async () => {
  const col = await Roles();

  await col.insertOne({
    name: "admin",
    permissions: ["posts.*", "users.*"]
  });

  await col.insertOne({
    name: "editor",
    permissions: ["posts.read", "posts.write"]
  });

  return new Response("roles added");
};