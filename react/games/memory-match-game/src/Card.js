import React from 'react';
import './Card.css';

function Card({ card, onClick, isFlipped, isMatched }) {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick(card);
    }
  };

  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched animate-match' : ''}`}
      onClick={handleClick}
    >
      <div className="card-content">
        <div className="card-front">?</div>
        <div className="card-back">{card}</div>
      </div>
    </div>
  );
}

export default Card;
