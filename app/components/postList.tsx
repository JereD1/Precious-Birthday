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
    <div>
        <div className='flex flex-col justify-center items-center m-5 p-4'>
        <h1 className='text-3xl font-bold'>Bithday Wishes</h1>
      </div>
    <div className='flex flex-wrap justify-center items-center md:grid md:grid-cols-2 lg:grid lg:grid-cols-4'>
      
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
    </div>
  );
};

export default PostList;
