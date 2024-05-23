import { useState } from 'react';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Handle form submission here
    console.log(`Username: ${userName}, Password: ${password}`);
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
          <input
            type="text"
            id="user"
            className="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
            required
            value={userName}
            onChange={(event) => {
              setUserName(event.target.value);
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
          <input
            type="password"
            id="password"
            className="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 w-full"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}

export default Login;
