import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import User from "./pages/User.tsx";
import { RouteObject, useRoutes } from "react-router-dom";
import { AppRoutes } from "./config/routes.tsx";
import './App.css'
import { useContext } from "react";
import { AuthContext } from "./context/AuthContextProvider.tsx";
import { ChatContext } from "./context/ChatContextProvider.tsx";
import { ChatContextProvider } from "./context/ChatContextProvider.tsx";

function App() {
  
  const authContext = useContext(AuthContext);
  ;
  const currentUser = authContext?.currentUser || null; // Handle possible null context
  const chatContext = useContext(ChatContext);
  const user = chatContext?.user || null; // Handle possible null context
  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
