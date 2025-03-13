import React from 'react'
import { auth } from "../firebase"; // Adjust path if needed
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";




const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
    const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;
    
    setError(""); // Reset error before new attempt

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      alert("Login successful!");

      navigate("/user");
    } 
    catch (error: any) {
      setError(error.message);
      console.error("Error logging in:", error);
    }
  };
   const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (event.key === "Enter" && isFormValid) {
        handleLogin(event);
      }
    };
    

  return (
    <div className='bg-blue-300 h-screen flex items-center justify-center'>
        <div className='flex flex-col gap-7 bg-white rounded-xl p-15'>
            <h1 className='text-blue font-bold text-3xl text-center'> QUICK CHAT</h1>
            <p className='text-#5d5b8d text-xl text-center'>Login</p>
            <form className='flex flex-col gap-7 ' action="" onClick={handleLogin} onKeyDown={handleKeyPress}>
                
                <input type="email" 
                placeholder='email' 
                value={email}
                onChange={(e)=> setEmail
                (e.target.value)}
                className='rounded-l  bg-white shadow-sm p-2 '/>
                <input type="password" 
                 placeholder='password'
                  value={password}
                  onChange={(e)=> setPassword
                  (e.target.value)}
                className='rounded-l  bg-white shadow-sm p-2'/>

                <p><Link to="/" style={{ color: "blue", textDecoration: "underline", marginLeft: "5px" }}>Forget password</Link></p>
                
                <button className='shadow-sm bg-blue-400 rounded p-2 cursor-pointer text-white text-xl' disabled={!isFormValid} >Login</button>
            </form>
            <p>You dont have an account?<Link to="/" style={{ color: "blue", textDecoration: "underline", marginLeft: "5px" }}>Sign up</Link> </p>
                           

        </div>
      
    </div>
  )
}

export default Login
