import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import AddCardForm from './components/AddCardForm';
import type { Card } from './type/card';
import './style/index.css';
import './App.css';

export const App = () => {
  const [cardsList, setCardsList] = useState<Card[]>([]);

  const addCard = (newCard: Card) => {
    setCardsList([...cardsList, newCard]);
  };

  return (
    <div className="App">
      <div className="wrapper">
        <span className="heading">Создать карточку</span>
        <AddCardForm addCard={addCard} />
      </div>
    </div>
  );
};

const root = document.getElementById('root');

createRoot(root!).render(<App />);
