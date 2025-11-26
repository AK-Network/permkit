import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ fetch }) => {
  await fetch("/api/seed/roles", { method: "POST" });
  await fetch("/api/seed/users", { method: "POST" });
  await fetch("/api/seed/posts", { method: "POST" });
  await fetch("/api/seed/abac", { method: "POST" });

  return new Response("All seeds completed", { status: 201 });
};