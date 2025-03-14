import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContextProvider";
import { ChatContextProvider } from "./context/ChatContextProvider";




ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
 <AuthContextProvider>
  <ChatContextProvider>
    <React.StrictMode>
    
      <BrowserRouter>
        <App />
      </BrowserRouter>
    
    </React.StrictMode>
   </ChatContextProvider>
 </AuthContextProvider>
);

