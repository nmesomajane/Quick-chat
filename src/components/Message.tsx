import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { ChatContext } from "../context/ChatContextProvider";

interface MessageProps {
  message: {
    senderId: string;
    text: string;
    date: {
      toDate: () => Date;
    };
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
 const { currentUser } = useContext(AuthContext) || {};
  const { user } = useContext(ChatContext) || {};

  return (
    <div
      className={`flex gap-3 m-3 ${
        message.senderId === currentUser?.uid ? "flex-row-reverse" : ""
      }`}
    >
      {/* Profile Picture & Timestamp */}
      <div className="flex flex-col items-center">
        <img
          src={
            message.senderId === currentUser?.uid
              ? currentUser?.photoURL ?? ""
              : user?.photoURL ?? ""
          }
          alt=""
          className="w-[40px] h-[40px] rounded-full object-cover"
        />
        <p className="text-gray-400 text-sm">
          {new Date(message.date?.toDate()).toLocaleTimeString()}
        </p>
      </div>

      {/* Message Bubble */}
      <div className="flex max-w-[80%]">
        <p
          className={`px-3 py-2 text-sm ${
            message.senderId === currentUser?.uid
              ? "bg-blue-900 text-white"
              : "bg-blue-500 text-black"
          }`}
          style={{
            borderRadius:
              message.senderId === currentUser?.uid
                ? "10px 0px 10px 10px"
                : "0px 10px 10px 10px",
          }}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
};

export default Message;
