import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';

const FitnessPlanForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goals: '',
  });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state for animation
  const [history, setHistory] = useState([]);
  const planRef = useRef(null);

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

    setLoading(true);  // Start loading animation

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
      setHistory([...history, data]);
      setError(null);
    } catch (error) {
      setError('Error generating fitness plan. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);  // Stop loading animation
    }
  };

  const handleDownloadPDF = async () => {
    if (!plan || !planRef.current) return;

    try {
      setDownloading(true);

      const html2pdf = (await import('html2pdf.js')).default;

      const element = planRef.current;
      const opt = {
        margin: 1,
        filename: 'fitness-plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-md flex gap-6">
      {/* Main Form and Plan Section */}
      <div className="flex-1">
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
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin border-2 border-white rounded-full w-5 h-5 mr-2"></div>
            ) : null}
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 font-medium">{error}</p>
        )}

        {plan && (
          <>
            <div className="mt-6 p-4 bg-green-100 rounded" ref={planRef}>
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

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2 disabled:bg-blue-300"
            >
              <Download size={20} />
              {downloading ? 'Generating PDF...' : 'Download Plan as PDF'}
            </button>
          </>
        )}
      </div>

      {/* History Section */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-md shadow-inner">
        <h3 className="text-xl font-bold mb-4">Plan History</h3>
        {history.length === 0 ? (
          <p className="text-gray-600">No history available.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((item, index) => (
              <li key={index} className="bg-white p-3 rounded shadow">
                <h4 className="font-semibold">Plan {index + 1}</h4>
                <p className="text-sm"><strong>Exercise:</strong> {item.exercise}</p>
                <p className="text-sm"><strong>Diet:</strong> {item.diet}</p>
                <p className="text-sm"><strong>Recommendations:</strong> {item.recommendations}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FitnessPlanForm;
