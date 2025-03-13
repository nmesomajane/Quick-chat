import React, { useState, useEffect, useContext } from 'react'; // Corrected import: added useEffect and useContext
import Pics from '../assets/nmeso.jpg';
import { FaUser, FaVideo, FaEllipsisV } from 'react-icons/fa';
import Messages from './Messages';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContextProvider';
import {ChatContext} from '../context/ChatContextProvider';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'; // Correct imports
// Removed incorrect import
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";





const Chat = () => {
  const [message, setMessage] = useState<any[]>([]);
  const { currentUser } = useContext(AuthContext) || {};
  const {dispatch} =useContext (ChatContext) || {};
  const {  user } = useContext(ChatContext) || {};
  const {chatId} = useContext(ChatContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  


  console.log("User in ChatComponent:", user); 
  console.log("ChatComponent - chatId:", chatId);////  ✅ Log user object

  interface ChatData {
    userInfo?: {
      displayName?: string;
    };
    lastMessage?: {
      text?: string;
    };
  }

  useEffect(() => {
    console.log("Selected user:", user?.name); // Log the selected user
  }, [user]); 



  const [chats, setChats] = useState<Record<string, ChatData>>({}); // Initialize as an object with type

  const db = getFirestore();

  useEffect(() => {
    if (!currentUser?.uid) return; // Important: Check if currentUser and uid exist

    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => { // Corrected collection name
       setChats(doc.exists() ? doc.data() : {}); // Ensure doc exists before accessing data
      });

      return unsub; // Return the unsubscribe function
    };

    const unsubscribe = getChats(); // Call getChats and store the unsubscribe function

    return () => unsubscribe(); // Cleanup: unsubscribe on unmount or currentUser change
  }, [currentUser?.uid]); // Dependency array: currentUser.uid (with optional chaining)
  useEffect(() => {
    if (!chatId) return;
   const unsubscribe = onSnapshot(doc(db, "chats", chatId), (doc) => {
    if (doc.exists()) {
      setMessage(doc.data().messages || []);
    } else {
      setMessage([]);
    }
  });

  return () => unsubscribe();
}, [chatId]); // Dependency array: chatId


   const handleSelect = (u: any) => {
    console.log("Selected user:", u);
    if (dispatch) {
      dispatch({ type: "CHANGE_USER", payload: u }); // Dispatch the user object
    }
  };
   const formattedName = user?.name
    ? user?.name.charAt(0).toUpperCase() + user?.name.slice(1).toLowerCase()
    : "";

  const handleLogout = async () => {
      try {
        await signOut(auth);
        console.log("User logged out");
        const navigate = useNavigate();
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

  return (
    <div className='flex-2 bg-blue-500 relative overflow-y-auto'>
      <div className='h-15 bg-blue-900 flex justify-between p-4'>
        
        {Object.entries(chats)
        .filter(([_, chatData]) => chatData) // Remove null or undefined chatData
        .map(([chatId, chatData]) => ( // Destructure keys and values
          // Render each chat data
          // Use chatId as the key
          <div className='flex' key={chatId} onClick={() => handleSelect(chatData.userInfo)}> {/* Use chatId as the key */}
            {/* <img src={Pics} alt='profile' className='w-10 h-10 rounded-full' />  */}
            <div className='flex flex-col ml-2'>
              <p>{chatData.userInfo?.displayName}</p>
              <p>{chatData.lastMessage?.text}</p>
            </div>
          </div>
        ))}
        <div className='flex  justify-between items-center  w-full h-15 pb-3'>
          <div className='flex items-center text-white  font-bold text-[20px]'>
           {user ? <p>{ formattedName}</p> : <p>No user selected</p>}
          </div>
          <div className='flex ml-auto items-center  gap-4 '>
            <FaUser className='text-white text-xl' />
            <FaVideo className='text-white text-xl' />
            <div className="relative">
      {/* Three-dot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <FaEllipsisV className='text-white text-xl' />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Linked Devices</li>
            <button className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 ' onClick={handleLogout} >Log Out</button>
          </ul>
        </div>
      )}
    </div>

            
          </div>
        </div>
      </div>

      <div>
        <Messages  />
      </div>
    </div>
  );
};

export default Chat;