import {LoaderFunctionArgs} from "@remix-run/node";
import {getUserDataOrAuthenticate} from "../../auth.server";

export const loader = async ({ request, params } : LoaderFunctionArgs) => {
  const userData = await getUserDataOrAuthenticate({ request, params });
}

export default function AuthLogin() {
  return (
    <div>LOGIN</div>
  );
}
