import { Fragment } from 'react';
import PrimaryGuestBlock from './primary';
import useApplicationContext from '@contexts/ApplicationContext';

export default function GuestBlock(props) {
  const { primaryGuest, additionalGuests } = useApplicationContext();

  return (
    <Fragment>
      <PrimaryGuestBlock guest={primaryGuest} numberOfAdditionalGuests={additionalGuests.length} />
    </Fragment>
  );
}

GuestBlock.defaultProps = {
  applicationId: null,
};
