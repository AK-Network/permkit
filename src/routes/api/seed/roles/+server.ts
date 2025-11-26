import type { RequestHandler } from "@sveltejs/kit";
import { Roles } from "../../../../app/lib/server/collections.ts";

export const POST: RequestHandler = async () => {
  const col = await Roles();

  await col.deleteMany({}); // clean

  await col.insertMany([
    {
      name: "admin",
      permissions: ["*"] // full access
    },
    {
      name: "editor",
      permissions: ["posts:read", "posts:write"]
    },
    {
      name: "viewer",
      permissions: ["posts:read"]
    }
  ]);

  return new Response("Roles seeded", { status: 201 });
};