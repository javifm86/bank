import { useEffect, useState } from 'react';
import MovementsTable from '../Movements/Movements';
import {
  getMovements,
  postMovements,
  GetMovementsResponse,
} from '../../api/movements';
import Spinner from '../Spinner/Spinner';
import Alert from '../Alert/Alert';
import Button from '../Button/Button';

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
      user: 'admin',
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
    const { data, error } = await getMovements({ user: 'admin' });

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
        <Button buttonType="primary" type="button" onClick={handleDeposit}>
          Deposit
        </Button>
        <Button buttonType="secondary" type="button" onClick={handleWithdraw}>
          Withdraw
        </Button>
        {errorMovement && (
          <div className="text-red-600">Error actualizando movimiento</div>
        )}
      </div>
      {movements !== null && <MovementsTable movements={movements} />}
      {isLoading && <Spinner loadingMessage="Loading" show={true} />}
      {error && <Alert message="User movements could not be loaded" />}
    </main>
  );
}

export default ClientArea;
