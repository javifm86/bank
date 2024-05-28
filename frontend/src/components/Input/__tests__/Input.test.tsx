import { render, screen } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  it('should have the correct className', () => {
    render(<Input className="test-class" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('test-class');
  });
});
