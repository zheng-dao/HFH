import Link from 'next/link';
import classNames from 'classnames';
import SidebarMenuLink from '../SidebarMenu/link';

export default function SystemLandingBlock(props) {
  const divClass = classNames(props.wrapperClass, 'system-landing-block');

  return (
    <div className={divClass}>
      <h2>{props.title}</h2>

      <ul>
        {props.menu.map((item) => (
          <SidebarMenuLink key={item.title} item={item} />
        ))}
      </ul>
    </div>
  );
}

SystemLandingBlock.defaultProps = {
  title: '',
  menu: [],
  wrapperClass: '',
};
