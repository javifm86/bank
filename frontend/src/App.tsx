import { useState } from 'react';
import Login from './components/Login/Login';
import ClientArea from './components/ClientArea/ClientArea';
import { setSessionToken } from './utils/http';

function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  function handleLogin(token: string) {
    setUserToken(token);
    setSessionToken(token);
  }

  return userToken === null ? <Login onLogin={handleLogin} /> : <ClientArea />;
}

export default App;
