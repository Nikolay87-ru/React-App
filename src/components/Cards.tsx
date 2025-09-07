import { type FC } from 'react';
import type { Card } from '../type/card';
import './Cards.css';

interface CardsProps {
  cardsList: Card[];
  removeCard: (id: number) => void;
}

const Cards: FC<CardsProps> = ({ cardsList, removeCard }) => {
  return (
    <div className="cards-container">
      {cardsList.map((card) => (
        <div key={card.id} className="card">
          <img src={card.img} alt={card.title} className="card-image" />
          <div className="card-content">
            <h4 className="card-title">{card.title}</h4>
            <button onClick={() => removeCard(card.id)} className="delete-button">
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
