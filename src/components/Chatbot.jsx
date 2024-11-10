import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const BASE_PROMPT = {
    role: "system",
    content: `You are Donnie, an automated Gym assistant to provide workout routines for the users and give suggestions. 
    You first greet the customer, then ask them what type of workout routine they want, 
    give them a few workout options and wait for them to finalize if they ask for changes make those changes accordingly, 
    then summarize it and check for a final time if the user wants to add anything else. 
    If it's a split, you ask for an upper body lower body or back chest and legs split. 
    Make sure to clarify all questions about exercises and form 
    also make sure to talk only about fitness and fitness related topics
    You respond in a short, very conversational friendly style.`
  };

  useEffect(() => {
    setMessages([BASE_PROMPT]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://your-backend-api/chat', {
        messages: [...messages, userMessage]
      });

      const assistantMessage = response.data.choices[0].message;
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    return (
      <div key={index} className={`message ${isUser ? 'user' : 'assistant'}`}>
        <strong>{isUser ? 'You' : 'Donnie'}: </strong>
        {message.content}
      </div>
    );
  };

  return (
    <div className="chatbot">
      <h2>FIT-BOT</h2>
      <div className="chat-window">
        {messages.slice(1).map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter message here"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;