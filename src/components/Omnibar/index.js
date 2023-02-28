import withCompletionContext from '@contexts/CompletionContext';
import useApplicationContext from '@contexts/ApplicationContext';
import { tabs } from '@utils/tabNames';
import classNames from 'classnames';
import OmnibarLink from './Link';

export default function Omnibar(props) {
  const { tabOneStatus, tabTwoStatus, tabThreeStatus, tabFourStatus } = withCompletionContext();
  const {
    missingLiaisonFields,
    missingServiceMemberFields,
    missingPatientFields,
    missingLodgingFields,
  } = useApplicationContext();

  const omnibarClass = classNames('app-tabs', {
    loading: props.shouldShowLoadingIndicator,
  });

  return (
    <nav className="omnibar">
      <ul className={omnibarClass}>
        <OmnibarLink
          tab={1}
          currentTab={props.currentTab}
          changeTab={props.changeTab}
          isComplete={missingLiaisonFields().length == 0}
        />
        <OmnibarLink
          tab={2}
          currentTab={props.currentTab}
          changeTab={props.changeTab}
          isComplete={
            missingServiceMemberFields().length == 0 && missingPatientFields().length == 0
          }
        />
        <OmnibarLink
          tab={3}
          currentTab={props.currentTab}
          changeTab={props.changeTab}
          isComplete={missingLodgingFields().length == 0}
        />
        <OmnibarLink
          tab={4}
          currentTab={props.currentTab}
          changeTab={props.changeTab}
          isComplete={tabFourStatus}
        />
      </ul>
    </nav>
  );
}

Omnibar.defaultProps = {
  currentTab: 1,
  changeTab: () => {},
  shouldShowLoadingIndicator: false,
};
