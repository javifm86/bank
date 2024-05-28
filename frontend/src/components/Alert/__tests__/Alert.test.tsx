import { render, screen } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert', () => {
  it('should render alert message', () => {
    render(<Alert message="Test Alert" />);
    const alertElement = screen.getByText(/Test Alert/i);
    expect(alertElement).toBeInTheDocument();
  });
});
