import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: "e9q159no",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // must be set in .env.local
});