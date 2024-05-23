// Added to use querySelector for searching inside external library elements
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import userEvent from '@testing-library/user-event';
import  { render, screen } from '@testing-library/react';
import Spinner from '../Spinner/Spinner';


describe('Spinner common component', () => {
  const MESSAGE = 'Loading content';
  const setup = (show: boolean) => {
    return render(<Spinner show={show} loadingMessage={MESSAGE} />);
  };

  test('should render correctly when prop show=false', () => {
    const { container } = setup(false);
    const liveRegionElement = screen.queryByTestId('spinner__live-region');

    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(liveRegionElement).not.toBeInTheDocument();
  });

  test('should render correctly when prop show=true', () => {
    const { container } = setup(true);
    const liveRegionElement = screen.getByTestId('spinner__live-region');

    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(liveRegionElement).toBeInTheDocument();
    expect(liveRegionElement).toHaveTextContent(MESSAGE);
    expect(liveRegionElement).toHaveFocus();
  });

  test('should trap focus avoiding interaction when showing', () => {
    setup(true);
    const liveRegionElement = screen.getByTestId('spinner__live-region');

    expect(liveRegionElement).toHaveFocus();
    userEvent.tab();
    expect(liveRegionElement).toHaveFocus();
  });
});
