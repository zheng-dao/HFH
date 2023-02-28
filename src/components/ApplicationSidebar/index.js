import LiaisonApplicationSidebar from './Liaison'

export default function ApplicationSidebar(props) {
    // Liaison sidebar
    if (true) {
        return <LiaisonApplicationSidebar {...props} />
    }
    else {
        return (<div>Admin sidebar!</div>)
    }
    return null
}

ApplicationSidebar.defaultProps = {

}