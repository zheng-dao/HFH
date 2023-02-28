import { Fragment } from "react"

export default function AdditionalGuestsBlock(props) {

    const guests = props.guests.filter(g => {
        return g.first_name != null && g.last_name != null
    })

    if (guests.length > 0) {
        return (
            <Fragment>
                <h4>Additional Guests</h4>
                <div className={`detail-block`}>
                    {
                        guests.map(guest => {
                            const name = (guest.first_name ?? "") + " " + (guest.middle_initial ?? "") + " " + (guest.last_name ?? "")
                            return (
                                <p key={guest.id}>
                                    {name}
                                    <br />
                                    { 
                                        guest.telephone &&
                                        <Fragment>{guest.telephone}<br /></Fragment>
                                    }
                                    {  
                                        guest.email &&
                                        <Fragment><a href={`mailto:${guest.email}`}>{guest.email}</a></Fragment>
                                    }
                                </p>
                            )
                        })
                    }
                </div>
            </Fragment>
        )
    }

    return null
}

AdditionalGuestsBlock.defaultProps = {
    guests: []
}