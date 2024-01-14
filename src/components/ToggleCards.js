import React from 'react';

const ToggleCards = ({ activeCard, onCardToggle, logos }) => {
  const cards = ['polygon', 'arbitrum', 'bsc'];

  return (
    <div className="flex items-center justify-center space-x-4 mb-4">
      {cards.map((card) => (
        <div
          key={card}
          onClick={() => onCardToggle(card)}
          className={`cursor-pointer flex items-center space-x-2 p-2 rounded-full ${
            activeCard === card ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'
          }`}
        >
          <img src={logos[card]} alt={`${card} Logo`} className="w-8 h-8" />
          <span>{card.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
};

export default ToggleCards;
