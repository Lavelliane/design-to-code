import React from 'react'

export default function page() {
  return (
    <div className='flex items-center justify-between bg-gray-200 p-4 gap-4'> <div className='bg-gray-400' style={{ width: '2rem', height: '2rem' }}></div> <div className='flex-1 flex justify-center gap-8'> <span>Item</span> <span>Item</span> <span>Item</span> </div> <button className='bg-blue-500 text-white px-4 py-2 rounded'>Log In</button> </div>
  )
}
