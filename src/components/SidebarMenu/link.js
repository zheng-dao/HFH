import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SidebarMenuLink(props) {
    const router = useRouter()
    if (typeof props.item.children !== "undefined") {
        return (
            <li className="expanded">
                {props.item.title}
                <ul>
                {props.item.children.map(item => {return (<SidebarMenuLink key={item.title} item={item} />)})}
                </ul>
            </li>
        )
    }
    else {
        const linkClass = classNames({
            "current": router.pathname == props.item.link
        })
        return (
            <li>
                <Link href={props.item.link}>
                    <a className={linkClass}>
                        {props.item.title}

                        {
                            props.item.badge > 0 &&
                            <span className="pending badge">{props.item.badge}</span>
                        }
                    </a>
                </Link>
            </li>
        )
    }
}

SidebarMenuLink.defaultProps = {
    item: {}
}