import React, { useState } from 'react';

const FitnessPlanGenerator = () => {
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        goals: '',
        activityLevel: ''
    });
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPlan('');

        try {
            const response = await fetch('https://fitnesspro-backend-1.onrender.com/generate-fitness-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.error}`);
            }

            const data = await response.json();
            setPlan(data);
        } catch (err) {
            setError('An error occurred while generating the fitness plan. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Fitness Plan Generator</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
                <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleInputChange} required />
                <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleInputChange} required />
                <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} required>
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly active">Lightly Active</option>
                    <option value="moderately active">Moderately Active</option>
                    <option value="very active">Very Active</option>
                </select>
                <textarea name="goals" placeholder="Fitness Goals" value={formData.goals} onChange={handleInputChange} required />
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Plan'}
                </button>
            </form>

            {error && <div className="error">{error}</div>}

            {plan && (
                <div className="mt-6">
                    <h3>Your Personalized Fitness Plan:</h3>
                    <p>{plan}</p>
                </div>
            )}
        </div>
    );
};

export default FitnessPlanGenerator;
