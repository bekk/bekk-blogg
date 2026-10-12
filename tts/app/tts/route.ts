import { createClient } from "@sanity/client";
import { NextRequest } from "next/server";
import OpenAI from "openai";

// Edge-runtimen mangler `DOMException`-konstruktøren som @sanity/client 8 bruker,
// så ruten må kjøre på Node.js. Det gir også lengre tidsgrense for lange artikler.
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Missing id parameter", { status: 400 });
  }

  let post: ARTICLE_CONTENT_BY_IDResult;
  try {
    post = await sanityClient.fetch<ARTICLE_CONTENT_BY_IDResult>(
      ARTICLE_CONTENT_BY_ID,
      { id, today: getOsloDate() }
    );
  } catch (error) {
    console.error(`Could not fetch post ${id} from Sanity:`, error);
    return new Response("Error fetching post", { status: 500 });
  }

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Convert the portable text content to plain text and remove invisible characters
  const text = cleanControlCharacters(
    [post.title, post.description, post.content].join("\n\n")
  );

  // Create an AbortController to handle disconnection
  const abortController = new AbortController();

  // Listen for client disconnect
  request.signal.addEventListener("abort", () => {
    abortController.abort();
  });

  try {
    const textChunks = chunkText(text);

    // Create a ReadableStream to stream the audio chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const voice = await getVoice({
            name: post.mainAuthor,
            preferredVoice: post.preferredVoice,
          });
          // Process each chunk and send it immediately
          for (const chunk of textChunks) {
            // Check if the client has disconnected
            if (request.signal.aborted) {
              controller.close();
              console.log("Client disconnected, stopping TTS generation");
              return;
            }

            // Empty chunks are not allowed by OpenAI
            if (chunk.length < 1) {
              continue;
            }
            const mp3 = await openai.audio.speech.create(
              {
                model: "gpt-4o-mini-tts",
                voice,
                input: chunk,
                instructions: getInstructions(post.language),
                response_format: "mp3",
              },
              {
                signal: abortController.signal, // Pass the abort signal to OpenAI requests
              }
            );

            const audioStream = await mp3.arrayBuffer();
            controller.enqueue(new Uint8Array(audioStream));
          }
          controller.close();
        } catch (error) {
          // Don't throw error if it's an abort error
          if (error instanceof Error && error.name === "AbortError") {
            controller.close();
            return;
          }
          console.error(`TTS generation failed for post ${id}:`, error);
          controller.error(error);
        }
      },
      cancel() {
        abortController.abort();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-store, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("OpenAI TTS error:", error);
    return new Response("Error generating audio", { status: 500 });
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function chunkText(text: string, chunkSize: number = 500): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Del opp i setninger, men behold tegnsettingen, slik at spørsmål og utrop
  // leses med riktig intonasjon
  const sentences = text.match(/[^.!?]+(?:[.!?]+|$)\s*/g) ?? [];

  for (const sentence of sentences) {
    if (currentChunk && (currentChunk + sentence).length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const TTS_INSTRUCTIONS = {
  "nb-NO":
    "Teksten er skrevet på norsk bokmål. Les den høyt på naturlig norsk, med norsk uttale. Bruk et rolig, engasjert og tydelig tempo, slik man leser en fagartikkel høyt. Engelske fagbegreper og kodenavn uttales på engelsk.",
  "nn-NO":
    "Teksten er skriven på nynorsk. Les han høgt på naturleg norsk, med norsk uttale. Bruk eit roleg, engasjert og tydeleg tempo, slik ein les ein fagartikkel høgt. Engelske faguttrykk og kodenamn blir uttalte på engelsk.",
  "en-US":
    "The text is written in English. Read it aloud in natural, clear English. Use a calm, engaged and steady pace, like reading a technical article aloud.",
} as const;

const getInstructions = (language: ArticleLanguage | null) =>
  TTS_INSTRUCTIONS[language ?? "nb-NO"] ?? TTS_INSTRUCTIONS["nb-NO"];

// Stemmene i Sanity er fra den gamle tts-1-modellen. Vi mapper dem til de nye,
// bedre stemmene marin og cedar, som OpenAI anbefaler for gpt-4o-mini-tts.
const voiceMap = {
  onyx: "cedar",
  nova: "marin",
  shimmer: "shimmer",
} as const;

type GetVoiceArgs = {
  name: string | null;
  preferredVoice?: "onyx" | "nova" | "none" | "shimmer" | null;
};
const getVoice = async ({ name, preferredVoice }: GetVoiceArgs) => {
  if (!name) {
    return voiceMap.nova; // Burde ikke skje, men i tilfeller der man ikke har fyllt ut navn enda, vil man bruke denne stemmen
  }
  // Hvis brukeren har valgt en stemme, returner den
  if (preferredVoice && preferredVoice !== "none" && preferredVoice in voiceMap) {
    return voiceMap[preferredVoice];
  }
  // Hvis brukeren ikke har valgt en stemme, bestemmer vi stemmen ut fra navnet
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          'You are a helpful assistant that can determine the gender of a name. Only respond with either "male" or "female".',
      },
      {
        role: "user",
        content: `what is the gender of the following name? ${name}`,
      },
    ],
  });
  const gender = response.choices[0].message.content;
  return gender === "male" ? voiceMap.onyx : voiceMap.nova;
};

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
  apiVersion: "2024-12-04",
  token: process.env.SANITY_SECRET_TOKEN,
  // Klienten har token, så uten dette kan den lese utkast
  perspective: "published",
});

/** Dagens dato i norsk tid (YYYY-MM-DD), samme format som `availableFrom` */
const getOsloDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const controlCharactersRegex =
  /[\u200B-\u200D\uFEFF\u0000-\u001F\u007F-\u009F\u2000-\u200F\u2028-\u202F]/g;
/**
 * Removes any Sanity Visual Editing control characters from a string
 */
const cleanControlCharacters = (text?: string) =>
  text?.replace(controlCharactersRegex, "") ?? "";

// Kun publiserte artikler som har åpnet, så man ikke kan lytte seg til fremtidige luker
const ARTICLE_CONTENT_BY_ID = `*[_type == "post" && type == "article" && _id == $id && availableFrom <= $today][0] { 
  title, 
  "description": pt::text(description), 
  "content": pt::text(content), 
  "mainAuthor": authors[0]->fullName,
  "preferredVoice": authors[0]->preferredVoice,
  language
  }`;

type ArticleLanguage = "nb-NO" | "nn-NO" | "en-US";

type ARTICLE_CONTENT_BY_IDResult = {
  title: string;
  description: string;
  content: string;
  mainAuthor: string | null;
  preferredVoice: "none" | "nova" | "onyx" | "shimmer" | null;
  language: ArticleLanguage | null;
} | null;
