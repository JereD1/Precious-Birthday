import React from 'react';
import Image from 'next/image';
import Myxprecious1 from '../myxprecious1.jpeg';
import Myxpreciouss2 from '../myxpreciouss2.jpeg';
import Myxpreciouss3 from '../myxpreciouss3.jpeg';

const Header = () => {
  return (
    <div className='h-screen flex flex-col justify-between'>
      {/* Top Text Sectyion */}
      <div className='flex flex-col items-center m-5 p-2'>
        <h3 className='italic text-lg md:text-xl'>28th June 2024</h3>
        <h1 className='font-bold text-3xl md:text-7xl'>HAPPY BIRTHDAY</h1>
        <h3>To Precious</h3>
      </div>

      {/* Middle Section with Images */}
      <div className='flex justify-center items-center'>
        <div className='flex flex-row'>
          <div className='flex flex-col items-center mx-1'>
            <Image
              src={Myxprecious1}
              alt="Picture of the author"
              width={600}
              height={600}
            />
            <h2 className='p-2 m-4 text-center'>Artist</h2>
          </div>
          <div className='flex flex-col items-center mx-1'>
            <Image
              src={Myxpreciouss2}
              alt="Picture of the author"
              width={600}
              height={600}
            />
            <h2 className='p-2 m-4 text-center'>Model</h2>
          </div>
          <div className='flex flex-col items-center mx-1'>
            <Image
              src={Myxpreciouss3}
              alt="Picture of the author"
              width={600}
              height={600}
            />
            <h2 className='p-2 m-4 text-center'>Sister</h2>
          </div>
        </div>
      </div>

      {/* Bottom Text Section */}
      <div className='flex flex-col justify-center items-center mb-4'>
        <h3>Stay on your P's:</h3>
        <h3 className='italic'>Prayer, Priorities, Peace, Positivity, and Patience</h3>
      </div>
    </div>
  );
};

export default Header;
