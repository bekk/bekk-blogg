import {LoaderFunctionArgs} from "@remix-run/node";
import {authenticator, returnToCookie} from "~/server/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const returnTo: string | null = await returnToCookie.parse(
    request.headers.get('Cookie')
  );

  try {
    return await authenticator.authenticate('microsoft', request, {
      successRedirect: returnTo ?? '/',
    });
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      error.headers.append(
        'Set-Cookie',
        await returnToCookie.serialize(null, { maxAge: -1 })
      );
    }
    throw error;
  }
};