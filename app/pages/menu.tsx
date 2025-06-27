'use client';
import Link from 'next/link';
import { useState } from 'react';
import CreatePostModal from '../components/createPostModal';
import User from '../components/user';
const Menu = () => {

    const [isModalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-col space-y-4">
      <Link href="/" passHref>
     <h2 className="text-lg font-semibold hover:text-blue-500">  Home </h2>
      </Link>
     
        <User/>
      
      <button onClick={ () => setModalOpen(true)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        Create Post
      </button>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Menu;