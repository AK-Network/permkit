import type { RequestHandler } from "@sveltejs/kit";
import { ABACRules } from "../../../app/lib/server/collections.ts";

export const POST: RequestHandler = async () => {
  const col = await ABACRules();

  await col.insertOne({
    name: "edit-own-post",
    effect: "allow",
    priority: 10,
    condition: "return ctx.resource?.ownerId === ctx.user._id;"
  });

  return new Response("seeded", { status: 201 });
};