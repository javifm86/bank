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
import Input from '../Input/Input';

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

      <div className="flex items-end gap-2 mb-12">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Money
          </label>
          <Input
            type="number"
            id="amount"
            required
            value={amount}
            onChange={(event) => {
              const integerAmount = parseInt(event.target.value, 10);
              setAmount(String(integerAmount));
            }}
          />
        </div>
        <Button buttonType="primary" type="button" onClick={handleDeposit}>
          Deposit
        </Button>
        <Button buttonType="secondary" type="button" onClick={handleWithdraw}>
          Withdraw
        </Button>
        {errorMovement && (
          <div className="flex items-center h-10 text-red-600" data-testid="errorUpdating">
            <span>Error performing the movement</span>
          </div>
        )}
      </div>
      {movements !== null && <MovementsTable movements={movements} />}
      {isLoading && <Spinner loadingMessage="Loading" show={true} />}
      {error && <Alert message="User movements could not be loaded" />}
    </main>
  );
}

export default ClientArea;
