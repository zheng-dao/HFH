import ApplicationForm from '../ApplicationForm';

export default function ApplicationMainColumn(props) {
  return (
    <div className={`main-column`}>
      <ApplicationForm {...props} />
    </div>
  );
}

ApplicationMainColumn.defaultProps = {
  currentTab: 1,
  application: {},
  updateApplication: () => {},
  saveApplication: () => {},
  setCurrentTab: () => {},
  shouldShowErrorMessagesFromSubmitValidation: false,
  setShouldShowErrorMessagesFromSubmitValidation: () => {},
  removeApplicationFromList: () => {},
  updateApplicationForGroup: () => {},
  fromGroupView: false,
};
