import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import pikachu from '../assets/pikachu.png';
import charmander from '../assets/charmander.png';
import Loader from '../components/Loader';

function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/pokemons');
    }, 2000); 
  };

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <div className="landing-container">
          <img src="src/assets/Logo.png" className="Logo" />

          <img src={charmander} alt="Charmander" className="charmander-image" />

          <div className="landing-content">
            <h1 className="landing-title">¡Bienvenido a Pokedex!</h1>
            <p className="landing-subtitle">
              Descubre, aprende y sorpréndete con el mundo de los Pokémon. <br/><br/>
              Explora cada criatura, conoce sus habilidades y encuentra tus favoritos.
            </p>
            <button className="start-button" onClick={handleStart}>
              START
            </button>
          </div>

          <img src={pikachu} alt="Pikachu waving" className="pikachu-image" />
        </div>
      )}
    </>
  );
}

export default Landing;


