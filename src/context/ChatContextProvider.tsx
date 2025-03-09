import react from "react";

import { createContext, ReactNode, useContext } from "react";
import { getAuth,  User } from "firebase/auth";
import app from "../firebase"; // Ensure correct import of Firebase app
import { AuthContext } from "./AuthContextProvider";
import { useReducer } from "react";


const auth = getAuth(app);
// import {ChatContextProvider} from ../context/ChatContextProvider.tsx
import { getFirestore, doc, getDoc } from "firebase/firestore";

// 🔹 Initialize Firestore correctly
const db = getFirestore(app);



// // 🔹 Define the context type
interface ChatContextType {
  currentUser: User | null;
  username: string | null;
  chatId: string | null;
  user: LocalUser | null;
    dispatch: React.Dispatch<{
    type: string;
    payload: any;
}>
}

// 🔹 Define the user type
interface LocalUser {
  uid: string;
  email: string;
  name: string;
  chatId: string | null;  
  photoURL: string | null;
  lastestMessage?: string | null;
  createdAt: object; // or Timestamp if using Firebase
}


// 🔹 Create the context
export const ChatContext = createContext<ChatContextType | null>(null);

interface ChatContextProviderProps {
  children: ReactNode;
}

// 🔹 Create the provider component
export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const {currentUser}=useContext(AuthContext) || {};
  console.log("Current User in ChatContextProvider:", currentUser);
  const INITIAL_STATE: ChatContextType = {
    chatId: null,
    user: null,
    currentUser: null,
    username: null,
   
    dispatch: () => null,
    
  };

  const chatReducer = (state: ChatContextType, action: { type: string; payload: any }) => {
    switch (action.type) {
      case "CHANGE_USER":
          console.log("Updating ChatContext with:", action.payload);

          // generating ChatId
          const generatedChatId = action.payload.chatId || `${currentUser?.uid}_${action.payload.uid}`;
          console.log("Generated ChatId:", generatedChatId);
          
        return {
          chatId: currentUser && currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + (currentUser ? currentUser.uid : ""),
          user: action.payload,
          ChatId: generatedChatId,
         
          currentUser:state.currentUser,
          username: state.username,
          dispatch: state.dispatch,
          
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ ...state, dispatch }}> 
      {children}
    </ChatContext.Provider>
  );
};
