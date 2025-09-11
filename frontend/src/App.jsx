import { useState } from 'react';
import { Star } from "lucide-react";
import AnimatedList from './components/AnimatedList';
import SpotlightCard from './components/SpotlightCard';
import Silk from './components/Silk';

function raand(opacity = 0.15) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r},${g},${b},${opacity})`;
}

function Que({ q }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <SpotlightCard spotlightColor={raand()}>
      <div className="w-full break-words text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4 md:mb-5 text-center sm:text-left">
        {q}
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hover || rating);
          return (
            <Star
              key={star}
              size={24} // fixed small size for mobile
              className={`cursor-pointer transition-transform duration-200 
          ${filled ? "text-yellow-400 fill-yellow-400 drop-shadow-lg" : "text-gray-300"} 
          hover:scale-125`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          );
        })}
      </div>


      {rating > 0 && (
        <div className="mt-2 text-sm sm:text-base text-gray-300 text-center sm:text-left">
          You rated this <span className="text-yellow-400 font-medium">{rating} / 5</span>
        </div>
      )}
    </SpotlightCard>
  );
}

function Hero() {
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      <div
        className="absolute text-white font-extrabold text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-center px-4 flex flex-col justify-center"
        style={{
          zIndex: 10,
          textShadow: '2px 2px 15px rgba(255,255,255,0.4)',
          letterSpacing: '0.05em',
        }}
      >
        <img src="/SDC.png" alt="SDC logo" className='h-60 w-60 self-center mb-5' />
        Software Development Club
        <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'> ( Feedback Form )</h2>
      </div>

      <Silk
        speed={5}
        scale={1}
        color="#7B7481"
        noiseIntensity={1.5}
        rotation={0}
      />
    </div>
  );
}



function App() {
  const items = [
    "How clear was the explanation of the Coding domain?",
    "Did the Web Development session give you a good understanding of its scope?",
    "Was the role of BDAAC in SDC explained in an understandable way?",
    "How effectively did the PR team present their work and opportunities?",
    "Did the Design session help you see its importance in tech projects?",
    "How engaging was the Cybersecurity introduction?",
    "Did the AI/ML session spark your curiosity about the domain?",
    "Which domain’s presentation excited you the most overall?",
    "What improvements would you suggest for any of the domain sessions?",
    "Would you like follow-up workshops/resources for specific domains?",
  ];

  const items2 = items.map((q, i) => <Que key={i} q={q} />);

  return (
    <>
      <Hero />
      <h1 className="text-center bg-black text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 pt-8 sm:pt-12 md:pt-16">
        Feedback Form
      </h1>

      <div className="min-h-screen bg-black pt-8 sm:pt-12 md:pt-20">
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto space-y-4">
          <AnimatedList showGradients={false} displayScrollbar={false} items={items2} />
        </div>
      </div></>
  );
}


export default App;
