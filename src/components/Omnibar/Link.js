import classNames from 'classnames';
import { tabs } from '@utils/tabNames';

export default function OmnibarLink(props) {
  const classes = classNames({
    current: props.currentTab == props.tab,
    complete: props.isComplete,
  });

  return (
    <li>
      <a
        href="#"
        className={classes}
        onClick={(e) => {
          e.preventDefault();
          props.changeTab(props.tab);
        }}
      >
        <span className="number">{props.tab}</span> <span className="step">{tabs[props.tab]}</span>
      </a>
    </li>
  );
}

OmnibarLink.defaultProps = {
  tab: 0,
  currentTab: 100,
  isComplete: false,
  changeTab: () => {},
};
