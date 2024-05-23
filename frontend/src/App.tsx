import { useEffect, useState } from 'react';
import Login from './components/Login/Login';

function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  function handleLogin(token: string) {
    setUserToken(token);
  }

  return userToken === null ? (
    <Login onLogin={handleLogin} />
  ) : (
    <>
      <span className="hello-world">Hello world</span>
    </>
  );
}

export default App;
