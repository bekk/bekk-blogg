import { json } from '@remix-run/node';
import { urlFor } from '../../utils/sanity/sanity.server';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { asset } = body;

    // Use urlFor to generate the image URL based on the asset information
    const imageUrl = urlFor(asset).url(); // Adjust as necessary depending on how you implement urlFor

    return json({ imageUrl });
  } catch (error) {
    console.error("Error processing image URL:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}