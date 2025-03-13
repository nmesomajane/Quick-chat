import React, { useContext, useState } from 'react'
import { FaPaperclip, FaImage } from 'react-icons/fa'
import { v4 as uuid } from "uuid"
import { AuthContext } from '../context/AuthContextProvider'
import { ChatContext } from '../context/ChatContextProvider'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { serverTimestamp, doc, setDoc, arrayUnion, Timestamp } from 'firebase/firestore'
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

const Input = () => {
  const [text, setText] = useState("")
  const [img, setImg] = useState<File | null>(null)
  const { currentUser } = useContext(AuthContext) || {};
  const { user } = useContext(ChatContext) || {};
  const storage = getStorage();
  const {chatId} = useContext(ChatContext) || {};

  const handleSend = async () => {

  console.log("Current user:", currentUser);
  console.log("Chat user:", user);
  console.log("Chat ID:", chatId); // Log chatId before using it
  
  if (!chatId){
    console.error('error:chatId is undefined or null');
    return;
  }
  try {
  if (text.trim() === "" && !img) return; // Prevent sending empty messages
  

  console.log("Message to send:", text); // Debugging

  let imageUrl = null;

  if (img) {
    const storageRef = ref(storage, uuid()); // Reference for the image
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      null,
      (error) => console.error("Upload error:", error),
      async () => {
        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

        if (chatId) {
    console.error("Error: chatId is undefined or null.");
  return;
}

        if (chatId) {
          console.error("Error: chatId is undefined or null.");
          return;
        }
        await setDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser?.uid,
            date: Timestamp.now(),
            image: imageUrl, // Include image URL if uploaded
          }),
        });
        
      }
    );
  } else {


    await setDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser?.uid,
        date: Timestamp.now(),
      }),
    });

    // ✅ Clear the input after successfully sending the message
          setText("");
          setImg(null);
  }

  // Update last message in userChats

  if (!currentUser?.uid) {
  console.error("Error: currentUser is undefined or null.");
  return;
}
  
  await setDoc(doc(db, "userChats", currentUser?.uid), {
    [user?.chatId + ".lastMessage"]: { text },
    [user?.chatId + ".date"]: serverTimestamp(),
  });
   if (chatId) {
  console.error("Error: chatId is undefined or null.");
  return;
}

  await setDoc(doc(db, "userChats", chatId), {
    [user?.chatId + ".lastMessage"]: { text },
    [user?.chatId + ".date"]: serverTimestamp(),
  });
    
   console.log("Message successfully stored in Firestore!");
  } catch (error) {
    console.error("Error storing message:", error);
  }

  
};


 
  return (
    <div className='h-[60px] bg-white p-[12px] absolute  bottom-0 w-full '>
      <div className='flex items-center justify-between' >
      <input type="text" placeholder='Enter Message ' onChange={e=>setText(e.target.value)}   onKeyDown={(e) => e.key === "Enter" && handleSend()} value={text}/>
      <div  className='flex items-center justify-between gap-3 outline-none border-none focus:ring-0' >
        <FaPaperclip className='text-#B3E5FC text-xl  ' />
        
        <input type="file" id='file' className='hidden bg-#FAFAFA ' onChange={e => {
          if (e.target.files) {
            setImg(e.target.files[0]);
          }
        }}/>
        <label htmlFor="file">
          <FaImage className='text-#B3E5FC text-xl' />
        </label>
        <button className='shadow-lg bg-#64B5F6 p-1' onClick={handleSend} >Send</button>
        </div>
      </div>
    </div>
  
  );
}

export default Input;
