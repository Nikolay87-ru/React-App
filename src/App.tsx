import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import AddCardForm from './components/AddCardForm';
import Cards from './components/Cards';
import type { Card } from './type/card';
import './style/index.css';

export const App = () => {
  const [cardsList, setCardsList] = useState<Card[]>([]);

  const addCard = (newCard: Card) => {
    setCardsList([...cardsList, newCard]);
  };

  const removeCard = (id: number) => {
    setCardsList(cardsList.filter((card) => card.id !== id));
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="max-w-[600px] mx-auto flex flex-col items-center bg-white w-full rounded-xl p-10 shadow-xl backdrop-blur-sm">
        <span className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-[#667eea] to-[#764ba2] uppercase text-center tracking-tight">
          Создать карточку
        </span>
        <AddCardForm addCard={addCard} />
        <Cards cardsList={cardsList} removeCard={removeCard} />
      </div>
    </div>
  );
};

const root = document.getElementById('root');
createRoot(root!).render(<App />);
