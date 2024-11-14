import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, PlayCircle, PauseCircle } from 'lucide-react';
import exercisesData from './excercises.json';

const ExploreExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTargetMuscle, setFilterTargetMuscle] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewModal, setViewModal] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const filteredExercises = useMemo(() => {
    return exercisesData.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || exercise.category === filterCategory) &&
      (filterDifficulty === '' || exercise.difficulty === filterDifficulty) &&
      (filterTargetMuscle === '' || exercise.targetMuscles.includes(filterTargetMuscle))
    ).sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchTerm, filterCategory, filterDifficulty, filterTargetMuscle, sortBy, sortDirection]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleViewModal = (exercise) => {
    setViewModal(exercise);
  };

  const handleCloseModal = () => {
    setViewModal(null);
  };

  const handlePlayVideo = (exercise) => {
    setPlayingVideo(exercise.id);
  };

  const handlePauseVideo = () => {
    setPlayingVideo(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Explore Exercises</h1>

      <div className="mb-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
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
    {[...new Set(exercisesData.map(exercise => exercise.category))].map((category, index) => (
      <option key={index} value={category}>{category}</option>
    ))}
  </select>

  <select
    value={filterDifficulty}
    onChange={(e) => setFilterDifficulty(e.target.value)}
    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">All Difficulties</option>
    {[...new Set(exercisesData.map(exercise => exercise.difficulty))].map((difficulty, index) => (
      <option key={index} value={difficulty}>{difficulty}</option>
    ))}
  </select>

  <select
    value={filterTargetMuscle}
    onChange={(e) => setFilterTargetMuscle(e.target.value)}
    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">All Target Muscles</option>
    {[...new Set(exercisesData.flatMap(exercise => exercise.targetMuscles))].map((muscle, index) => (
      <option key={index} value={muscle}>{muscle}</option>
    ))}
  </select>

  <div className="relative">
    <button
      onClick={() => handleSortChange('name')}
      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
    >
      <span>Sort by</span>
      <ChevronDown
        className={`transform transition-transform duration-300 ${sortBy === 'name' ? (sortDirection === 'asc' ? 'rotate-180' : 'rotate-0') : 'rotate-0'}`}
      />
    </button>
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-300 cursor-pointer"
            onClick={() => handleViewModal(exercise)}
          >
            <div className="relative">
              {exercise.videoUrl && (
                <div className="absolute top-2 right-2 z-10">
                  {playingVideo === exercise.id ? (
                    <PauseCircle
                      className="text-white hover:text-gray-300 transition-colors duration-300"
                      size={32}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePauseVideo();
                      }}
                    />
                  ) : (
                    <PlayCircle
                      className="text-white hover:text-gray-300 transition-colors duration-300"
                      size={32}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo(exercise);
                      }}
                    />
                  )}
                </div>
              )}
              {exercise.imageUrl ? (
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="rounded-t-lg w-full h-48 object-cover"
                />
              ) : (
                <div className="rounded-t-lg w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold">
                  {exercise.name[0]}
                </div>
              )}
            </div>
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
              <p className="text-gray-600 mb-1">Category: {exercise.category}</p>
              <p className="text-gray-600 mb-1">Difficulty: {exercise.difficulty}</p>
              <p className="text-gray-600">Target Muscles: {exercise.targetMuscles.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>

      {viewModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto max-h-[90%] grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Left Section - Video and Image */}
      <div className="flex flex-col justify-normal items-start">
        {/* Display video if available */}
        {viewModal.videoUrl ? (
          <video
            src={viewModal.videoUrl}
            controls
            className="w-full h-auto rounded-lg mb-4"
          />
        ) : (
          <img
            src={viewModal.imageUrl}
            alt={viewModal.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        {/* Image below the video (if available) */}
        {viewModal.imageUrl ? (
          <img
            src={viewModal.imageUrl}
            alt="Additional visual"
            className="w-full h-64 object-cover rounded-lg mt-4"
          />
        ) : (
          <p className="text-gray-500 mt-4">No additional image available</p>
        )}
      </div>

      {/* Right Section - Exercise Details */}
      <div className="flex flex-col justify-start">
        <h2 className="text-2xl font-bold mb-4">{viewModal.name}</h2>
        <p className="text-gray-600 mb-2">Category: {viewModal.category}</p>
        <p className="text-gray-600 mb-2">Difficulty: {viewModal.difficulty}</p>
        <p className="text-gray-600 mb-4">Target Muscles: {viewModal.targetMuscles.join(', ')}</p>
        <p className="mb-4">{viewModal.description}</p>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Benefits</h3>
          <ul className="list-disc pl-6">
            {viewModal.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600">{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Modifications</h3>
          <ul className="list-disc pl-6">
            {viewModal.modifications.map((mod, index) => (
              <li key={index} className="text-gray-600">{mod}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Steps</h3>
          <ol className="list-decimal pl-6">
            {viewModal.steps.map((step, index) => (
              <li key={index} className="text-gray-600">{step}</li>
            ))}
          </ol>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Common Mistakes</h3>
          <ul className="list-disc pl-6">
            {viewModal.commonMistakes.map((mistake, index) => (
              <li key={index} className="text-gray-600">{mistake}</li>
            ))}
          </ul>
        </div>

        {/* Close Button */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ExploreExercisesPage;
