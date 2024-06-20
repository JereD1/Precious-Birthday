import React from 'react'
import Image from 'next/image'
import Jerry from '../profile.jpg'

const wishes = () => {
  return (
    <div className='flex justify-center items-center m-5 p-2'>
      <div className='flex flex-col justify-center items-center m-5 p-2'>
        <h1 className='font-bold text-lg'>Birthday Wishes</h1>
        <div className='flex justify-center items-center m-5 p-2'>
       <div className='border border-gray-500 w-auto rounded m-3 p-6 flex flex-col items-center shadow-md'>
         <Image
         src={Jerry}
         alt="Picture of the author"
         width={400}
         height={400}
         className='w-24 h-24 rounded-full object-cover'
          />
          <h3 className='w-80 text-center mt-4'>
          "A wish for you on your birthday, whatever you ask may you receive,
          whatever you seek may you find,
          whatever you wish may it be 
          fulfilled on your birthday and always.
          Happy birthday!"</h3>
         <h4 className='italic self-end mt-2'>Jeremiah</h4>
      </div>
      </div>

      </div>
    </div>
  )
}

export default wishes
