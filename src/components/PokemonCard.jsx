import './PokemonCard.css';

function PokemonCard({ name, image, isFavorite, onClick, onToggleFavorite }) {
  return (
    <div className="pokemon-card" onClick={onClick}>
      <img src={image} alt={name} className="pokemon-image" />
      <div className="pokemon-info">
        <h1 className="pokemon-name">{name}</h1>
        <button
          className="favorite-button"
          onClick={(e) => {
            e.stopPropagation(); // evitar que clic en corazón active onClick de la tarjeta
            onToggleFavorite();
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}

export default PokemonCard;
