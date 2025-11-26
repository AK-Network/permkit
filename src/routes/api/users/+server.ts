import { Users } from "../../../app/lib/server/collections.ts";

export const POST = async ({ request }) => {
  const body = await request.json();
  const col = await Users();

  await col.insertOne({
    _id: body._id,
    email: body.email,
    roles: [],
    permissions: []
  });

  return new Response("ok");
};


export const DELETE = async ({ request }) => {
  const { id } = await request.json();
  const col = await Users();

  await col.deleteOne({ _id: id });

  return new Response("ok");
};