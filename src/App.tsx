import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.css';

export const App = () => {
  const [] = useState();

  return <></>;
};

const root = document.getElementById('root');

createRoot(root!).render(<App />);
