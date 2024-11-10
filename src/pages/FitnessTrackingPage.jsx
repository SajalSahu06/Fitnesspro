import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const FitnessTrackingPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    // Fetch workout data from an API or local storage
    const fetchedWorkouts = [
      { id: 1, date: '2023-04-01', type: 'Running', duration: 30, distance: 5, calories: 350 },
      { id: 2, date: '2023-04-03', type: 'Strength Training', duration: 45, weight: 150, reps: 12 },
      { id: 3, date: '2023-04-05', type: 'Cycling', duration: 60, distance: 15, calories: 500 },
      { id: 4, date: '2023-04-07', type: 'Yoga', duration: 60, calories: 200 },
    ];
    setWorkouts(fetchedWorkouts);
    setSelectedWorkout(fetchedWorkouts[0]);
  }, []);

  const handleWorkoutSelect = (workout) => {
    setSelectedWorkout(workout);
  };

  const renderWorkoutDetails = () => {
    if (!selectedWorkout) return null;

    const { date, type, duration, distance, weight, reps, calories } = selectedWorkout;

    return (
      <Card>
        <CardHeader title={`${type} Workout - ${date}`} />
        <CardContent>
          <Typography variant="body1">Duration: {duration} minutes</Typography>
          {type === 'Running' && <Typography variant="body1">Distance: {distance} km</Typography>}
          {type === 'Strength Training' && <Typography variant="body1">Weight: {weight} lbs, Reps: {reps}</Typography>}
          <Typography variant="body1">Calories Burned: {calories}</Typography>
        </CardContent>
      </Card>
    );
  };

  const renderWorkoutHistory = () => {
    return (
      <Card>
        <CardHeader title="Workout History" />
        <CardContent>
          <div className="flex flex-col space-y-2">
            {workouts.map((workout) => (
              <Button
                key={workout.id}
                variant={selectedWorkout?.id === workout.id ? 'contained' : 'outlined'}
                onClick={() => handleWorkoutSelect(workout)}
                fullWidth
              >
                {workout.date} - {workout.type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWorkoutChart = () => {
    if (!selectedWorkout) return null;

    const { type, duration, distance, calories } = selectedWorkout;
    const chartData = [
      { name: 'Duration', value: duration },
      { name: 'Distance', value: type === 'Running' ? distance : 0 },
      { name: 'Calories', value: calories },
    ];

    return (
      <Card>
        <CardHeader title="Workout Stats" />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Fitness Tracking
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderWorkoutDetails()}
        {renderWorkoutHistory()}
        {renderWorkoutChart()}
      </div>
    </div>
  );
};

export default FitnessTrackingPage;
