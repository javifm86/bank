import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Login from '../Login';
import postLogin from '../../../api/login';

jest.mock('../../../api/login');
jest.mock('../../Spinner/Spinner', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mockSpinner"></div>,
  };
});

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

const mockOnLogin = jest.fn();

describe('Login', () => {
  beforeEach(() => {
    render(<Login onLogin={mockOnLogin} />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render login form', () => {
    const userInput = screen.getByLabelText('User');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign in' });
    expect(userInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  it('should accept user input', async () => {
    const userInput = screen.getByLabelText('User');
    const passwordInput = screen.getByLabelText('Password');

    await act(async () => {
      await userEvent.type(userInput, 'user');
      await userEvent.type(passwordInput, 'test password');
    });

    expect(userInput).toHaveValue('user');
    expect(passwordInput).toHaveValue('test password');
  });

  it('should post login details when submitting the form', async () => {
    (postLogin as jest.Mock).mockResolvedValue({
      data: { token: 'test token' },
      error: false,
    });

    const userInput = screen.getByLabelText('User');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign in' });

    await userEvent.type(userInput, 'user');
    await userEvent.type(passwordInput, 'test password');
    await userEvent.click(signInButton);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).toBeInTheDocument();
    });

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    expect(postLogin).toHaveBeenCalledWith({
      username: 'user',
      password: 'test password',
    });
    expect(mockOnLogin).toHaveBeenCalledWith('test token');
  });

  it('should post login details when submitting the form and show error', async () => {
    (postLogin as jest.Mock).mockResolvedValue({
      data: null,
      error: true,
    });

    const userInput = screen.getByLabelText('User');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign in' });

    await userEvent.type(userInput, 'user');
    await userEvent.type(passwordInput, 'test password');
    await userEvent.click(signInButton);

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).toBeInTheDocument();
    });

    waitFor(() => {
      expect(screen.getByTestId('mockSpinner')).not.toBeInTheDocument();
    });

    expect(postLogin).toHaveBeenCalledWith({
      username: 'user',
      password: 'test password',
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(screen.getByTestId('mockAlertError')).toBeInTheDocument();
  });
});
