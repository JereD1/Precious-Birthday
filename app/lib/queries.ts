// lib/queries.ts
export const getPostsQuery = `
*[_type == "post"] | order(createdAt desc){
  _id,
  content,
  authorName,
  authorImage,
  "mediaUrl": media.asset->url,
  createdAt
}
`;
