import { Fragment, useEffect, useState } from 'react';
import { STAYSTATUS } from '@src/API';
import Selectfield from '../Inputs/Selectfield';
import stayStatusOptions from '@utils/stayStatusOptions';

export default function RegressStayDialog(props) {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    setButtonDisabled(false);
  }, [props.currentStayStatus]);

  const closeDialog = (e) => {
    e.preventDefault();
    props.close();
  };

  const saveNewStatus = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    props.saveStayStatus();
  };

  const numberofAvailableStatus = Object.keys(
    stayStatusOptions(props.presentStayStatus, props.isException)
  ).length;

  return (
    <div className="dialog" id="regress-stay">
      <div className="dialog-box">
        <button className="close" onClick={closeDialog}>
          Close
        </button>
        <div className="dialog-content">
          <form>
            <h2>Regress Stay</h2>

            <p>
              Do you wish to regress the status of this stay to correct a mistake? If so, choose a
              status:
            </p>

            {numberofAvailableStatus > 0 && (
              <Fragment>
                <Selectfield
                  label="New Status"
                  options={stayStatusOptions(props.presentStayStatus, props.isException)}
                  blankValue={false}
                  inputValue={props.currentStayStatus}
                  inputOnChange={props.changeStayStatus}
                  shouldMapEnumValues={false}
                />
                <div className="dialog-controls">
                  <button className="cancel" onClick={closeDialog} disabled={buttonDisabled}>
                    Cancel
                  </button>
                  <button className="ok" onClick={saveNewStatus} disabled={buttonDisabled}>
                    Regress Stay
                  </button>
                </div>
              </Fragment>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

RegressStayDialog.defaultProps = {
  close: () => {},
  profile: {},
  isException: false,
  isExtendedStay: false,
};
