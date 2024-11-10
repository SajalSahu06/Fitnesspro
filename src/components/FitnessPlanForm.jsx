import React, { useState } from 'react';

const FitnessPlanForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goals: '',
  });

  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { age, weight, height, goals } = formData;

    if (!age || !weight || !height || !goals) {
      setError("Please fill out all fields.");
      return;
    }

    const jsonData = {
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      goals: goals,
    };

    try {
      const response = await fetch('http://localhost:5000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the plan');
      }

      const data = await response.json();
      setPlan(data);
      setError(null);
    } catch (error) {
      setError('Error generating fitness plan. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Generate Your Fitness Plan</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Goals</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Generate Plan
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-500 font-medium">{error}</p>
      )}

      {plan && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h3 className="text-xl font-semibold mb-4">Your Fitness Plan</h3>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Exercise Plan:</h4>
            <p className="whitespace-pre-wrap">{plan.exercise}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Diet Plan:</h4>
            <p className="whitespace-pre-wrap">{plan.diet}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Recommendations:</h4>
            <p className="whitespace-pre-wrap">{plan.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessPlanForm;