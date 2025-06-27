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
      options: { accept: 'image/*,video/*' },
    },
    { name: 'authorId', type: 'string', title: 'Author ID' },
    { name: 'authorName', type: 'string', title: 'Author Name' },
    { name: 'authorImage', type: 'url', title: 'Author Image' },
    { name: 'createdAt', type: 'datetime', title: 'Created At' },

    // New fields
    {
      name: 'likes',
      type: 'number',
      title: 'Likes',
      initialValue: 0,  // start at zero
    },
    {
      name: 'comments',
      type: 'array',
      title: 'Comments',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'authorId', type: 'string', title: 'Author ID' },
            { name: 'authorName', type: 'string', title: 'Author Name' },
            { name: 'authorImage', type: 'url', title: 'Author Image' },
            { name: 'createdAt', type: 'datetime', title: 'Created At' },
          ],
        },
      ],
    },
  ],
};
