import React, { useState, useEffect } from 'react';
import Card from './Card';
import './GameBoard.css';

const initialCards = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  useEffect(() => {
    const shuffledCards = [...initialCards, ...initialCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards.map((card, index) => ({ id: index, value: card })));
  }, []);

  const handleCardClick = (card) => {
    if (flippedCards.length === 2) return;

    setFlippedCards((prev) => [...prev, card]);

    if (flippedCards.length === 1) {
      if (flippedCards[0].value === card.value && flippedCards[0].id !== card.id) {
        setMatchedCards((prev) => [...prev, flippedCards[0], card]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card.value}
          onClick={() => handleCardClick(card)}
          isFlipped={flippedCards.includes(card) || matchedCards.includes(card)}
          isMatched={matchedCards.includes(card)}
        />
      ))}
    </div>
  );
}

export default GameBoard;
