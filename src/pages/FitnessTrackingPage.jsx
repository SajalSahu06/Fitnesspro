import React, { useState, useEffect } from 'react';
import { Plus, Trophy, TrendingUp, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FitnessTrackingPage = () => {
  // State for workouts and goals
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [goals, setGoals] = useState({
    weeklyWorkouts: 4,
    monthlyDistance: 50,
    caloriesBurnedDaily: 500
  });
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    type: 'Running',
    duration: '',
    distance: '',
    calories: '',
    weight: '',
    reps: '',
    sets: ''
  });

  useEffect(() => {
    // Load workouts from localStorage
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      const parsedWorkouts = JSON.parse(savedWorkouts);
      setWorkouts(parsedWorkouts);
      setSelectedWorkout(parsedWorkouts[0]);
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleAddWorkout = (e) => {
    e.preventDefault();
    const workout = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newWorkout
    };
    setWorkouts([workout, ...workouts]);
    setSelectedWorkout(workout);
    setShowAddWorkout(false);
    setNewWorkout({
      type: 'Running',
      duration: '',
      distance: '',
      calories: '',
      weight: '',
      reps: '',
      sets: ''
    });
  };  

  const calculateProgress = () => {
    const today = new Date();
    const thisWeek = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= new Date(today - 7 * 24 * 60 * 60 * 1000);
    });

    const thisMonth = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getMonth() === today.getMonth();
    });

    const weeklyWorkouts = thisWeek.length;
    const monthlyDistance = thisMonth.reduce((acc, curr) => acc + (Number(curr.distance) || 0), 0);
    const todaysCalories = workouts
      .filter(workout => workout.date === today.toISOString().split('T')[0])
      .reduce((acc, curr) => acc + (Number(curr.calories) || 0), 0);

    return {
      weeklyWorkouts: {
        current: weeklyWorkouts,
        goal: goals.weeklyWorkouts,
        percentage: (weeklyWorkouts / goals.weeklyWorkouts) * 100
      },
      monthlyDistance: {
        current: monthlyDistance,
        goal: goals.monthlyDistance,
        percentage: (monthlyDistance / goals.monthlyDistance) * 100
      },
      dailyCalories: {
        current: todaysCalories,
        goal: goals.caloriesBurnedDaily,
        percentage: (todaysCalories / goals.caloriesBurnedDaily) * 100
      }
    };
  };

  const renderProgressBar = (current, goal, label) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{`${current} / ${goal}`}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-600 rounded"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const getChartData = () => {
    return workouts.slice(0, 7).reverse().map(workout => ({
      date: workout.date,
      calories: Number(workout.calories) || 0,
      distance: Number(workout.distance) || 0,
      duration: Number(workout.duration) || 0
    }));
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Fitness Tracking</h1>
        <button
          onClick={() => setShowAddWorkout(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="mr-2" size={20} />
          Log Workout
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <Trophy className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Weekly Goals</h3>
          </div>
          {renderProgressBar(
            progress.weeklyWorkouts.current,
            progress.weeklyWorkouts.goal,
            'Workouts'
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <TrendingUp className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Monthly Distance</h3>
          </div>
          {renderProgressBar(
            progress.monthlyDistance.current,
            progress.monthlyDistance.goal,
            'Distance (km)'
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <Activity className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Daily Calories</h3>
          </div>
          {renderProgressBar(
            progress.dailyCalories.current,
            progress.dailyCalories.goal,
            'Calories'
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="calories"
                stroke="#8884d8"
                name="Calories Burned"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="distance"
                stroke="#82ca9d"
                name="Distance (km)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout History */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
        <div className="space-y-2">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedWorkout(workout)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{workout.type}</h4>
                  <p className="text-sm text-gray-600">{workout.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{workout.duration} mins</p>
                  {workout.distance && (
                    <p className="text-sm text-gray-600">{workout.distance} km</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Log New Workout</h2>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newWorkout.type}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, type: e.target.value })
                  }
                >
                  <option>Running</option>
                  <option>Cycling</option>
                  <option>Swimming</option>
                  <option>Strength Training</option>
                  <option>Yoga</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newWorkout.duration}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, duration: e.target.value })
                  }
                  required
                />
              </div>

              {(newWorkout.type === 'Running' || newWorkout.type === 'Cycling') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Distance (km)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={newWorkout.distance}
                    onChange={(e) =>
                      setNewWorkout({ ...newWorkout, distance: e.target.value })
                    }
                  />
                </div>
              )}

              {newWorkout.type === 'Strength Training' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={newWorkout.weight}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, weight: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sets</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={newWorkout.sets}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, sets: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reps</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={newWorkout.reps}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, reps: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Calories Burned</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newWorkout.calories}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, calories: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
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