import { auth } from "../firebase"; // Ensure the path is correct
import { getFirestore } from "firebase/firestore";

const db = getFirestore();
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'

import { Link  } from "react-router-dom";
 import { getStorage, ref, uploadBytesResumable, getDownloadURL }
 from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore"; 

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const isFormValid = name.trim() !== "" && email.trim() !== "" && password.trim() !== "";
    const navigate = useNavigate();
    const createUserProfile = async (userId: string, name: string, photoURL: string) => {
  // Create an empty userchats document when the user signs up
  await setDoc(doc(db, "userchats", userId), {});
};

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Update the user's displayName in Firebase Auth
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });
      console.log("User signed up:", userCredential.user);
      navigate("/user");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
   const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && isFormValid) {
      handleSubmit(event);
    }

    const ensureUserChatExists = async () => {
  if (!auth.currentUser) {
    console.log("❌ No user is logged in");
    return;
  }

  const userId = auth.currentUser.uid;
  const userChatRef = doc(db, "userchats", userId);

  try {
    const userChatSnap = await getDoc(userChatRef);

    if (!userChatSnap.exists()) {
      // Create an empty document for the user in the "userchats" collection
      await setDoc(userChatRef, { chats: {} });

      console.log(`✅ Userchats collection created for user: ${userId}`);
    } else {
      console.log("✅ Userchats already exists:", userChatSnap.data());
    }
  } catch (error) {
    console.error("❌ Error creating userchats:", error);
  }
};

// Call this function after login
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("🔄 Checking if userchats exists...");
    ensureUserChatExists();
  }
});


// Call this function after login
ensureUserChatExists();
    

// const storage = getStorage();
// const storageRef = ref(storage, 'images/rivers.jpg');

// const uploadTask = uploadBytesResumable(storageRef, file);

// // Register three observers:
// // 1. 'state_changed' observer, called any time the state changes
// // 2. Error observer, called on failure
// // 3. Completion observer, called on successful completion
// uploadTask.on('state_changed', 
//   (snapshot) => {
//     // Observe state change events such as progress, pause, and resume
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case 'paused':
//         console.log('Upload is paused');
//         break;
//       case 'running':
//         console.log('Upload is running');
//         break;
//     }
//   }, 
//   (error) => {
//     // Handle unsuccessful uploads
//   }, 
//   () => {
//     // Handle successful uploads on complete
//     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//       console.log('File available at', downloadURL);
//     });
//   }
// );


 
        
  };

 



  return (
    <div className='bg-blue-300 h-screen flex items-center justify-center'>
        <div className='flex flex-col gap-7 bg-white rounded-xl p-15'>
            <h1 className='text-blue font-bold text-3xl text-center'> QUICK CHAT</h1>
            <p className='text-#5d5b8d text-xl text-center'>Create Account</p>
            <form onSubmit ={handleSubmit}  onKeyDown={handleKeyPress} className='flex flex-col gap-7 ' action="">
                <input 
                type="text" 
                placeholder='Enter Name'
                value={name} 
                onChange={(e)=> setName (e.target.value)} className='rounded-l  bg-white shadow-sm p-2'/>

                <input type="email"
                 placeholder='email' 
                 value={email} 
                 onChange={(e)=> setEmail (e.target.value)}  className='rounded-l  bg-white shadow-sm p-2 '/>
                <input type="password" 
                value={password} 
                onChange={(e)=> 
                setPassword (e.target.value)}  placeholder='password'className='rounded-l  bg-white shadow-sm p-2'/>
                <input type="file" 
                className='rounded '/>

                <button className='shadow-sm bg-blue-400 rounded p-2 cursor-pointer text-white text-xl'  disabled={!isFormValid}>Sign Up</button>
                
            </form>
            <p>you do have an account? <Link to="/login" style={{ color: "blue", textDecoration: "underline", marginLeft: "5px" }}>Login</Link> </p>
                           

        </div>
      
    </div>
  )
}

export default Signup;
