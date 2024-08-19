import React, { useState, useEffect } from 'react';
import '../styles/ChatBubble.css'; // Import CSS for the chat bubble styles

const ChatBubble = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]); // State to hold messages
  const [input, setInput] = useState(''); // State to hold the current input value
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const [isFirstMessage, setIsFirstMessage] = useState(true); // State to check if welcome message is sent

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (isChatOpen && isFirstMessage) {
      // Send the welcome message when the chat is first opened
      setMessages([{ text: 'Welcome to tech support! How can we help you today?', type: 'tech' }]);
      setIsFirstMessage(false); // Ensure the message is only sent once
    }
  }, [isChatOpen, isFirstMessage]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      // Add user's message to the chat
      setMessages([...messages, { text: input, type: 'user' }]);
      setInput('');
      setIsLoading(true);

      // Simulate a delay for the tech chat response
      setTimeout(() => {
        setMessages([...messages, { text: input, type: 'user' }, { text: getRandomResponse(), type: 'tech' }]);
        setIsLoading(false);
      }, 1000); // Adjust delay as needed
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "Thanks for reaching out! How can I assist you today?",
      "I'm here to help! What do you need?",
      "Let me check that for you.",
      "Can you provide more details?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="chat-container">
      <div className={`chat-bubble ${isChatOpen ? 'open' : ''}`} onClick={toggleChat}>
        <span className="chat-icon">💬</span>
      </div>
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Tech Chat</h3>
            <button className="close-chat" onClick={toggleChat}>×</button>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.type}`}>
                <p>{message.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message tech">
                <p>...</p> {/* Loading indicator */}
              </div>
            )}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
