import React, { useState, ChangeEvent, FormEvent } from 'react';
import { storage } from '@/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PostFormProps {
  addPost: (post: Omit<Post, 'id'>) => void;
}

interface Post {
  id: string;
  wish: string;
  author: string;
  image: string | null;
}

interface FormData {
  wish: string;
  author: string;
  image: File | null;
}

const PostForm: React.FC<PostFormProps> = ({ addPost }) => {
  const [formData, setFormData] = useState<FormData>({ wish: '', author: '', image: null });
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    let imageUrl = null;

    if (formData.image) {
      const imageRef = ref(storage, `images/${Date.now()}_${formData.image.name}`);
      await uploadBytes(imageRef, formData.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    addPost({ ...formData, image: imageUrl });
    setFormData({ wish: '', author: '', image: null });
    setIsLoading(false); // End loading
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, image: event.target.files[0] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/2 border border-gray-500 rounded p-4 mb-6">
      <div className="mb-4">
        <label className="block text-white">Wish:</label>
        <textarea
          name="wish"
          value={formData.wish}
          onChange={handleInputChange}
          className="w-full p-2 border text-black rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Author:</label>
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
        <label className="block text-white">Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
        {isLoading ? 'Posting...' : 'Make a Post'}
      </button>
    </form>
  );
};

export default PostForm;
