import React from 'react';
import { Link } from 'react-router-dom';



const TutorialSection = ({ image, title, description, videoLink }) => (
  <div className="tutorial-section">
    <div className="image-column">
      <img src={image} alt={title} width={325} />
    </div>
    <div className="text-column">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={videoLink} target="_blank" rel="noopener noreferrer">Watch Video...</a>
    </div>
  </div>
);

const TutorialDetail = ({ title, instructions, gif }) => (
  <div className="tutorial-detail">
    <h2>{title}</h2>
    <div className="tutorial-content">
      <div className="instructions">
        {instructions.map((instruction, index) => (
          <p key={index}>{instruction}</p>
        ))}
      </div>
      <div className="gif-column">
        <img src={gif} alt={title} />
      </div>
    </div>
  </div>
);

const Tutorials = () => {
  return (
    <div className="tutorials">
      <div style={{backgroundColor: '#025246', padding: '10px'}}>
        <h2 style={{color: 'white', textAlign: 'center'}}>Tutorial</h2>
      </div>
      
      <div className="tutorial-overview">
        <h2>Have a look at these video tutorials</h2>
        <TutorialSection 
          image={imgDumbbell}
          title="Bicep Curls"
          description="Get armed with knowledge! Watch this bicep curl tutorial and unlock the secret to sleeve-busting strength!"
          videoLink="https://youtu.be/ykJmrZ5v0Oo"
        />
        <TutorialSection 
          image={imgSquats}
          title="Squats"
          description="Get lower, get stronger! Dive into this squat tutorial and unlock the power of a rock-solid foundation!"
          videoLink="https://youtu.be/YaXPRqUwItQ"
        />
        <TutorialSection 
          image={imgPushups}
          title="Pushups"
          description="Push your limits, pump up your power! Join us for this push-up tutorial and unleash your inner strength!"
          videoLink="https://youtu.be/IODxDxX7oi4"
        />
        <TutorialSection 
          image={imgShoulder}
          title="Shoulder press"
          description="Elevate your strength, shoulder to shoulder! Don't miss this shoulder press tutorial to reach new heights of power!"
          videoLink="https://youtu.be/qEwKCR5JCog"
        />
      </div>

      <TutorialDetail 
        title="Bicep Curls"
        instructions={[
          "Stand up straight with a dumbbell in each hand. Keep your elbows close to your torso and rotate the palms of your hands until they are facing forward. This will be your starting position.",
          "Now, keeping the upper arms stationary, exhale and curl the weights while contracting your biceps.",
          "Continue to raise the weights until your biceps are fully contracted and the dumbbells are at shoulder level.",
          "Hold the contracted position for a brief pause as you squeeze your biceps.",
          "Then, inhale and slowly begin to lower the dumbbells back to the starting position.",
          "Remember, it's important to use appropriate weight for your fitness level and gradually increase the resistance as you get stronger."
        ]}
        gif={gifBicep}
      />

      <TutorialDetail 
        title="Squats"
        instructions={[
          "Stand with your feet slightly wider than shoulder-width apart, toes pointing slightly outward. You can also experiment with different foot positions to find what's most comfortable for you.",
          "Engage your core muscles by pulling your belly button in towards your spine. Keep your back straight and maintain good posture throughout the exercise.",
          "Begin the squat by bending your knees and pushing your hips back, as if you're sitting back into a chair. Make sure to keep your weight on your heels and your knees tracking in line with your toes.",
          "Lower your body down until your thighs are parallel to the ground. If you have the flexibility and mobility, you can go lower, but it's important to maintain proper form throughout the movement.",
          "Pause for a moment at the bottom of the squat, and then begin to push through your heels and straighten your legs to return to the starting position. Keep your core engaged and maintain control of the movement.",
          "As you come back up, avoid locking your knees at the top. Maintain a slight bend in your knees to keep tension on the muscles and avoid unnecessary strain.",
          "Repeat the squat for your desired number of repetitions. Start with a weight or bodyweight that allows you to maintain proper form, and gradually increase the difficulty as you become more comfortable and stronger.",
          "Additional tips: Keep your chest up and your gaze forward throughout the exercise. Avoid rounding your back or looking down. Exhale as you push up from the squat and inhale as you lower down. Breathing properly helps stabilize your core and maintain control.",
          "Remember, it's important to listen to your body and start with a weight or intensity level that is appropriate for your fitness level. Gradually progress as you gain strength and confidence in your squatting technique."
        ]}
        gif={gifSquats}
      />

      <TutorialDetail 
        title="Pushups"
        instructions={[
          "Start in a high plank position with your palms flat on the floor, hands shoulder-width apart, shoulders stacked directly above your wrists, legs extended behind you, and your core and glutes engaged.",
          "Bend your elbows and begin to lower your body down to the floor. When your chest grazes it, extend your elbows and return to the start. Focus on keeping your elbows close to your body during the movement.",
          "Complete as many reps as you can with good form. If you can't perform at least 3–5 reps, modify the movement by dropping to your knees or doing wall push-ups.",
          "Remember, it's important to listen to your body and start with a weight or intensity level that is appropriate for your fitness level. Gradually progress as you gain strength and confidence in your pushup technique."
        ]}
        gif={gifPushups}
      />

      <TutorialDetail 
        title="Shoulder press"
        instructions={[
          "Stand with your feet shoulder-width apart and hold a dumbbell in each hand. Raise the dumbbells to your shoulders, palms facing forward. This is your starting position.",
          "Press the weights upward until your arms are fully extended overhead. Keep your head and neck stationary.",
          "Pause at the top, then lower the weights back to the starting position.",
          "Remember, it's important to listen to your body and start with a weight or intensity level that is appropriate for your fitness level. Gradually progress as you gain strength and confidence in your shoulder press technique."
        ]}
        gif={gifShoulder}
      />
    </div>
  );
};

export default Tutorials;