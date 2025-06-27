// /sanity/schemas/post.ts

export default {
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    {
      name: 'content',
      type: 'text',
      title: 'Content',
    },
    {
      name: 'authorName',
      type: 'string',
      title: 'Author Name',
    },
    {
      name: 'authorImage',
      type: 'url',
      title: 'Author Image',
    },
    {
      name: 'mediaUrl',
      type: 'url',
      title: 'Media URL',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
    },
    {
      name: 'likes',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Likes',
    },
    {
      name: 'comments',
      type: 'array',
      title: 'Comments',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'commenterId', type: 'string', title: 'Commenter ID' },
            { name: 'commenterName', type: 'string', title: 'Name' },
            { name: 'commenterImage', type: 'url', title: 'Image' },
            { name: 'text', type: 'string', title: 'Comment Text' },
            { name: 'createdAt', type: 'datetime', title: 'Commented At' },
          ],
        },
      ],
    },
  ],
};
