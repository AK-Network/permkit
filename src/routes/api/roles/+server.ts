import { Roles  } from "../../../app/lib/server/collections.ts";

export const POST = async ({ request }) => {
  const body = await request.json();
  const col = await Roles();

  await col.insertOne({
    name: body.name,
    permissions: body.permissions
  });

  return new Response("ok");
};


export const DELETE = async ({ request }) => {
  const { name } = await request.json();
  const col = await Roles();

  await col.deleteOne({ name });

  return new Response("ok");
};