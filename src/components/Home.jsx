import React from 'react';
import Lottie from 'react-lottie';

function Home() {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: require('../lotties/fitness.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Welcome to AI Fitness Trainer</h1>
        <p>Step into a fitter future: Welcome to your fitness revolution!</p>
        <h2>About us</h2>
        <p>
          We are thrilled to have you here on our platform dedicated to empowering and inspiring individuals on their journey towards a healthier and fitter lifestyle. Whether you're a seasoned fitness enthusiast or just starting your fitness journey, we have everything you need to reach your goals and achieve the best version of yourself.
        </p>
        <p>
          What sets us apart is the fact that we provide personalized assistance at the comfort of your home or any place of your choice at a price that is both convenient and much cheaper that traditional gyms.
        </p>
        <p>
          Let your fitness journey start here! Join us today and embark on a transformative experience that will enhance your physical and mental well-being. Let's build strength, resilience, and a healthier future together!
        </p>
      </div>
      <div className="lottie-animation">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>
    </div>
  );
}

export default Home;