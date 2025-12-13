import { createClient } from '@vercel/kv';

export const kv = createClient({
  url: process.env.KV_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
