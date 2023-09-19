import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages.js";
import Input from "../Input/Input.js";
import TextContainer from "../TextContainer/TextContainer.js";
import "./Chat.css";

//! connection with backend
const socket = io.connect("http://127.0.0.1:8000");

const Chat = () => {
  const [name, setUserName] = useState("");
  const [room, setRoomName] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const location = useLocation(); //! location react-DOM

  //! for joining
  useEffect(() => {
    const { Name, Room } = queryString.parse(location?.search);
    setUserName(Name);
    setRoomName(Room);
    socket.emit("join", { name, room }, (err) => {
      if (err) {
        if (err === "user already exists") {
          alert(err);
          window.location.href = "/";
        }
        console.log(err);
      }
    });
  }, [location.search, name, room]);

  //! for handling messages
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    console.log("this is message from client goin to server", message);
    if (message) {
      socket.emit("sendMessage", { message }, () => setMessage(""));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
