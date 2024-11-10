import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Home, Dumbbell, Users, MessageCircle, Menu, X } from 'lucide-react';

// Import components
import CommunityPage from './CommunityPage';
import ExploreExercisesPage from './ExploreExercisesPage';
import AiChatPage from './AiChatPage';
import FitnessPlanForm from '../components/FitnessPlanForm';
import FitnessTrackingPage from './FitnessTrackingPage';

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/fitness-plan', icon: <Dumbbell size={20} />, label: 'Fitness Plan' },
    { path: '/community', icon: <Users size={20} />, label: 'Community' },
    { path: '/explore', icon: <Dumbbell size={20} />, label: 'Explore' },
    { path: '/ai-chat', icon: <MessageCircle size={20} />, label: 'AI Chat' },
    { path: '/fitness-tracking', icon: <MessageCircle size={20} />, label: 'Track Fitness' }
  ];

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile menu button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <nav className={`
          fixed lg:static inset-y-0 left-0 transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 bg-blue-600 text-white space-y-6 py-7 px-2
          flex flex-col h-full
          z-30
        `}>
          <div className="flex items-center justify-center px-4 mb-8">
            <h1 className="text-2xl font-bold">FitnessPro</h1>
          </div>

          <div className="flex flex-col flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-100 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-4">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-blue-700">
            <p className="text-sm text-gray-200">© 2024 FitnessPro</p>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="container mx-auto">
              <Routes>
                <Route path="/" element={
                  <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome to FitnessPro</h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {navItems.slice(1).map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {item.icon}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-700">{item.label}</h2>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                } />
                <Route path="/fitness-plan" element={<FitnessPlanForm />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/explore" element={<ExploreExercisesPage />} />
                <Route path="/ai-chat" element={<AiChatPage />} />
                <Route path="/fitness-tracking" element={<FitnessTrackingPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default HomePage;