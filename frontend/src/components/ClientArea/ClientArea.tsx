import { useEffect, useState } from 'react';
import MovementsTable from '../Movements/Movements';
import {
  getMovements,
  postMovements,
  GetMovementsResponse,
} from '../../api/movements';
import Spinner from '../Spinner/Spinner';

function ClientArea() {
  const [movements, setMovements] = useState<GetMovementsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [amount, setAmount] = useState('');
  const [errorMovement, setErrorMovement] = useState(false);

  function handleWithdraw() {
    updateMovements('withdraw');
  }

  function handleDeposit() {
    updateMovements('deposit');
  }

  async function updateMovements(type: 'withdraw' | 'deposit') {
    if (amount === '') {
      return;
    }

    setIsLoading(true);
    const { error } = await postMovements({
      amount: Number(amount),
      type,
    });
    setErrorMovement(error);
    setIsLoading(false);

    if (!error) {
      fetchMovements();
    }
  }

  async function fetchMovements() {
    setIsLoading(true);
    const { data, error } = await getMovements();
    setError(error);

    if (data) {
      setMovements(data);
    }

    setIsLoading(false);
  }

  useEffect(function () {
    fetchMovements();
  }, []);

  return (
    <main className="max-w-5xl mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-4xl font-bold mb-12">Movements</header>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="number"
          id="amount"
          className="appearance-none text-slate-900 bg-white rounded-md block px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
          required
          value={amount}
          onChange={(event) => {
            const integerAmount = parseInt(event.target.value, 10);
            setAmount(String(integerAmount));
          }}
        />
        <button
          type="button"
          className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700"
          onClick={handleDeposit}
        >
          Deposit
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-white text-slate-900 hover:bg-slate-50 border border-slate-900"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
        {errorMovement && (
          <div className="text-red-600">Error actualizando movimiento</div>
        )}
      </div>
      {movements !== null && <MovementsTable movements={movements} />}
      {isLoading && <Spinner loadingMessage="Loading" show={true} />}
      {error && (
        <div className="px-6 py-4 bg-red-100 text-red-700">
          <span className="font-bold">Error: </span> User movements could not be
          loaded
        </div>
      )}
    </main>
  );
}

export default ClientArea;
