import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './homepage.css';
import { supabase } from "../supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Label,
  LabelList
} from 'recharts';

const FitnessTrackingPage = () => {
  const [workouts, setWorkouts] = useState([]);  // Holds the list of workouts
  const [newWorkout, setNewWorkout] = useState({
    type: 'Running',
    duration: '',
    distance: '',
    calories: '',
    weight: '',
    reps: '',
    sets: ''
  });
  const [generatedKey, setGeneratedKey] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  // Fetch stored workout plans from Supabase on load
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      if (generatedKey) {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('generated_key', generatedKey);

        if (error) {
          console.error('Error fetching workout plan:', error);
        } else {
          setWorkoutPlan(data);
          setWorkouts(data);  // Update workouts state with fetched data
        }
      }
    };
    fetchWorkoutPlan();
  }, [generatedKey]);

  // Save workout to Supabase
  const saveWorkoutToSupabase = async () => {
    if (generatedKey) {
      // Ensure numeric fields are valid numbers or set to 0 if empty
      const duration = newWorkout.duration ? Number(newWorkout.duration) : 0;
      const distance = newWorkout.distance ? Number(newWorkout.distance) : 0;
      const calories = newWorkout.calories ? Number(newWorkout.calories) : 0;
      const weight = newWorkout.weight ? Number(newWorkout.weight) : 0;
      const reps = newWorkout.reps ? Number(newWorkout.reps) : 0;
      const sets = newWorkout.sets ? Number(newWorkout.sets) : 0;

      try {
        const { data, error } = await supabase
          .from('workouts')
          .insert({
            generated_key: generatedKey,
            type: newWorkout.type,
            duration: duration,
            distance: distance,
            calories: calories,
            weight: weight,
            reps: reps,
            sets: sets,
            date: new Date().toISOString().split('T')[0]
          });

        if (error) {
          console.error('Error saving workout:', error);
        } else {
          alert('Workout saved successfully!');
          // Immediately update the workouts state with the new workout
          setWorkouts([data[0], ...workouts]);
        }
      } catch (error) {
        console.error('Error saving workout:', error);
      }
    } else {
      alert('Please enter a valid generated key');
    }
  };

// Handle new workout form submission
const handleAddWorkout = (e) => {
  e.preventDefault();
  if (newWorkout.type === "Strength Training") {
    if (!newWorkout.duration || !newWorkout.weight || !newWorkout.reps || !newWorkout.sets) {
      alert("Please fill in all required fields for Strength Training.");
      return;
    }
  } else {
    if (!newWorkout.duration || !newWorkout.distance || !newWorkout.calories) {
      alert("Please fill in all required fields for this workout.");
      return;
    }
  }
  saveWorkoutToSupabase();
  setNewWorkout({
    type: "Running",
    duration: "",
    distance: "",
    calories: "",
    weight: "",
    reps: "",
    sets: "",
  });
  setShowAddWorkout(false);
};


  // Helper function to convert data into chart-friendly format
  const getChartData = () => {
    return workouts.map((workout) => ({
      date: workout.date,
      calories: Number(workout.calories) || 0,
      distance: Number(workout.distance) || 0,
      duration: Number(workout.duration) || 0,
      type: workout.type
    }));
  };

  // Helper function for pie chart data (workout types distribution)
  const getPieChartData = () => {
    const typeCount = workouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(typeCount).map((type) => ({
      name: type,
      value: typeCount[type]
    }));
  };

  // Chart rendering logic
  const renderWorkoutPlanChart = () => {
    const chartData = getChartData();

    if (chartData.length > 0) {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#555' }} />
            <YAxis tick={{ fontSize: 12, fill: '#555' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }} 
              labelStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }} 
              itemStyle={{ fontSize: '12px', color: '#666' }}
            />
            <Legend verticalAlign="top" height={36} iconSize={14} />
            <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#FF8042"
              strokeWidth={2}
              dot={{ r: 6, fill: '#FF8042' }}
              activeDot={{ r: 8 }}
              strokeDasharray="5 5"
              name="Calories"
            />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#42A5F5"
              strokeWidth={2}
              dot={{ r: 6, fill: '#42A5F5' }}
              activeDot={{ r: 8 }}
              strokeDasharray="5 5"
              name="Distance"
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#66BB6A"
              strokeWidth={2}
              dot={{ r: 6, fill: '#66BB6A' }}
              activeDot={{ r: 8 }}
              strokeDasharray="5 5"
              name="Duration"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return <p>No workout data available to display.</p>;
    }
  };

  const renderPieChart = () => {
    const pieData = getPieChartData();

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ff8042' : '#42a5f5'} />
            ))}
          </Pie>
          <Legend iconSize={14} verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Fitness Tracking</h1>
        <button
          onClick={() => setShowAddWorkout(true)}
          className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" size={20} />
          Log Workout
        </button>
      </div>

      {/* Enter Generated Key */}
      <div className="bg-white p-8 justify-center rounded-xl shadow-sm border ">
        <h3 className="text-lg font-semibold mb-4">Enter Generated Key</h3>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter your generated key"
          value={generatedKey}
          onChange={(e) => setGeneratedKey(e.target.value)}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setGeneratedKey(generatedKey)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Fetch Workouts
          </button>
        </div>
      </div>

      {/* Display Charts */}
      <div className="space-y-6 border rounded-xl p-6">
        <h2 className="text-2xl font-semibold">Workout Trend Analysis</h2>
        {renderWorkoutPlanChart()}
      </div>

      <div className="space-y-6 mt-12 bg-white border rounded-xl p-6">
        <h2 className="text-2xl font-semibold ">Workout Type Distribution</h2>
        {renderPieChart()}
      </div>

      {/* Add New Workout Form */}
{showAddWorkout && (
  <div className="fixed inset-0 flex items-center justify-center ">
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
      {/* Close Button */}
      <button id="bckk"
        onClick={() => setShowAddWorkout(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
        <span>Back</span>
      </button>

      <h2 className="text-xl font-semibold mb-4">Add New Workout</h2>
      <form onSubmit={handleAddWorkout} className="space-y-4">
        {/* Workout Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Workout Type</label>
          <select
            className="w-full p-2 border rounded"
            value={newWorkout.type}
            onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
          >
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Swimming">Swimming</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        {/* Common Fields: Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">Duration (mins)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={newWorkout.duration}
            onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
          />
        </div>

        {/* Conditional Fields Based on Workout Type */}
        {newWorkout.type !== "Strength Training" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Distance (km)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newWorkout.distance}
                onChange={(e) => setNewWorkout({ ...newWorkout, distance: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Calories Burned</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newWorkout.calories}
                onChange={(e) => setNewWorkout({ ...newWorkout, calories: e.target.value })}
              />
            </div>
          </>
        )}

        {newWorkout.type === "Strength Training" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newWorkout.weight}
                onChange={(e) => setNewWorkout({ ...newWorkout, weight: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reps</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newWorkout.reps}
                onChange={(e) => setNewWorkout({ ...newWorkout, reps: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sets</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newWorkout.sets}
                onChange={(e) => setNewWorkout({ ...newWorkout, sets: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Workout
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default FitnessTrackingPage;
