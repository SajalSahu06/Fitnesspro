import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Home, Dumbbell, Users, MessageCircle, Menu, X } from 'lucide-react';
import './homepage.css';
import GetKey from '../components/GetKey';


// Import components
import CommunityPage from './CommunityPage';
import ExploreExercisesPage from './ExploreExercisesPage';
import AiChatPage from './AiChatPage';
import FitnessPlanForm from '../components/FitnessPlanForm';
import FitnessTrackingPage from './FitnessTrackingPage';  
import LoginPage from '../components/LoginPage';

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
           <GetKey/>
          </div>

          <div className="px-4 py-2 border-t border-blue-700">
            <p className="text-sm text-gray-200">© 2024 FitnessPro</p>
          </div>
        </nav>

        {/* Main content */}
<div className="flex-1 flex flex-col overflow-auto">
<main 
  className="flex-1 overflow-x-hidden overflow-y-auto bg-cover bg-center"
  
>
    <div className="container mx-auto">
      <Routes>
        <Route path="/" element={
          <div className="space-y-12 py-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 px-4">
              <h1 className="text-5xl font-bold text-gray-800">Welcome to FitnessPro</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your all-in-one fitness companion for personalized workouts, expert guidance, and a supportive community.
                Transform your fitness journey with AI-powered plans and real-time tracking.
              </p>
              <div className="flex justify-center gap-4">
              <button id="explore-button">
    <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="css-i6dzq1"
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg> Explore me
</button>

                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            {/* Stats Section */}
<div
  className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
  ref={(el) => {
    if (el) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const counters = el.querySelectorAll('.stat-value');
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute('data-target'), 10);
              let start = 0;
              const increment = target / 100; // Adjust speed here
              const updateCounter = () => {
                start += increment;
                if (start >= target) {
                  counter.textContent = target + counter.getAttribute('data-suffix');
                } else {
                  counter.textContent = Math.ceil(start) + counter.getAttribute('data-suffix');
                  requestAnimationFrame(updateCounter);
                }
              };
              updateCounter();
            });
            observer.disconnect(); // Stop observing once triggered
          }
        },
        { threshold: 0.5 } // Trigger when 50% visible
      );
      observer.observe(el);
    }
  }}
>
  <div className="bg-white p-6 rounded-xl shadow-sm text-center">
    <div
      className="text-4xl font-bold text-blue-600 mb-2 stat-value"
      data-target="1000"
      data-suffix="+"
    >
      0+
    </div>
    <div className="text-gray-600">Active Users</div>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-sm text-center">
    <div
      className="text-4xl font-bold text-blue-600 mb-2 stat-value"
      data-target="100"
      data-suffix="+"
    >
      0+
    </div>
    <div className="text-gray-600">Workout Plans</div>
  </div>
  <div className="bg-white p-6 rounded-xl shadow-sm text-center">
    <div
      className="text-4xl font-bold text-blue-600 mb-2 stat-value"
      data-target="98"
      data-suffix="%"
    >
      0%
    </div>
    <div className="text-gray-600">Success Rate</div>
  </div>
</div>



           {/* Our Services Section */}
<div className="our-services space-y-12 px-8 py-16 bg-gray-50">
  <div className="text-center space-y-4">
    <h2 className="text-4xl font-bold text-gray-800">Our Services</h2>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Explore our comprehensive range of fitness services crafted to guide you on your health and wellness journey.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Service Cards */}
    <div className="bg-white rounded-2xl shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Dumbbell className="text-blue-600" size={28} />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 text-center">Personalized Fitness Plans</h3>
      <p className="text-gray-600 text-center mt-4">
        AI-powered workout plans tailored to your goals, fitness level, and schedule.
      </p>
      <Link
        to="/fitness-plan"
        className="mt-6 block text-center text-blue-600 hover:underline text-lg"
      >
        Learn more →
      </Link>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Users className="text-blue-600" size={28} />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 text-center">Community Support</h3>
      <p className="text-gray-600 text-center mt-4">
        Connect with like-minded fitness enthusiasts, share progress, and stay motivated.
      </p>
      <Link
        to="/community"
        className="mt-6 block text-center text-blue-600 hover:underline text-lg"
      >
        Learn more →
      </Link>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageCircle className="text-blue-600" size={28} />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 text-center">AI Fitness Coach</h3>
      <p className="text-gray-600 text-center mt-4">
        24/7 access to AI-powered coaching for instant feedback and guidance.
      </p>
      <Link
        to="/ai-chat"
        className="mt-6 block text-center text-blue-600 hover:underline text-lg"
      >
        Learn more →
      </Link>
    </div>
  </div>
</div>
            {/* Features Grid */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mx-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Quick Access</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
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

            {/* Call to Action */}
            <div className="bg-blue-600 text-white rounded-2xl p-12 mx-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already transformed their lives with FitnessPro.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Get Started Now
              </button>
            </div>
          </div>
        } />
        <Route path="/fitness-plan" element={<FitnessPlanForm />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/explore" element={<ExploreExercisesPage />} />
        <Route path="/ai-chat" element={<AiChatPage />} />
        <Route path="/fitness-tracking" element={<FitnessTrackingPage />} />
        <Route path="/login" element={<LoginPage/>} /> {/* Add login page route */}
      </Routes>
    </div>
  </main>
</div>
      </div>
    </Router>
  );
};

export default HomePage;
