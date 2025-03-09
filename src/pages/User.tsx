import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const User = () => {
  return (
    <div className='bg-blue-300 h-screen flex items-center justify-center'> 
    <div className='border  rounded-xl w-[70%] h-[80%] bg-white flex overflow-hidden'>
      <Sidebar/>
      <Chat/>
    </div>
    </div>
  )
}

export default User;
