import { ABACRules } from "../../../app/lib/server/collections.ts";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	const col = await ABACRules();
	const rules = await col.find().sort({ priority: 1 }).toArray();
	return new Response(JSON.stringify(rules), {
		headers: {
			"content-type": "application/json"
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const col = await ABACRules();

  await col.insertOne({
    name: body.name,
    effect: body.effect,
    priority: body.priority,
    condition: body.condition
  });

  return new Response("ok");
};

export const DELETE = async ({ request }) => {
  const { name } = await request.json();
  const col = await ABACRules();

  await col.deleteOne({ name });

  return new Response("ok");
};