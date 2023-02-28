import withCompletionContext from '@contexts/CompletionContext';
import useApplicationContext from '@contexts/ApplicationContext';
import { tabs } from '@utils/tabNames';
import classNames from 'classnames';
import OmnibarLink from '../Omnibar/Link';
import PrevImage from '@public/img/prev.svg';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import humanName from '../../utils/humanName';

export default function GroupOmnibar(props) {
  const { tabOneStatus, tabTwoStatus, tabThreeStatus, tabFourStatus } = withCompletionContext();
  const {
    missingLiaisonFields,
    missingServiceMemberFields,
    missingPatientFields,
    missingLodgingFields,
  } = useApplicationContext();
  const SWITCH_APPLICATIONS_DELAY = 1000;

  const [groupAppsListVisible, setGroupAppsListVisible] = useState(false);
  const [groupNameInputValue, setGroupNameInputValue] = useState('');
  const [numberOfApplication, setNumberOfApplication] = useState();

  const groupAppsListOptionsClasses = classNames('group-apps', {
    hidden: !groupAppsListVisible,
  });

  const currentAppListClasses = classNames('current-app', {
    open: groupAppsListVisible,
  });

  const changeGroupAppsListVisible = () => {
    setGroupAppsListVisible(true);
    setGroupNameInputValue('');
  };

  const changeGroupAppsListInvisible = (e) => {
    setGroupAppsListVisible(false);
  };

  const toggleGroupAppsListVisible = () => {
    if (groupAppsListVisible) {
      changeGroupAppsListInvisible();
    } else {
      changeGroupAppsListVisible();
    }
  };

  const updateGroupNameInputValue = (e) => {
    if (groupAppsListVisible) {
      setGroupNameInputValue(e.target.value);
    }
  };

  const generateServiceMemberName = (item) => {
    if (typeof item === 'undefined') {
      return '';
    } else if (item?.ServiceMember) {
      if (
        item.ServiceMember.first_name ||
        item.ServiceMember.middle_initial ||
        item.ServiceMember.last_name
      ) {
        return humanName(item.ServiceMember);
      } else {
        return 'Unknown Service Member';
      }
    }
    return 'Unknown Service Member';
  };

  const getServiceMemberNameFromApplicationId = (id) => {
    if (id == props.groupwideActionsValue) {
      return id;
    }
    return generateServiceMemberName(props.applications.find((item) => item.id == id));
  };

  const inputValue = groupAppsListVisible
    ? groupNameInputValue
    : getServiceMemberNameFromApplicationId(props.groupNameValue);

  const updateSelectedGroupAction = (item) => {
    if (item !== props.groupwideActionsValue) {
      let index = props.applications.map((e) => e.id).indexOf(item);
      setNumberOfApplication(index + 1);
    }
    props.setGroupNameValue(item);
    setGroupAppsListVisible(false);
  };

  const nextAppInGroup = () => {
    if (props.applications.length > 0) {
      props.updateGroupLoading(true);
      if (props.groupNameValue == props.groupwideActionsValue) {
        updateSelectedGroupAction(props.applications[0].id);
      } else if (
        props.applications.map((e) => e.id).indexOf(props.groupNameValue) ==
        props.applications.length - 1
      ) {
        updateSelectedGroupAction(props.groupwideActionsValue);
      } else {
        const currentIndex = props.applications.map((e) => e.id).indexOf(props.groupNameValue);
        updateSelectedGroupAction(props.applications[currentIndex + 1].id);
      }
      setTimeout(() => {
        props.updateGroupLoading(false);
      }, SWITCH_APPLICATIONS_DELAY);
    }
  };

  const prevAppInGroup = () => {
    if (props.applications.length > 0) {
      props.updateGroupLoading(true);
      if (props.groupNameValue == props.groupwideActionsValue) {
        updateSelectedGroupAction(props.applications[props.applications.length - 1].id);
      } else if (props.applications.map((e) => e.id).indexOf(props.groupNameValue) == 0) {
        updateSelectedGroupAction(props.groupwideActionsValue);
      } else {
        const currentIndex = props.applications.map((e) => e.id).indexOf(props.groupNameValue);
        updateSelectedGroupAction(props.applications[currentIndex - 1].id);
      }
      setTimeout(() => {
        props.updateGroupLoading(false);
      }, SWITCH_APPLICATIONS_DELAY);
    }
  };

  const groupWideActionsClass = classNames({
    current: props.groupNameValue == props.groupwideActionsValue,
  });

  return (
    <nav className="group omnibar">
      <div className="prev" onClick={prevAppInGroup}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/prev.svg" alt="Previous" />
      </div>
      <div className="group-contents">
        <div className="group-apps-list">
          <div className={currentAppListClasses}>
            <span className="group-title">
              {props.title}{' '}
              {props.groupNameValue == props.groupwideActionsValue
                ? `(${props.applications.length})`
                : `(${numberOfApplication}/${props.applications.length})`}
            </span>
            <input
              className="current-app-input"
              onFocus={changeGroupAppsListVisible}
              // onBlur={changeGroupAppsListInvisible}
              value={inputValue}
              onChange={updateGroupNameInputValue}
            />
            <span className="select-control" onClick={toggleGroupAppsListVisible}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/next.svg" alt="Show Applications in Group" />
            </span>
          </div>
          <ul className={groupAppsListOptionsClasses}>
            <li onClick={() => updateSelectedGroupAction(props.groupwideActionsValue)}>
              <span className={groupWideActionsClass}>{props.groupwideActionsValue}</span>
            </li>
            {props.applications
              .filter((item) => generateServiceMemberName(item).includes(groupNameInputValue))
              .map((item, index) => {
                const applicationListItemClass = classNames({
                  current: item.id == props.groupNameValue,
                });
                return (
                  <li key={item.id}>
                    <span
                      className={applicationListItemClass}
                      onClick={() => updateSelectedGroupAction(item.id)}
                    >
                      {generateServiceMemberName(item)}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
        <ul className="app-tabs">
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
            isComplete={missingServiceMemberFields().length == 0 && missingPatientFields().length == 0}
          />
          <OmnibarLink
            tab={3}
            currentTab={props.currentTab}
            changeTab={props.changeTab}
            isComplete={missingLodgingFields().length == 0}
          />
          {props.groupNameValue != props.groupwideActionsValue && (
            <OmnibarLink
              tab={4}
              currentTab={props.currentTab}
              changeTab={props.changeTab}
              isComplete={tabFourStatus}
            />
          )}
        </ul>
      </div>
      <div className="next" onClick={nextAppInGroup}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/next.svg" alt="Next" />
      </div>
    </nav>
  );
}

GroupOmnibar.defaultProps = {
  currentTab: 1,
  changeTab: () => { },
  groupwideActionsValue: '',
  groupNameValue: '',
  setGroupNameValue: () => { },
  applications: [],
  title: '',
  updateGroupLoading: () => { },
};
