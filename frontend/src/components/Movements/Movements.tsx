interface Movements {
  date: string;
  type: 'withdraw' | 'deposit';
  amount: number;
  balance: number;
}

interface Props {
  movements: Movements[];
}

function Movements({ movements }: Props) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto">
      <div className="inline-block min-w-full shadow sm:rounded-lg border-b border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Date
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map(({ amount, balance, date, type }, index) => {
              const isDeposit = type === 'deposit';
              const sign = isDeposit ? '+' : '-';
              const cssAmount = isDeposit ? 'text-green-500' : 'text-red-500';
              const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <tr key={index}>
                  <td className="px-5 py-5 text-sm text-center">
                    {formattedDate}
                  </td>
                  <td className={`px-5 py-5 text-sm text-right ${cssAmount}`}>
                    {sign}
                    {currencyFormatter.format(amount)}
                  </td>
                  <td className="px-5 py-5 text-sm text-right">
                    {currencyFormatter.format(balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movements;
