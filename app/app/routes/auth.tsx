import {authenticator, returnToCookie} from "~/server/auth.server";
import {LoaderFunctionArgs} from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') as string | null;

  try {
    return await authenticator.authenticate('microsoft', request, {
      successRedirect: 'http://localhost:3333',
      failureRedirect: 'http://localhost:3333',
    });
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      error.headers.append(
        'Set-Cookie',
        await returnToCookie.serialize(returnTo)
      );
    }
    throw error;
  }
};