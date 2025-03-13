import React from 'react'
import Navbar from './Navbar'
import Search from './Search'


const Sidebar = () => {
  return (
    <div className='flex-1   bg-blue-950 text-white'>
     <Navbar/>
     <Search/>
     
    </div>
  )
}

export default Sidebar
