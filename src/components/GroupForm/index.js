import { Fragment } from 'react';
import GroupFormPage3 from './Page3';
import classNames from 'classnames';
import GroupFormPage2 from './Page2';
import GroupFormPage1 from './Page1';
import useDialog from '@contexts/DialogContext';

export default function GroupForm(props) {
  let output = '';

  const { setMessage } = useDialog();

  const incrementPage = () => {
    props.setCurrentTab(Math.min(props.currentTab + 1, props.maxPages));
  };

  const decrementPage = () => {
    props.setCurrentTab(Math.max(props.currentTab - 1, 1));
  };

  const handleSaveButton = (e) => {
    e.preventDefault();
    setMessage('Application data saved.');
  };

  const prevClassName = classNames('prev-page', {
    inactive: props.currentTab == 1,
  });

  const nextClassName = classNames('next-page', {
    inactive: props.currentTab == props.maxPages,
  });

  switch (props.currentTab) {
    case 1:
      output = (
        <div>
          <GroupFormPage1 {...props} />
        </div>
      );
      break;

    case 2:
      output = (
        <div>
          <GroupFormPage2 {...props} />
        </div>
      );
      break;

    case 3:
      output = (
        <div>
          <GroupFormPage3 {...props} />
        </div>
      );
      break;
  }

  const appPaneClassNames = classNames('primary', 'app-pane', 'group-actions', {
    loading: props.shouldShowLoadingIndicator,
  });

  const appControlsClassNames = classNames('app-controls', 'group-actions', {
    loading: props.shouldShowLoadingIndicator,
  });

  return (
    <Fragment>
      <div className={appPaneClassNames}>
        <form role="form">{output}</form>
      </div>
      {props.currentTab < 4 && (
        <div className={appControlsClassNames}>
          <button className="Save" onClick={handleSaveButton}>
            Save
          </button>

          <div className="pager">
            <button className={prevClassName} onClick={decrementPage}>
              <span>&laquo;</span> Prev<span>ious</span>
            </button>
            <button className={nextClassName} onClick={incrementPage}>
              Next <span>&raquo;</span>
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

GroupForm.defaultProps = {
  canSave: true,
  currentTab: 1,
  maxPages: 3,
  setCurrentTab: () => {},
  shouldShowLoadingIndicator: false,
};
