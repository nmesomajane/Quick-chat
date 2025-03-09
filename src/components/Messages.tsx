import React, { useEffect } from 'react'
import { useState } from 'react'
import Message from './Message'
import Input from './Input'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContextProvider'
import { AuthContext } from '../context/AuthContextProvider'
import { onSnapshot } from 'firebase/firestore'

import {doc} from 'firebase/firestore'
import { getFirestore } from "firebase/firestore";

//  properties of the message here or message  type
interface MessageType {
    id: string;
    senderId: string;
    text: string;
    date: {
        toDate: () => Date;
    };
    
  }

const db = getFirestore();

const Messages = () => {

  const [Messages, setMessages] = useState<MessageType[]>([]); // Initialize as an array
   const { currentUser } = useContext(AuthContext) || {};
   const {chatId} = useContext(ChatContext) || {}


   const {user}= useContext(ChatContext) || {};
  
  
  

    useEffect(() => {
    if (!chatId) {
      console.log("No chatId, skipping message fetch.");
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "chats", chatId), (doc) => {
      if (doc.exists()) {
        const newMessages: MessageType[] = doc.data().messages || [];

        setMessages((prevMessages): MessageType[] => {
          // ✅ Prevent duplicates by checking existing messages
          const uniqueMessages = new Map<string, MessageType>([
            ...prevMessages.map((msg) => [msg.id, msg] as [string, MessageType]),
            ...newMessages.map((msg) => [msg.id, msg] as [string, MessageType]),
          ]).values();

          return Array.from(uniqueMessages) as MessageType[];
        });

        console.log(`Fetched messages for chatId: ${chatId}`, newMessages);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  return (
    <div>
    <div className=' h-[calc(100vh-150px)]overflow-y-auto ' >
       {Messages.map((message) => (
        <Message key={message.id} message={message}/>
      )
      )}
      
      <Input/>
    </div>
    </div>
  )
}

export default Messages
