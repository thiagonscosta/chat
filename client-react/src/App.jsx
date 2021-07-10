import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

let socket;
const ENDPOINT = "http://localhost:5000/";

function App() {
  // before login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  // after login
  const [message, setMessage] = useState("sample");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = () => {
    let messageContent = {
      room: room,
      content: {
        author: username,
        message: message,
      },
    };

    socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input
              type="text"
              placeholder="Name..."
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room..."
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, key) => {
              return (
                <div
                  key={key}
                  className="messageContainer"
                  id={val.author === username ? "You" : "Other"}
                >
                  <span>{val.author}</span>
                  <div className="messageIndividual">{val.message}</div>
                </div>
              );
            })}
          </div>

          <div className="messageInputs">
            <input
              type="text"
              placeholder="Message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
