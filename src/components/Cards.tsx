import { type FC } from 'react';
import type { Card } from '../type/card';

interface CardsProps {
  cardsList: Card[];
  removeCard: (id: number) => void;
}

const Cards: FC<CardsProps> = ({ cardsList, removeCard }) => {
  const gridClass = cardsList.length === 1 
    ? 'grid-cols-1' 
    : cardsList.length === 2 
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="w-full">
      <div className={`grid ${gridClass} gap-5 justify-center mt-5 max-w-full`}>
        {cardsList.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <img src={card.img} alt={card.title} className="w-full h-48 object-cover" />
            <div className="p-3.5">
              <h4 className="text-sm font-semibold text-gray-800 mb-2.5 break-words">
                {card.title}
              </h4>
              <button
                onClick={() => removeCard(card.id)}
                className="w-full py-2 bg-red-600 text-white border-none rounded text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
