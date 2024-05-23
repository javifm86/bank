import { useEffect, useState } from 'react';
import Spinner from './components/Spinner/Spinner';
import Login from './components/Login/Login';

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

  return !isLoggedIn ? (
    <Login />
  ) : (
    <>
      <span className="hello-world">Hello world</span>
      <Spinner loadingMessage="Loading..." show={showSpinner} />
    </>
  );
}

export default App;
