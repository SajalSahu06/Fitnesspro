const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 5000; // Change if needed

app.use(cors());
app.use(express.json());

app.post('/generate-fitness-plan', async (req, res) => {
    const { age, weight, height, goals, activityLevel } = req.body;

    const prompt = `Generate a fitness plan for a ${age} years old person weighing ${weight} kg, height ${height} cm, with the goal of "${goals}" and activity level "${activityLevel}".`;

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAA0dX9uRrRy5kBQ1Zp5zhKd4610lP1Sj0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Error fetching data from Gemini API');
        }

        const data = await response.json();
        res.json(data.contents[0].parts[0].text);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the fitness plan.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
