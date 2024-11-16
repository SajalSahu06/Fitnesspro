import React, { useState, useRef } from "react";
import { Download } from "lucide-react";
import { supabase } from "../supabaseClient"; // Ensure correct import

const FitnessPlanForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goals: '',
    generatedKey: '' // Added field for key
  });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [keyError, setKeyError] = useState(null); // Error for key retrieval
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
    const { age, weight, height, goals, generatedKey } = formData;
  
    if (!age || !weight || !height || !goals || !generatedKey) {
      setError("Please fill out all fields, including the generated key.");
      return;
    }
  
    const jsonData = {
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      goals: goals,
    };
  
    setLoading(true);
  
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
  
      // Store the generated plan in Supabase without checking for existing key
      const { error } = await supabase
        .from('fitness_plans')
        .insert([{ generated_key: generatedKey, plan_data: data }]);
  
      if (error) {
        setError('Failed to store the plan in the database.');
        console.error('Supabase Insert Error:', error);
      } else {
        setHistory([...history, data]);
        setError(null);
      }
    } catch (error) {
      setError('Error generating fitness plan. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  const handleRetrieveHistory = async () => {
    const { generatedKey } = formData;

    if (!generatedKey) {
      setKeyError("Please enter a valid generated key.");
      return;
    }

    // Fetch fitness plans based on the entered generated key
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('plan_data')
      .eq('generated_key', generatedKey);

    if (error) {
      setKeyError("Failed to retrieve plan history.");
      console.error('Supabase Select Error:', error);
      return;
    }

    if (data.length === 0) {
      setKeyError("No plans found for this key.");
      return;
    }

    // Display the fetched plans
    setHistory(data.map(item => item.plan_data));
    setKeyError(null);
  };

  return (
    <div className="w-full mx-auto p-4 bg-white shadow-md rounded-md flex gap-6">
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Generated Key</label>
            <input
              type="text"
              name="generatedKey"
              value={formData.generatedKey}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
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
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Recommendations:</h4>
                <p className="whitespace-pre-wrap">{plan.recommendations}</p>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : <><Download size={20} /> Download as PDF</>}
              </button>
            </div>
          </>
        )}
      </div>

      {/* History Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Your Plan History</h2>
        <div className="mb-4">
          <button
            onClick={handleRetrieveHistory}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
          >
            Retrieve Plan History
          </button>
        </div>

        {keyError && (
          <p className="mt-4 text-red-500 font-medium">{keyError}</p>
        )}

        <div>
          {history.length > 0 && history.map((plan, index) => (
            <div key={index} className="mb-6 p-4 border rounded bg-gray-100">
              <h3 className="text-xl font-semibold">Plan {index + 1}</h3>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Exercise Plan:</h4>
                <p className="whitespace-pre-wrap">{plan.exercise}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Diet Plan:</h4>
                <p className="whitespace-pre-wrap">{plan.diet}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-2">Recommendations:</h4>
                <p className="whitespace-pre-wrap">{plan.recommendations}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FitnessPlanForm;
