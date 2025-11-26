import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(
			JSON.stringify({ allowed: false, reason: "not-logged-in" }),
			{
				headers: { "content-type": "application/json" },
				status: 200,
			}
		);
	}

	const { permission, resource } = await request.json();

	const allowed = await locals.can(permission, resource);

	return new Response(JSON.stringify({ allowed }), {
		headers: { "content-type": "application/json" }
	});
};