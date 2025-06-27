import React from 'react'
import Link from 'next/link'
import Mobile from '@/app/components/reminder'


const page = () => {
  return (
    <div className='m-2 p-4'>
      <Mobile />
      <div className="text-center mt-8">
<Link href="/" className="text-blue-500 hover:underline">
        Back to Home
        
    </Link>
      </div>
        
    </div>
  ) 
}

export default page
