'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Post {
  id: number;
  wish: string;
  author: string;
  image: string | null;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState<Omit<Post, 'id'>>({ wish: '', author: '', image: null });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newPost: Post = { ...formData, id: Date.now() };
    setPosts([...posts, newPost]);
    setFormData({ wish: '', author: '', image: null });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, image: URL.createObjectURL(event.target.files[0]) });
    }
  };

  return (
    <div>
    <div className='flex flex-col justify-center items-center m-5 p-2'> 
    <h1 className='font-bold  text-lg'>Birthday Wishes</h1>
    </div>
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="border border-gray-500 rounded p-4 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Wish:</label>
          <textarea
            name="wish"
            value={formData.wish}
            onChange={handleInputChange}
            className="w-full p-2 border text-black rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full p-2 border text-black rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border  rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Make a Post</button>
      </form>

      <div className='flex flex-col-3 justify-center items-center'>
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
    </div>
  );
};

export default App;
