import React from 'react'
import Pics from '../assets/nmeso.jpg'

import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const {currentUser} = auth;
  

const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  // ✅ Format the display name to start with a capital letter
  const formattedName = currentUser?.displayName
    ? currentUser.displayName.charAt(0).toUpperCase() + currentUser.displayName.slice(1).toLowerCase()
    : "";

  return (
    <div className='flex items-center  bg-blue-950 h-15 text-white'>
        <p className='w-full pl-1'> Quick Chat</p>
        <div className=' w-full flex  gap-2 '>
        <img src={Pics} alt="" className='bg-amber-50 h-[26px] w-[26px] rounded-[50%] ' />
        <p>{formattedName} </p>
        <button className='bg-blue-500 font-[10px]shadow-md text-white cursor-pointer rounded-xl p-0.5' onClick={handleLogout} >Log Out</button>
        </div>
       
      
    </div>
  )
}

export default Navbar
