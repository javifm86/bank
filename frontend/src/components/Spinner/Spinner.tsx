import { FunctionComponent } from "react";
import { FocusScope } from "@react-aria/focus";
import "./index.css";

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
          <div className="loading-spinner">{loadingMessage}</div>
        </>
      )}
    </>
  );
};

export default Spinner;
