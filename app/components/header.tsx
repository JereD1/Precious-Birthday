import React from 'react'
import Image from 'next/image';
import Myxrecious1 from '../myxprecious1.jpeg'
import Myxreciouss2 from '../myxpreciouss2.jpeg'
import Myxreciouss3 from '../myxpreciouss3.jpeg';


const header = () => {
  return (
    <div>
      <div className='flex flex-col justify-center items-center mt-8 mb-8 p-6'>
        <h3 className='flex italic'>28th June 2024</h3>
        <h1 className='font-bold text-3xl'>HAPPY BIRTHDAY</h1>
        <h3 className=''>To Precious</h3>
      </div>

      <div className='flex justify-center items-center m-10'>
        <div className='flex flex-row'>
            <div className='flex flex-col items-center mx-1'>
            <Image
            src={Myxrecious1}
            alt="Picture of the author"
            width={500}
            height={500} 
    />
                <h2 className='p-2 m-4 text-center'>Singer</h2>
            </div>
            <div className='flex flex-col items-center mx-1'>
            <Image
            src={Myxreciouss2}
            alt="Picture of the author"
            width={500}
            height={500} 
    />
                <h2 className='p-2 m-4 text-center'>Model</h2>
            </div>
            <div className='flex flex-col items-center mx-1'>
            <Image
            src={Myxreciouss3}
            alt="Picture of the author"
            width={500}
            height={500} 
    />
                <h2 className='p-2 m-4 text-center'>Sister</h2>
            </div>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
          <h3>Stay on your P's:</h3>
          <h3 className='italic'>Prayer, Priorities, Peace, Postivity and Patience</h3>
      </div>
    </div>
  )
}

export default header
