'use client'
import React, { useState, useEffect } from 'react';
import PostForm from './post';
import PostList from './postList';
import { db } from '@/Firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface Post {
  id: string;
  wish: string;
  author: string;
  image: string | null;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  const addPost = async (post: Omit<Post, 'id'>) => {
    const docRef = await addDoc(collection(db, 'posts'), post);
    const newPost = { id: docRef.id, ...post };
    setPosts([...posts, newPost]);
  };

  return (
    <div className='h-screen'>
      <div className='flex flex-col justify-center items-center m-5 p-2'> 
        <h1 className='font-bold text-lg'></h1>
      </div>
      <div className="flex flex-col justify-center items-center mx-auto p-4">
       { /*<PostForm addPost={addPost} /> */}
        <PostList posts={posts} />
      </div>
    </div>
  );
};

export default App;
