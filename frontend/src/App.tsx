import { useEffect, useState } from 'react';
import './App.css';
import Spinner from './components/Spinner/Spinner';

function App() {
  const [showSpinner, setShowSpinner] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpinner(false);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="bg-green-600">
      <span className="hello-world">Hello world</span>
      <Spinner loadingMessage="Loading..." show={showSpinner} />
    </main>
  );
}

export default App;
