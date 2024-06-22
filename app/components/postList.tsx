import React from 'react';

interface PostListProps {
  posts: Post[];
}

interface Post {
  id: string;
  wish: string;
  author: string;
  image: string | null;
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className='flex flex-wrap justify-center items-center'>
      {posts.map(post => (
        <div key={post.id} className="border border-gray-500 w-auto rounded m-3 p-6 flex flex-col items-center shadow-md">
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <h3 className="w-80 text-center mt-4">
            "{post.wish}"
          </h3>
          <h4 className="italic self-end mt-2">{post.author}</h4>
        </div>
      ))}
    </div>
  );
};

export default PostList;
