const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Endpoint to receive form data and generate a fitness plan
app.post('/api/generate-plan', async (req, res) => {
  const { age, weight, height, goals } = req.body;

  // Construct the prompt
  const outputTemplate = '{\
    "Exercise": {\
      "data": "{exercise_plan}"\
    },\
    "Diet Plan": {\
      "data": "{diet_plan}"\
    },\
    "Recommendations": {\
      "data": "{recommendations}"\
    }\
  }';

  const prompt = `Generate a comprehensive fitness plan for a ${age}-year-old weighing ${weight} kg and ${height} cm tall with the goal to ${goals}. Please provide the response strictly in the following JSON format without any markdown or code blocks: ${outputTemplate}.`;

  try {
    // Generate the fitness plan using the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    // Get the generated content
    const generatedPlan = result.response.text().replace(/```json\n|\n```/g, ''); 
    
    // Log the generated plan for debugging
    console.log("Generated Plan:", generatedPlan);

    // Parse the generated plan to JSON
    const parsedPlan = JSON.parse(generatedPlan);

    // Clean up the output by removing asterisks and other unwanted characters
    const cleanOutput = (data) => data.replace(/\*/g, '').trim();

    // Check if the expected structure exists
    if (parsedPlan && parsedPlan.Exercise && parsedPlan.Exercise.data &&
        parsedPlan["Diet Plan"] && parsedPlan["Diet Plan"].data &&
        parsedPlan.Recommendations && parsedPlan.Recommendations.data) {
      
      // Return the cleaned structured plan
      res.json({
        exercise: cleanOutput(parsedPlan.Exercise.data),
        diet: cleanOutput(parsedPlan["Diet Plan"].data),
        recommendations: cleanOutput(parsedPlan.Recommendations.data)
      });
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error("Error Details:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while generating the fitness plan.' });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
