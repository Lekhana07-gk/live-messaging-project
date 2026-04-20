import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server
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
      };

      // Send message to the backend
      await socket.emit("send_message", messageData);
      
      // Update our own UI
      setMessageList((prev) => [...prev, { ...messageData, sender: 'Me' }]);
      setCurrentMessage("");
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prev) => [...prev, { ...data, sender: 'Other' }]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  return (
    <div className="chat-container">
    <div style={styles.chatContainer}>
      <div style={styles.chat-Window}>
        <div style={styles.chatHeader}>
          <h2>Live Chat</h2>
        </div>
        
        <div style={styles.chatBody}>
          {messageList.map((msg, index) => (
            <div key={index} className={msg.sender === 'Me' ? "message.me" : "message-them"}>
              <p style={{ margin: 0 }}>{msg.message}</p>
              <span style={styles.timeText}>{msg.time}</span>
            </div>
          ))}
        </div>
        placeholder="Type a message..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === 'Enter' && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
        </div>
      </div>
    </div>
);
}

// Simple inline styles for a clean UI
const styles = {
  appContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif' },
  chatWindow: { width: '400px', height: '500px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
  chatHeader: { backgroundColor: '#007bff', color: '#fff', padding: '15px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', textAlign: 'center' },
  chatBody: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  messageMe: { alignSelf: 'flex-end', backgroundColor: '#007bff', color: '#fff', padding: '10px 15px', borderRadius: '15px 15px 0 15px', maxWidth: '70%' },
  messageOther: { alignSelf: 'flex-start', backgroundColor: '#e9ecef', color: '#333', padding: '10px 15px', borderRadius: '15px 15px 15px 0', maxWidth: '70%' },
  timeText: { fontSize: '0.75rem', opacity: 0.7, marginTop: '5px', display: 'block', textAlign: 'right' },
  chatFooter: { display: 'flex', padding: '15px', borderTop: '1px solid #ddd' },
  input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' },
  button: { padding: '10px 20px', marginLeft: '10px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer' }
};

export default App;
