import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import axios from 'axios';

const AiChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your fitness assistant. I'm here to help with exercise, workouts, and fitness tips. How can I assist you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Function to check if response is fitness-related
  const isFitnessRelated = (text) => {
    const fitnessKeywords = ["exercise", "workout", "fitness", "strength", "training", "diet", "nutrition", "cardio", "muscle", "weight loss", "bodybuilding"];
    return fitnessKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newUserMessage = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages([...messages, newUserMessage]);
      setInput('');

      try {
        // Send the user's message to the AI API
        const response = await axios.post('http://localhost:3000/api/chat', {
          message: `This is a fitness-focused chatbot. Only provide information related to exercise, workouts, fitness plans, and nutrition. ${input}`
        });

        let aiResponseText = response.data.response.replace(/[*_]/g, ''); // Removes stars and underscores

        // Check if AI response is fitness-related
        if (!isFitnessRelated(aiResponseText)) {
          aiResponseText = "I'm here to assist with fitness and exercise topics only. Please ask something related to workouts, diet, or fitness plans.";
        }

        const aiResponse = { id: messages.length + 2, text: aiResponseText, sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiResponse]);

      } catch (error) {
        console.error('Error communicating with AI:', error);
        const aiResponse = {
          id: messages.length + 2,
          text: "I'm sorry, I'm having trouble communicating with the AI right now. Please try again later.",
          sender: 'ai'
        };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">AI Fitness Chat</h1>
      
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 rounded-lg p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {message.sender === 'user' ? (
                <User className="w-8 h-8 rounded-full bg-blue-500 text-white p-1 ml-2" />
              ) : (
                <Bot className="w-8 h-8 rounded-full bg-green-500 text-white p-1 mr-2" />
              )}
              <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your fitness question..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition duration-300">
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default AiChatPage;
