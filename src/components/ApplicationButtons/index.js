import classNames from 'classnames';
import useDialog from '@contexts/DialogContext';
import isApplicationEditable from '@utils/isApplicationEditable';

export default function ApplicationButtons(props) {
  const { setMessage } = useDialog();

  const prevClassName = classNames('prev-page', {
    inactive: props.currentTab == 1,
  });

  const nextClassName = classNames('next-page', {
    inactive: props.currentTab == props.maxPages,
  });

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

  const appControlClassNames = classNames('app-controls', {
    loading: props.shouldShowLoadingIndicator,
  });

  return (
    <div className={appControlClassNames}>
      <button
        className="save"
        onClick={handleSaveButton}
        disabled={!isApplicationEditable(props.application)}
      >
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
  );
}

ApplicationButtons.defaultProps = {
  canSave: true,
  currentTab: 1,
  maxPages: 4,
  setCurrentTab: () => {},
  shouldShowLoadingIndicator: false,
  application: null,
};
