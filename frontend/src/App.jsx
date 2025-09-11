import { useState } from 'react';
import { Star } from "lucide-react";
import AnimatedList from './components/AnimatedList';
import SpotlightCard from './components/SpotlightCard';
import Prism from './components/Prism';

function raand(opacity = 0.15) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r},${g},${b},${opacity})`;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function Que({ q, rating, setRating }) {
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
              size={24}
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

function OverallAverage({ value }) {
  return (
    <div className="flex flex-col items-center justify-center mt-8 mb-8 p-6 rounded-xl bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-400 shadow-2xl">
      <div className="text-3xl font-extrabold text-white mb-2">Overall Average Rating</div>
      <div className="text-6xl font-bold text-yellow-300 drop-shadow-lg">{value}</div>
      <div className="text-lg text-white mt-2">Thank you for your feedback! This is the current average rating from all users.</div>
    </div>
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

      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={4}
        noise={0.4}
        glow={1}
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

  let userId = getCookie('user_rating_id');
  let userName = getCookie('user_name');
  const [nameLoaded, setNameLoaded] = useState(!!userName);

  useEffect(() => {
    async function fetchNameAndSetCookie() {
      if (!userName) {
        const res = await fetch('https://randomuser.me/api/');
        const data = await res.json();
        const name = data.results[0].name.first + ' ' + data.results[0].name.last;
        setCookie('user_name', name, 365 * 2);
        userName = name;
        setNameLoaded(true);
      }
    }
    fetchNameAndSetCookie();
  }, []);

  if (!userId) {
    userId = generateUUID();
    setCookie('user_rating_id', userId, 365 * 2);
  }

  const [hasRated, setHasRated] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [overallAverage, setOverallAverage] = useState(null);
  const overallAverageRef = useRef(null);

  useEffect(() => {
    const checkAlreadyRated = async () => {
      try {
        const res = await fetch(`http://localhost:4000/check-rated?user_rating_id=${userId}`);
        const data = await res.json();
        if (data.hasRated) {
          setHasRated(true);
          setSubmitMessage("You have already rated.");
        }
      } catch (err) {}
    };
    checkAlreadyRated();
  }, [userId]);

  const [ratings, setRatings] = useState(Array(items.length).fill(0));

  const handleRatingChange = (index, value) => {
    setRatings(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const items2 = items.map((q, i) => <Que key={i} q={q} rating={ratings[i]} setRating={value => handleRatingChange(i, value)} />);

  const handleSubmit = async () => {
    if (!nameLoaded) return;
    const payload = {
      name: userName,
      ratings: ratings,
      average: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      user_rating_id: userId
    };
    try {
      const res = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.status === 403) {
        setHasRated(true);
        setSubmitMessage(data.message || "You have already rated.");
        if (data.SDCREVIEWVARIABLE !== undefined) {
          setOverallAverage(data.SDCREVIEWVARIABLE);
          setTimeout(() => {
            if (overallAverageRef.current) {
              overallAverageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1000);
        } else {
          const avgRes = await fetch("http://localhost:4000/overall-average");
          const avgData = await avgRes.json();
          setOverallAverage(avgData.overallAverage);
          setTimeout(() => {
            if (overallAverageRef.current) {
              overallAverageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1000);
        }
      } else if (res.ok) {
        setHasRated(true);
        setSubmitMessage(data.message || "Thank you for your feedback!");
        if (data.SDCREVIEWVARIABLE !== undefined) {
          setOverallAverage(data.SDCREVIEWVARIABLE);
          setTimeout(() => {
            if (overallAverageRef.current) {
              overallAverageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1000);
        }
      } else {
        setSubmitMessage("Error submitting review");
      }
    } catch (err) {
      setSubmitMessage("Error submitting review");
    }
  };

  return (
    <>
      <Hero />
      <h1 className="text-center bg-black text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 pt-8 sm:pt-12 md:pt-16">
        Feedback Form
      </h1>
      <div className="min-h-screen bg-black pt-8 sm:pt-12 md:pt-20">
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto space-y-4">
          {overallAverage !== null && <div ref={overallAverageRef}><OverallAverage value={overallAverage} /></div>}
          <AnimatedList showGradients={false} displayScrollbar={false} items={items2} />
          <Button variant="ghost" className="text-white mb-10 bg-gray-600" onClick={handleSubmit} disabled={hasRated || !nameLoaded}>Submit</Button>
          {submitMessage && (
            <div className="text-center text-lg text-yellow-400 font-semibold mt-4">{submitMessage}</div>
          )}
        </div>
      </div>
    </>
  );
}


export default App;
