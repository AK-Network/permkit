import type { RequestHandler } from "@sveltejs/kit";
import { getDatabase } from "../../../../app/lib/server/mongodb.ts";

export const POST: RequestHandler = async () => {
  const db = await getDatabase();
  const col = db.collection("posts");


  await col.deleteMany({});

  await col.insertMany([
    {
      title: "Post by Alice 1",
      content: "Content A1",
      ownerId: "u_alice"
    },
    {
      title: "Post by Alice 2",
      content: "Content A2",
      ownerId: "u_alice"
    },
    {
      title: "Post by Bob 1",
      content: "Content B1",
      ownerId: "u_bob"
    },
    {
      title: "Post by Bob 2",
      content: "Content B2",
      ownerId: "u_bob"
    }
  ]);

  return new Response("Posts seeded", { status: 201 });
};