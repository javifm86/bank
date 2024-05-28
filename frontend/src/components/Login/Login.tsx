import React, { useState } from 'react';
import postLogin from '../../api/login';
import Spinner from '../Spinner/Spinner';
import Alert from '../Alert/Alert';
import Button from '../Button/Button';
import Input from '../Input/Input';

interface Props {
  onLogin: (token: string) => void;
}

function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [errorLogin, setErrorLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const { data, error } = await postLogin({ username, password });

    setErrorLogin(error);
    setIsLoading(false);

    if (data?.token) {
      onLogin(data.token);
    }
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center min-h-full overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="user"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            User
          </label>
          <Input
            type="text"
            id="user"
            required
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Password
          </label>
          <Input
            type="password"
            id="password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <Button buttonType="primary" type="submit" className="w-full mb-6">
          Sign in
        </Button>
        {errorLogin && <Alert message="The provided credentials don't exist" />}
      </form>
      {isLoading && <Spinner loadingMessage="Logging in" show={true} />}
    </main>
  );
}

export default Login;
