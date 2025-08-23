import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../../contexts";
import { Div, Subtitle, Title } from "../../components";
import { Button, Input } from "../../theme/daisyui";

const socket = io("http://localhost:4000/chat");
const roomSocket = io("http://localhost:4000/room");

const Room: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const {loggedUser} = useAuth();
  
  useEffect(() => {
    const name = loggedUser?.username;
    setNickname(name);

    roomSocket.emit("getRooms");
    

    socket.on("connect", () => {
      console.log("Connected to chat namespace");
    });

    socket.on("message", (data: { message: string }) => {
      setChatMessages((prev) => [...prev, data.message]);
    });

    socket.on("notice", (data: { message: string }) => {
      setNotices((prev) => [...prev, data.message]);
    });

    roomSocket.on("connect", () => {
      console.log("Connected to room namespace");
      roomSocket.emit("getRooms");
    });

    roomSocket.on("message", (data: { message: string }) => {
      setChatMessages((prev) => [...prev, data.message]);
    });

    roomSocket.on("rooms", (data: string[]) => {
      console.log("rooms updated:", data);
      setRooms(data);
    });

    return () => {
      socket.off("message");
      socket.off("notice");
      roomSocket.off("message");
      roomSocket.off("rooms");
    };
}, [loggedUser]);


  const sendMessage = () => {
    if (!currentRoom) {
      alert("방을 선택해주세요.");
      return;
    }
    if (!message.trim()) return;

    const data = { message, nickname, room: currentRoom };
    setChatMessages((prev) => [...prev, `나 : ${message}`]);
    roomSocket.emit("message", data);
    setMessage("");
  };

  const createRoom = () => {
  const room = prompt("생성하실 방의 이름을 입력해주세요.");
  if (room) {
    roomSocket.emit("createRoom", { room, nickname });
    roomSocket.emit("getRooms");
  }
};


  const joinRoom = (room: string) => {
    roomSocket.emit("joinRoom", { room, nickname, toLeaveRoom: currentRoom });
    setCurrentRoom(room);
  };

  return (
    <Div className="flex-col justify-center p-4 align-center">
        <Title>Chatting</Title>
        <Div className="flex-col mt-4 ml-4">
            <Subtitle className="text-start">공지</Subtitle>
            <Div className="h-40 mt-4 overflow-y-auto border">
                {notices.map((notice, i) => <div key={i}>{notice}</div>)}
            </Div>
        </Div>
        <Div className="flex-col mt-4 ml-4">
            <Subtitle className="text-start">채팅방</Subtitle>
            <Div className="mt-4 overflow-y-auto">
                <ul>
                    {rooms.map((room) => (
                        <li key={room}>
                        {room}{" "}
                        <Button
                            onClick={() => joinRoom(room)}
                            className="px-2 ml-2 border bg-primary "
                        >
                            join
                        </Button>
                        </li>
                    ))}
                </ul>
            </Div>
            <Button className="mt-4 bg-primary" onClick={createRoom}>방 만들기</Button>
        </Div>
        <Div className="flex-col mt-4 ml-4">
            <Subtitle className="text-start">채팅</Subtitle>
            <Div className="h-40 p-2 overflow-y-auto border">
            {chatMessages.map((msg, i) => (
                <Div key={i}>{msg}</Div>
            ))}
            </Div>
            <Input 
                type="text"
                placeholder="메시지를 입력해주세요."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter")
                    sendMessage();
                }}
                className="w-full p-1 mt-4 border-solid border-primary"
            />
            <Button className="w-full mt-4 text-center border" onClick={sendMessage}>보내기</Button>
        </Div>
        
    </Div>
  )
};

export default Room;
