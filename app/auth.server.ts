import {Authenticator} from "remix-auth";
import {MicrosoftStrategy} from "remix-auth-microsoft";
import {getClientId, getClientSecret, getScopes, getTenantId} from "./config.server";

export type UserData = {
  accessToken: string;
  employeeId: number;
};

export const authenticator = new Authenticator<UserData>(sessionStorage);

const entraIdStrategy = new MicrosoftStrategy(
  {
    redirectUri: `${getApplicationRoot()}redirect`,
    clientId: getClientId(),
    clientSecret: getClientSecret(),
    scope: getScopes(),
    tenantId: getTenantId(),
    prompt: '',
  },
  async ({ accessToken, extraParams }) => {
    const employeeId = getEmployeeIdFromToken(extraParams.id_token);

    if (!employeeId) {
      throw new Error('Missing employee ID on token');
    }

    return {
      accessToken,
      employeeId
    };
  }
);

authenticator.use(entraIdStrategy);

export const returnToCookie = createCookie('returnTo', {
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  secrets: [getSessionSecret()],
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600,
});

export const getUserDataOrAuthenticate = async ({
                                                  request,
                                                  params,
                                                }: {
  request: Request;
  params: Params<string>;
}) => {
  const requestUrl = new URL(request.url);

  return await authenticator.isAuthenticated(request, {
    failureRedirect:
      Object.values(params).length > 0
        ? '/auth' + `?returnTo=${requestUrl.pathname}`
        : '/auth',
  });
};