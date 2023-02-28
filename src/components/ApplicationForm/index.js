import ApplicationFormPage1 from './Page1';
import ApplicationFormPage2 from './Page2';
import ApplicationFormPage3 from './Page3';
import ApplicationFormPage4 from './Page4';
import ApplicationButtons from '@components/ApplicationButtons';
import { Fragment } from 'react';
import classNames from 'classnames';

export default function ApplicationForm(props) {
  let output = '';

  switch (props.currentTab) {
    case 1:
      output = (
        <div>
          <ApplicationFormPage1
            currentTab={props.currentTab}
            application={props.application}
            updateApplication={props.updateApplication}
            saveApplication={props.saveApplication}
            shouldShowErrorMessagesFromSubmitValidation={
              props.shouldShowErrorMessagesFromSubmitValidation
            }
            setShouldShowErrorMessagesFromSubmitValidation={
              props.setShouldShowErrorMessagesFromSubmitValidation
            }
            updateApplicationForGroup={props.updateApplicationForGroup}
          />
        </div>
      );
      break;

    case 2:
      output = (
        <div>
          <ApplicationFormPage2
            currentTab={props.currentTab}
            application={props.application}
            updateApplication={props.updateApplication}
            saveApplication={props.saveApplication}
            shouldShowErrorMessagesFromSubmitValidation={
              props.shouldShowErrorMessagesFromSubmitValidation
            }
            setShouldShowErrorMessagesFromSubmitValidation={
              props.setShouldShowErrorMessagesFromSubmitValidation
            }
            updateApplicationForGroup={props.updateApplicationForGroup}
          />
        </div>
      );
      break;

    case 3:
      output = (
        <div>
          <ApplicationFormPage3
            currentTab={props.currentTab}
            application={props.application}
            updateApplication={props.updateApplication}
            saveApplication={props.saveApplication}
            shouldShowErrorMessagesFromSubmitValidation={
              props.shouldShowErrorMessagesFromSubmitValidation
            }
            setShouldShowErrorMessagesFromSubmitValidation={
              props.setShouldShowErrorMessagesFromSubmitValidation
            }
            updateApplicationForGroup={props.updateApplicationForGroup}
          />
        </div>
      );
      break;

    case 4:
      return (
        <ApplicationFormPage4
          currentTab={props.currentTab}
          application={props.application}
          updateApplication={props.updateApplication}
          saveApplication={props.saveApplication}
          shouldShowErrorMessagesFromSubmitValidation={
            props.shouldShowErrorMessagesFromSubmitValidation
          }
          setShouldShowErrorMessagesFromSubmitValidation={
            props.setShouldShowErrorMessagesFromSubmitValidation
          }
          removeApplicationFromList={props.removeApplicationFromList}
          shouldShowLoadingIndicator={props.shouldShowLoadingIndicator}
          fromGroupView={props.fromGroupView}
        />
      );
  }

  const appPaneClassNames = classNames('primary', 'app-pane', {
    loading: props.shouldShowLoadingIndicator,
  });
  
  return (
    <Fragment>
      <div className={appPaneClassNames}>
        <form role="form">{output}</form>
      </div>
      {props.currentTab < 4 && (
        <ApplicationButtons
          currentTab={props.currentTab}
          setCurrentTab={props.setCurrentTab}
          shouldShowLoadingIndicator={props.shouldShowLoadingIndicator}
          application={props.application}
        />
      )}
    </Fragment>
  );
}

ApplicationForm.defaultProps = {
  currentTab: 1,
  application: {},
  updateApplication: () => {},
  saveApplication: () => {},
  setCurrentTab: () => {},
  shouldShowLoadingIndicator: false,
  shouldShowErrorMessagesFromSubmitValidation: false,
  setShouldShowErrorMessagesFromSubmitValidation: () => {},
  removeApplicationFromList: () => {},
};
