import React, { useState, useEffect, useContext } from 'react'; // Corrected import: added useEffect and useContext
import Pics from '../assets/nmeso.jpg';
import { FaUser, FaVideo, FaEllipsisH } from 'react-icons/fa';
import Messages from './Messages';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContextProvider';
import {ChatContext} from '../context/ChatContextProvider';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'; // Correct imports




const Chat = () => {
  const [message, setMessage] = useState<any[]>([]);
  const { currentUser } = useContext(AuthContext) || {};
  const {dispatch} =useContext (ChatContext) || {};
  const {  user } = useContext(ChatContext) || {};
  const {chatId} = useContext(ChatContext) || {};
  


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
  return (
    <div className='flex-2 bg-gray-300 relative overflow-y-auto'>
      <div className='h-15 bg-gray-400 flex justify-between p-4'>
        
        {Object.entries(chats)
        .filter(([_, chatData]) => chatData) // Remove null or undefined chatData
        .map(([chatId, chatData]) => ( // Destructure keys and values
          // Render each chat data
          // Use chatId as the key
          <div className='flex' key={chatId} onClick={() => handleSelect(chatData.userInfo)}> {/* Use chatId as the key */}
            <img src={Pics} alt='profile' className='w-10 h-10 rounded-full' />
            <div className='flex flex-col ml-2'>
              <p>{chatData.userInfo?.displayName}</p>
              <p>{chatData.lastMessage?.text}</p>
            </div>
          </div>
        ))}
        <div className='flex  justify-between items-center w-full h-15'>
          <div className='flex items-center text-black text-[20px]'>
           {user ? <p>{user.name}</p> : <p>No user selected</p>}
          </div>
          <div className='flex ml-auto items-center  gap-4 '>
            <FaUser className='text-#B3E5FC' />
            <FaVideo className='text-#B3E5FC' />
            <FaEllipsisH className='text-#B3E5FC' />
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