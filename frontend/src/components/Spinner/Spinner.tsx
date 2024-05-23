import { FunctionComponent } from 'react';
import { FocusScope } from '@react-aria/focus';
import './index.css';

interface SpinnerProps {
  show: boolean;
  messageToAnnounce?: string;
  loadingMessage: string;
}

const Spinner: FunctionComponent<SpinnerProps> = ({
  show,
  messageToAnnounce,
  loadingMessage,
}) => {
  return (
    <>
      {show && (
        <>
          <FocusScope contain restoreFocus autoFocus>
            <div
              className="visuallyHidden"
              aria-live="assertive"
              aria-atomic="true"
              tabIndex={0}
              data-testid="spinner__live-region"
              data-cy="globalSpinner"
            >
              {messageToAnnounce ?? loadingMessage}
            </div>
          </FocusScope>

          <div className="flex items-center justify-center fixed top-0 left-0 bottom-0 right-0 bg-white opacity-75 z-50">
            <div className="flex flex-col justify-center items-center">
              <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600 mb-6" />
              <div className="loading-spinner">{loadingMessage}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Spinner;
