import { render, screen } from '@testing-library/react';
import Movements from '../Movements';

describe('Movements', () => {
  it('should render movements', () => {
    const mockMovements: Movements[] = [
      {
        date: '2022-01-01',
        type: 'deposit',
        amount: 100,
        balance: 100,
      },
      {
        date: '2022-01-02',
        type: 'withdraw',
        amount: 50,
        balance: 50,
      },
    ];
    const { asFragment } = render(<Movements movements={mockMovements} />);
    const rows = screen.getAllByRole('row');

    expect(asFragment()).toMatchSnapshot();

    // Header + 2 movements
    expect(rows.length).toBe(3);
  });
});
