// utils/queries.ts
export const getPostsQuery = `
  *[_type == "post"] | order(_createdAt desc){
    _id,
    content,
    authorName,
    authorImage,
    "mediaUrl": media.asset->url,
    createdAt,
    likes,
    comments[]{
      commenterId,
      commenterName,
      commenterImage,
      text,
      createdAt
    }
  }
`;



