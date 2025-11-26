import type { RequestHandler } from "@sveltejs/kit";
import { Users } from "../../../../app/lib/server/collections.ts";

export const POST: RequestHandler = async () => {
  const col = await Users();

  await col.deleteMany({}); // clean

  await col.insertMany([
    {
      email: "admin@example.com",
      roles: ["admin"]
    },
    {
      email: "editor@example.com",
      roles: ["editor"]
    },
    {
      email: "viewer@example.com",
      roles: ["viewer"]
    },
    {
      email: "alice@example.com",
      roles: ["editor"]
    },
    {
      email: "bob@example.com",
      roles: ["editor"]
    }
  ]);

  return new Response("Users seeded", { status: 201 });
};