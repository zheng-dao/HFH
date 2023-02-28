import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import { API, graphqlOperation } from 'aws-amplify';
import { getConfigurationSettingByName } from '@src/graphql/queries';
import { STAYTYPE, STAYSTATUS } from '@src/API';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';

export default function CheckinReminderBlock(props) {
  const [daysInAdvanceWarning, setDaysInAdvanceWarning] = useState(0);

  useEffect(() => {
    API.graphql(
      graphqlOperation(getConfigurationSettingByName, { name: 'days_before_checkin_alert' })
    )
      .then((res) => {
        if (res.data.getConfigurationSettingByName.items.length > 0) {
          setDaysInAdvanceWarning(res.data.getConfigurationSettingByName.items[0].value);
        }
      })
      .catch((err) => {
        console.log('Error getting configuration value', err);
      });
  }, []);

  const { stays } = props;

  let message = '';

  stays.forEach((stay) => {
    if (
      stay?.status == STAYSTATUS.REQUESTED &&
      stay?.requested_check_in &&
      stay?.requested_check_out &&
      daysInAdvanceWarning > 0
    ) {
      const checkinDate = makeTimezoneAwareDate(stay.requested_check_in);
      const today = new Date();
      const diff = checkinDate.getTime() / 1000 - today.getTime() / 1000;
      if (diff >= 0 && diff <= daysInAdvanceWarning * 86400) {
        message = 'The check in date for the ';
        if (stay.type == STAYTYPE.INITIAL) {
          message += 'Initial Stay Request ';
        } else {
          message += 'Extended Stay Request ';
        }
        const checkoutDate = makeTimezoneAwareDate(stay.requested_check_out);
        message +=
          ' (<strong>' +
          format(checkinDate, 'LLL do, Y') +
          ' - ' +
          format(checkoutDate, 'LLL do, Y') +
          '</strong>) is coming up!';
      }
    }
  });

  if (message.length == 0) {
    return null;
  }

  return (
    <div className="user-messages app-pane">
      <div className="detail-block status">
        <p dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    </div>
  );
}

CheckinReminderBlock.defaultProps = {
  stays: [],
};
