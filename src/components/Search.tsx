import React, { useState, useEffect, useContext } from 'react';
import Pics from '../assets/nmeso.jpg';
import { collection, query, where, getDocs, setDoc, serverTimestamp, doc, getDoc, updateDoc,onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { AuthContext } from '../context/AuthContextProvider'; // Import your auth context

import {ChatContext} from '../context/ChatContextProvider';

const db = getFirestore();

const Search = () => {
  const {dispatch} = useContext(ChatContext) || {};
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<{ name?: string, uid?: string, displayName?: string, photoURL?: string, latestMessage?: string } | null>(null); // Include necessary user properties
  const [error, setError] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext) || {}; // Provide a default empty object
  const [selectedUser, setSelectedUser] = useState<LocalUser | null>(null);
  const [searchedUsers, setSearchedUsers] = useState<
  { uid: string; name?: string; displayName?: string; photoURL?: string, latestMessage?: string }[]>([]); // Array to store multiple users
  const {chatId } = useContext(ChatContext) || {};

   // defines  handlesearch
  const handleSearch = async () => {
  setError(false);
  if (!username.trim()) return;
  //Capitalize the first letter of the username
  


  const q = query(collection(db, "users"), where("name", "==", username));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setError(true);
      return;
    }

    querySnapshot.forEach((doc) => {
      const newUser = { ...doc.data(), uid: doc.id };

      setSearchedUsers((prevUsers) => {
        // Prevent duplicates (only add if not already in the list)
        if (!prevUsers.some((user) => user.uid === newUser.uid)) {
          return [...prevUsers, newUser];
        }
        return prevUsers;
      });
    });
    setUsername(''); // Clear the input field
  } catch (err) {
    console.error("Error searching user:", err);
    setError(true);
  }
};

useEffect(()=>{
  console.log("SearchedUsers", searchedUsers)
}, [searchedUsers])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
      console.log('Searching for:', username);
    }
  };

  interface LocalUser {
  uid: string;
  email: string;
  name: string;
  chatId?: string | null;
  photoURL?: string | null;
  lastestMessage?: string | null;
  createdAt?: object; // or Timestamp if using Firebase
}


 // defines handleselect
  const handleSelect = async (user: { uid: string; name?: string; displayName?: string; photoURL?: string }) => {
    console.log("Selected user:", user);

    console.log("User object:", user);
    console.log("User name before formatting:", user?.name);

    setSelectedUser({ ...user, email: '', name: user.name || '' }); // Ensure name is always a string

    if (!currentUser) {
      console.error('Current user is not defined');
      return;
    } 

   if (dispatch) {
     dispatch({
       type: "CHANGE_USER",
       payload: {
         ...selectedUser,
          chatId: null,
       },
     });
   }
    if (!user || !currentUser) return; // Guard clause to prevent errors

        if (dispatch) {
          console.log("looking user:", user);
      dispatch({
        type: "CHANGE_USER",
        payload: user, // ✅ dispatch to Update context with selected user
      });
    }

    const combinedId = currentUser.uid > (user?.uid ?? '') ? currentUser.uid + (user?.uid ?? '') : (user?.uid ?? '') + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId)); // Correct collection name to 'chats'
      if (!res.exists()) {
        // Create a chat in the 'chats' collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] }); // Correct collection name

        // Create user chats (assuming 'userChats' collection exists)
        const userChatData = {
          [combinedId + "userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + "Date"]: serverTimestamp(),
        };

        await updateDoc(doc(db, 'userChats', currentUser.uid), userChatData);
 

//  last message in userChats
//       useEffect(() => {
//   if (!currentUser || !user) return; // Ensure both users exist

//   const combinedId =
//     currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

//   // Listen for changes in the chat document
//   const unsubscribe = onSnapshot(doc(db, "chats", combinedId), (docSnap) => {
//     if (docSnap.exists()) {
//       const messages = docSnap.data().messages || [];
//       const latestMessage = messages.length > 0 ? messages[messages.length - 1].text : "No messages yet";
//         if (dispatch) { // ✅ Prevents errors
//         dispatch({
//           type: "UPDATE_LATEST_MESSAGE",
//           payload: { chatId, latestMessage },
//         });
//       } else {
//         console.warn("Dispatch function is undefined.");
//       }
//       if (dispatch) {
//         dispatch({
//           type: "UPDATE_LATEST_MESSAGE",
//           payload: { userId: user.uid, latestMessage },
//         });
//       }
//     }
//   });

//   return () => unsubscribe(); // Cleanup function to prevent memory leaks
// }, [user, currentUser]); // Runs when user or currentUser changes

  //       try {
  //   const chatDoc = await getDoc(doc(db, "chats", combinedId));

  //   let latestMessage = "No messages yet"; // Default message if none exist
  // console.log(chatDoc.exists(), chatDoc.exists() ? chatDoc.data().messages : "" )
  //   if (chatDoc.exists() && chatDoc.data().messages.length > 0) {
  //     const messages = chatDoc.data().messages;
  //     console.log("Messages:", messages);
  //     latestMessage = messages[messages.length - 1]?.text || "No messages yet";
  //   }

  //   if (dispatch) {
  //     dispatch({
  //       type: "CHANGE_USER",
  //       payload: { ...selectedUser, latestMessage },
  //     });
  //   }

  //   console.log("🔄 Updated user with latest message:", latestMessage);
  // } catch (err) {
  //   console.error("🚨 Error fetching latest message:", err);
  // }

        const currentUserChatData = {
          [combinedId + "userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + "Date"]: serverTimestamp(),
        };

        if (user.uid) {
          await updateDoc(doc(db, 'userChats', user.uid), currentUserChatData); // Update the other user's userChats
        }
      }
    } catch (err) {
      console.error('Error creating/updating chat:', err); // More specific error message
    }
  };
  // ✅ Format the display name to start with a capital letter 
  //  const formattedName = user?.name
  //   ? user?.name.charAt(0).toUpperCase() + user?.name.slice(1).toLowerCase()
  //   : "";
  //   console.log("formattedName", formattedName)
  
 

  

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search"
          className="  mx-2 my-3 rounded-xl outline-none border-none focus:ring-0 text-white shadow-lg p-1 w-[100%] flex items-center "
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500">User not found</p>}
      
      {searchedUsers.map((user)=> (
       <div
          className="flex items-center p-4 text-white gap-1 cursor-pointer hover:bg-blue-900 text-[18px] "
          onClick={()=>handleSelect(user)}>  
                    
          <img src={Pics} alt="User profile" className="bg-amber-50 h-[26px] w-[26px] rounded-[50%]" />
          <div>
            <p className="text-[18px] font-bold text-white">{user?.name}</p>
            {/* <p className="text-[12px] text-gray-400">{user?.latestMessage || "No messages yet"}</p> */}
          </div>
        </div>
      )
      )}
    </div>
  );
};

export default Search;