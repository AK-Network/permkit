import type { RequestHandler } from "@sveltejs/kit";
import { ABACRules } from "../../../../app/lib/server/collections.ts";

export const POST: RequestHandler = async () => {
  const col = await ABACRules();

  await col.deleteMany({}); // clean

  await col.insertMany([
    //
    // TOP PRIORITY: Admin bypass
    //
    {
      name: "admin-bypass",
      effect: "allow",
      priority: 1,
      condition: `
        return ctx.user?.roles?.includes("admin");
      `.trim()
    },

    //
    // Editors can edit only their own posts
    //
    {
      name: "edit-own-post",
      effect: "allow",
      priority: 10,
      condition: `
        return ctx.permission === "posts:write" && ctx.resource?.ownerId === ctx.user?._id;
      `.trim()
    },

    //
    // Anyone can read posts
    //
    {
      name: "public-read",
      effect: "allow",
      priority: 20,
      condition: `
        return ctx.permission === "posts:read";
      `.trim()
    },

    //
    // Deny post deletion unless admin
    //
    {
      name: "deny-delete-post",
      effect: "deny",
      priority: 50,
      condition: `
        return ctx.permission === "posts:delete";
      `.trim()
    }
  ]);

  return new Response("ABAC rules seeded", { status: 201 });
};