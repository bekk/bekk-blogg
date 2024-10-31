import {authenticator} from "~/server/auth.server";
import {createHash} from "crypto";
import sanityConfig from "~/../../sanity/sanity.config";

import type {GetPublicKeyOrSecret, JwtPayload} from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import {redirect} from "@remix-run/react";
import {authClient, writeClient} from "../../utils/sanity/sanity.server";
import {SanityDocument} from "@sanity/client";
import {HttpError} from "http-errors";

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/discovery/v2.0/keys`,
})

const getSigningKey: GetPublicKeyOrSecret = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey()
    callback(err, signingKey)
  })
}

export type User = {
  name: string;
  email: string;
  picture: string;
};

interface ExtendedJwtPayload extends JwtPayload {
  email: string;
  name: string;
  employeeId: number;
}

export const loader = async ({request}: { request: Request }) => {
  const user = await authenticator.authenticate("microsoft", request);

  const token = user.accessToken

  try {
    const verifiedToken = await new Promise<ExtendedJwtPayload>((resolve, reject) => {
      jwt.verify(token, getSigningKey, {
        issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
        audience: process.env.AZURE_AD_CLIENT_ID,
      }, (err, decoded) => {
        if (err) {
          return reject(err)
        }
        resolve(decoded as ExtendedJwtPayload)
      })
    })


    console.log("VERIFIED TOKEN", verifiedToken)
    console.log("TOKEN", token)

    const returnTo = await logIntoSanity(verifiedToken);
    return redirect(returnTo);
  } catch (error) {
    console.error('Token verification failed:', error)
  }
  return null
};

const logIntoSanity = async (
  token: ExtendedJwtPayload
): Promise<string> => {
  try {
    const existingSanityUser = await getSanityUser();
    console.info(
      `User ${token.email} ${
        existingSanityUser ? "is already" : "was not"
      } logged into Sanity`
    );

    // If you're already logged in, and your sanity user stems from your Bekk user we're going to just log you in to Sanity.
    // This will be what happens most of the time.
    if (existingSanityUser?.provider === "external") {
      console.info(
        `User ${token.email} had a valid session in Sanity, redirecting to the Studio`
      );
      // redirect to the process.env.SANITY_STUDIO_URL
      return process.env.SANITY_STUDIO_URL ?? '/'
    }

    // If you get here, you're a Bekk user who hasn't logged in to Sanity before.
    // We're going to create a new author object in Sanity (or update the existing one)
    const sanityAuthor = await createOrUpdateAuthorInSanity(token);

    // And then we're going to add the new user to the group,
    // if they're not already a member.
    await addUserToGroup(sanityAuthor._id);

    console.log("SANITY AUTHOR", sanityAuthor)

    // And then we're going to get your "log in to Sanity" URL,
    // which will set the user's session cookie.
    return await getEndUserClaimUrl(sanityAuthor, token)

  } catch (e) {
    console.error("Error while authenticating", e);
  }
  return '/'
};

async function getSanityUser() {
  try {
    const res = await fetch(
      `https://${sanityConfig.projectId}.api.sanity.io/${process.env.SANITY_API_VERSION}/users/me`,
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.status === 401) {
      return null;
    }
    const body = await res.json();

    // This endpoint returns an empty object if we're logged in.
    // We're going to check for that and return null if it's empty.
    return body?.id ? body : null;
  } catch (error) {
    return null;
  }
}

async function createOrUpdateAuthorInSanity(token: ExtendedJwtPayload) {
  const existingAuthor = await getExistingAuthorFromSanity(token.name);
  if (existingAuthor) {
    console.info(
      `Found an existing author called ${token.name}. Updating it with newest data`
    );
  } else {
    console.info(
      `Could not find a matching author for ${token.name}. Creating it.`
    );
  }
  const authorId = existingAuthor
    ? existingAuthor._id
    : userIdFromEmail(token.email);
  const socialMediaLinks = existingAuthor?.socialMediaLinks ?? [];
  return createAuthorInSanity({
    id: authorId,
    name: token.name,
    imageUrl: '',
    socialMediaLinks,
  });
}

type AuthorDetails = {
  id: string;
  name: string;
  imageUrl: string;
  socialMediaLinks: unknown[];
};

async function createAuthorInSanity(authorDetails: AuthorDetails) {
  try {
    return writeClient.createOrReplace({
      _type: "author",
      _id: authorDetails.id,
      fullName: authorDetails.name,
      companyName: "Bekk",
      profilePicture: authorDetails.imageUrl,
      socialMediaLinks: authorDetails.socialMediaLinks,
    });
  } catch (error) {
    // If the user exists already, we'll just update their profile picture
    if ((error as HttpError).statusCode === 409) {
      console.log(
        `User ${authorDetails.id} already exists, updating the profile picture`
      );
      return writeClient
        .patch(authorDetails.id)
        .set({
          profilePicture: authorDetails.imageUrl,
        })
        .commit();
    } else {
      throw error;
    }
  }
}

async function getExistingAuthorFromSanity(name: string) {
  const query = `*[_type == "author" && fullName == "${name}"]`;
  const result = await writeClient.fetch(query);
  return result.length ? result[0] : null;
}

const userIdFromEmail = (email: string) => {
  return createHash("md5").update(email).digest("hex");
};

const getSanityUserId = (sanityAuthorId: string): string => {
  return sanityAuthorId.startsWith("e-") ? sanityAuthorId : `e-${sanityAuthorId}`;
}

async function addUserToGroup(sanityAuthorId: string) {
  const userId = getSanityUserId(sanityAuthorId);
  const group = await createGroupIfNotExists("bekker");
  const members: string[] = group.members || [];
  if (!members.includes(userId)) {
    console.info(`Adding user "${userId}" to group "${group._id}"`);
    return authClient
      .patch(group._id)
      .setIfMissing({ members: [] })
      .append("members", [userId])
      .commit();
  }
}

function createGroupIfNotExists(groupName: string) {
  return authClient.createIfNotExists({
    _id: `_.groups.${groupName}`,
    _type: "system.group",
    grants: [
      {
        path: "**",
        permissions: ["create", "read", "update", "history"],
      },
    ],
    members: [],
  });
}

async function getEndUserClaimUrl(
  sanityUser: SanityDocument,
  token: ExtendedJwtPayload
) {
  console.info(`Creating a session for ${token.email}`);
  const dateIn24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
  try {
    const response = await fetch(
      `https://${sanityConfig.projectId}.api.sanity.io/${process.env.SANITY_API_VERSION}/auth/thirdParty/session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SANITY_SESSION_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: getSanityUserId(sanityUser._id),
          userFullName: sanityUser.fullName,
          userEmail: token.email,
          userImage: `https://res.cloudinary.com/bekkimg/w_768,h_1024,c_fill,f_auto/d_default_image_departmentId2.png/${token.employeeId}`,
          userRole: "editor",
          sessionExpires: dateIn24Hours.toISOString(),
          sessionLabel: "SSO",
        }),
      }
    );
    const json = await response.json();

    if (!json.endUserClaimUrl) {
      console.error("Could not create user session in Sanity", {
        responseStatus: response.status,
        json,
      });
      throw new Error("Could not create session");
    }
    return `${json.endUserClaimUrl}?origin=${process.env.SANITY_STUDIO_URL}`;
  } catch (e) {
    console.error("Error while creating session", e);
    throw e;
  }
}
