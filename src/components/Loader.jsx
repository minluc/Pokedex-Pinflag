import { useEffect, useState } from 'react';
import './Loader.css';
import Pokeball from '../assets/Pokeball.png';

function Loader({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {

    const timeout = setTimeout(() => {
      setExiting(true);

      setTimeout(() => {
        if (onFinish) onFinish();
      }, 1000);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div className={`loading-screen ${exiting ? 'exit' : ''}`}>
      <div className="loading-content">
        <img
          src={Pokeball}
          alt="Loading Pokeball"
          className={`loading-pokeball ${exiting ? 'slide-out' : 'bounce-in'}`}
        />
      </div>
    </div>
  );
}

export default Loader;
