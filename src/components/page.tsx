"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ socket, username, roomId }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  return (
    <div className={`${style.chat_div} `}>
     
      <div className={`${style.chat_border} bg-white  shadow-xl border-t-4 rounded-lg p-4 border-t-blue-800 `}>
        <div style={{ marginBottom: "1rem" }} className="p-4 border-b-2 border-slate-400"  >
          <p className="flex-col flex">
           <span> Name: <b>{username}</b></span><span> and Room Id: <b>{roomId}</b></span>
          </p>
        </div>
        <div className="overflow-y-hidden ">
          {chat.map(({ roomId, user, msg, time }, key) => (
            <div
              key={key}
              className={
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <span
                className={style.chatProfileSpan}
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user.charAt(0)}
              </span>
              <h3 style={{ textAlign: user == username ? "right" : "left" }}>
                {msg}
              </h3>
            </div>
          ))}
        </div>
        <div className="pt-4 px-4 pb-2  ">
          <form onSubmit={(e) => sendData(e)} className="flex flex-row gap-3">
            <input
              className={`${style.chat_input} border-2 border-slate-300 rounded-lg`}
              type="text"
              value={currentMsg}
              placeholder="Type your message.."
             
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button type="submit" className={`${style.chat_button} bg-blue-600 text-white px-3 rounded-lg`}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
