import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders the correct text', () => {
    const { getByText } = render(
      <Button buttonType="primary">Click me</Button>
    );
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button buttonType="primary" onClick={handleClick}>
        Click me
      </Button>
    );
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies primary styling when type is primary', () => {
    const { getByText } = render(
      <Button buttonType="primary">Click me</Button>
    );
    expect(getByText('Click me')).toHaveClass(
      'bg-slate-900 text-white hover:bg-slate-700'
    );
  });

  it('applies secondary styling when type is secondary', () => {
    const { getByText } = render(
      <Button buttonType="secondary">Click me</Button>
    );
    expect(getByText('Click me')).toHaveClass(
      'bg-white text-slate-900 hover:bg-slate-50 border border-slate-900'
    );
  });
});
