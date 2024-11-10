import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const exercisesData = [
  { id: 1, name: 'Push-ups', category: 'Strength', difficulty: 'Beginner', targetMuscle: 'Chest' },
  { id: 2, name: 'Squats', category: 'Strength', difficulty: 'Beginner', targetMuscle: 'Legs' },
  { id: 3, name: 'Plank', category: 'Core', difficulty: 'Intermediate', targetMuscle: 'Abs' },
  { id: 4, name: 'Burpees', category: 'Cardio', difficulty: 'Advanced', targetMuscle: 'Full Body' },
  { id: 5, name: 'Lunges', category: 'Strength', difficulty: 'Beginner', targetMuscle: 'Legs' },
];

const ExploreExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredExercises = exercisesData.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === '' || exercise.category === filterCategory)
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Explore Exercises</h1>
      
      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Strength">Strength</option>
          <option value="Cardio">Cardio</option>
          <option value="Core">Core</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-300">
            <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
            <p className="text-gray-600 mb-1">Category: {exercise.category}</p>
            <p className="text-gray-600 mb-1">Difficulty: {exercise.difficulty}</p>
            <p className="text-gray-600">Target Muscle: {exercise.targetMuscle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreExercisesPage;