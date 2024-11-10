// server.js
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const API_KEY = process.env.API_KEY;

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini API' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});