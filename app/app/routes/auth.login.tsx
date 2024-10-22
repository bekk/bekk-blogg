import {LoaderFunctionArgs} from "@remix-run/node";
import {getUserDataOrAuthenticate} from "~/server/auth.server";
import {useLoaderData} from "@remix-run/react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return await getUserDataOrAuthenticate({request, params});
}

export default function AuthLogin() {
  const userData = useLoaderData();  // Get the data returned by the loader

  return (
    <div>
      {userData ? (
        <div>Welcome</div>
      ) : (
        <div>LOGIN</div>
      )}
    </div>
  );
}