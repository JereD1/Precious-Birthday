// /sanity/schemas/post.ts
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'content', type: 'text', title: 'Content' },
    {
      name: 'media',
      type: 'file',
      title: 'Media',
      options: {
        accept: 'image/*,video/*',
      },
    },
    { name: 'authorId', type: 'string', title: 'Author ID' },
    { name: 'authorName', type: 'string', title: 'Author Name' },
    { name: 'authorImage', type: 'url', title: 'Author Image' },
    { name: 'createdAt', type: 'datetime', title: 'Created At' },
  ],
};
