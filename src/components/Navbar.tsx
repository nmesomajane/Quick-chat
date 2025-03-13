import React from 'react'
import Pics from '../assets/nmeso.jpg'

import {auth} from '../firebase'

const Navbar = () => {
  const {currentUser} = auth;
  


  
  // ✅ Format the display name to start with a capital letter
  const formattedName = currentUser?.displayName
    ? currentUser.displayName.charAt(0).toUpperCase() + currentUser.displayName.slice(1).toLowerCase()
    : "";

  return (
    <div className='flex   items-center  w-full pt-4   bg-blue-950 h-15 text-white'>
        <p className='w-full flex items-center text-[20px] pl-2'> QUICK CHAT</p>
        <div className=' w-full flex  gap-6 '>
        {/* <img src={Pics} alt="" className='bg-amber-50 h-[26px] w-[26px] rounded-[50%] ' /> */}
        <p className='flex ml-auto items-center  gap-4 pr-2 text-[20px]'>{formattedName} </p>
        
        </div>
       
      
    </div>
  )
}

export default Navbar
