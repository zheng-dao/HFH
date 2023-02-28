import useButtonWait from '@contexts/ButtonWaitContext';

export default function GroupChangeDialog(props) {
  const { isWaiting } = useButtonWait();

  const closeDialog = (e) => {
    e.preventDefault();
    props.cancel();
  };

  const applyChange = (e) => {
    e.preventDefault();
    props.applyChange();
    // Modal is closed in applyChange function.
  };

  const cancelChange = (e) => {
    e.preventDefault();
    props.cancel();
  };

  return (
    <div className="dialog">
      <div className="dialog-box">
        <button className="close" onClick={closeDialog} disabled={isWaiting}>
          Close
        </button>
        <div className="dialog-content">
          <form>
            <h2>Confirm Group Change</h2>
            {
              props.isAffiliationChange ? props.numberLiaisonAssigned === 0 ?
                <p>
                  This change will be made on {props.numberApplicationsImpacted} applications. Are you
                  sure you want to proceed?
                </p>
                :
                <p>
                  This change will be made on {props.numberApplicationsImpacted} applications. It will also change the liaison affiliation on {props.numberLiaisonAssigned} applications. Are you
                  sure you want to proceed?
                </p>
                :
                <p>
                  This change will be made on {props.numberApplicationsImpacted} applications. Are you
                  sure you want to proceed?
                </p>
            }

            {/* Placeholder text should be selected value */}
            <div className="dialog-controls">
              <button className="cancel" onClick={cancelChange} disabled={isWaiting}>
                No
              </button>
              <button className="ok" onClick={applyChange} disabled={isWaiting}>
                Yes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

GroupChangeDialog.defaultProps = {
  close: () => { },
  numberApplicationsImpacted: 1,
  applyChange: () => { },
  cancel: () => { },
};
