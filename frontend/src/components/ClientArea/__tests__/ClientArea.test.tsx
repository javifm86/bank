import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ClientArea from '../ClientArea';
import MovementsTable from '../../Movements/Movements';
import { getMovements, postMovements } from '../../../api/movements';

jest.mock('../../../api/movements');

jest.mock('../../Spinner/Spinner', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mockSpinner"></div>,
  };
});

jest.mock('../../Alert/Alert', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mockAlertError"></div>,
  };
});

jest.mock('../../Movements/Movements', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('ClientArea', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render properly', () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    render(<ClientArea />);
    const moneyInput = screen.getByLabelText('Money');
    const depositButton = screen.getByRole('button', { name: 'Deposit' });
    const withdrawButton = screen.getByRole('button', { name: 'Withdraw' });

    expect(screen.getByTestId('mockSpinner')).toBeInTheDocument();
    expect(moneyInput).toBeInTheDocument();
    expect(depositButton).toBeInTheDocument();
    expect(withdrawButton).toBeInTheDocument();

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });
  });

  it('should load movements on load', () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    render(<ClientArea />);

    expect(screen.getByTestId('mockSpinner')).toBeInTheDocument();
    expect(getMovements).toHaveBeenCalledTimes(1);
    expect(MovementsTable).toHaveBeenCalledWith({ movements: [] }, {});

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });
  });

  it('should accept user input on money field', async () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    render(<ClientArea />);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    const inputElement = screen.getByLabelText('Money');
    await userEvent.type(inputElement, '1000');

    expect(inputElement).toHaveValue(1000);
  });

  it('should show alert error if movements load fails', () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: null,
      error: true,
    });

    render(<ClientArea />);

    expect(screen.getByTestId('mockSpinner')).toBeInTheDocument();
    expect(getMovements).toHaveBeenCalledTimes(1);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    waitFor(() => {
      expect(screen.getByTestId('mockAlertError')).toBeInTheDocument();
    });
  });

  it('should invoke postMovements when input has value and click on Deposit', async () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    (postMovements as jest.Mock).mockResolvedValue({
      error: false,
    });

    render(<ClientArea />);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    const inputElement = screen.getByLabelText('Money');
    await userEvent.type(inputElement, '1000');

    const depositButton = screen.getByRole('button', { name: 'Deposit' });
    await userEvent.click(depositButton);

    expect(postMovements).toHaveBeenCalledWith({
      amount: 1000,
      type: 'deposit',
    });

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    expect(getMovements).toHaveBeenCalledTimes(2);
  });

  it('should invoke postMovements when input has value and click on Withdraw', async () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    (postMovements as jest.Mock).mockResolvedValue({
      error: false,
    });

    render(<ClientArea />);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    const inputElement = screen.getByLabelText('Money');
    await userEvent.type(inputElement, '2000');

    const withdrawButton = screen.getByRole('button', { name: 'Withdraw' });
    await userEvent.click(withdrawButton);

    expect(postMovements).toHaveBeenCalledWith({
      amount: 2000,
      type: 'withdraw',
    });

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    expect(getMovements).toHaveBeenCalledTimes(2);
  });

  it('should invoke postMovements and show error message if petition fails', async () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    (postMovements as jest.Mock).mockResolvedValue({
      error: true,
    });

    render(<ClientArea />);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    const inputElement = screen.getByLabelText('Money');
    await userEvent.type(inputElement, '2000');

    const withdrawButton = screen.getByRole('button', { name: 'Withdraw' });
    await userEvent.click(withdrawButton);

    expect(postMovements).toHaveBeenCalledWith({
      amount: 2000,
      type: 'withdraw',
    });

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    expect(getMovements).toHaveBeenCalledTimes(1);

    waitFor(() => {
      expect(screen.getByTestId('errorUpdating')).toBeInTheDocument();
    });
  });

  it('should not invoke postMovements when input is empty and click on Deposit or Withdraw', async () => {
    (getMovements as jest.Mock).mockResolvedValue({
      data: [],
      error: false,
    });

    (postMovements as jest.Mock).mockResolvedValue({
      error: false,
    });

    render(<ClientArea />);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    const withdrawButton = screen.getByRole('button', { name: 'Withdraw' });
    await userEvent.click(withdrawButton);

    expect(postMovements).not.toHaveBeenCalled;
  });
});
