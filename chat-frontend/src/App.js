import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// IMPORTANT: Paste your actual backend URL inside the quotes below!
const socket = io.connect("https://live-messaging-project.onrender.com"); 

function App() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // Function to send a message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: socket.id,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'Me'
      };

      await socket.emit("send_message", messageData);
      
      // Update our own UI instantly
      setMessageList((prev) => [...prev, messageData]);
      setCurrentMessage("");
    }
  };

  // Listen for incoming messages from the server
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prev) => [...prev, { ...data, sender: 'other' }]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  return (
    <div className="chat-container">
      
      {/* Chat Header */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '15px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: 'white' }}>Live Chat</h2>
      </div>

      {/* Chat Body */}
      <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {messageList.map((msg, index) => (
          <div key={index} className={msg.sender === 'Me' ? "message-me" : "message-them"}>
            <p style={{ margin: 0 }}>{msg.message}</p>
            <span style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '5px', display: 'block', textAlign: 'right' }}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      {/* Chat Footer (Input area) */}
      <div style={{ display: 'flex', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.2)', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              sendMessage();
            }
          }}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none', outline: 'none', backgroundColor: 'rgba(255,255,255,0.8)' }}
        />
        <button 
          onClick={sendMessage} 
          style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#0078ff', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default App;
