import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const user = locals.user;

  // if (!user || !user.roles?.includes("admin")) {
  //   throw redirect(302, "/");
  // }

  return { user };
};