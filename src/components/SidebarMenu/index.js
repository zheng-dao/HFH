import SidebarMenuLink from './link';

export default function SidebarMenu(props) {
  return (
    <ul>
      {props.menu.map((item) => {
        return <SidebarMenuLink key={item.title} item={item} />;
      })}
    </ul>
  );
}

SidebarMenu.defaultProps = {
  menu: [],
};
