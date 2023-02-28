import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import { API, graphqlOperation } from 'aws-amplify';
import { getConfigurationSettingByName } from '@src/graphql/queries';
import { STAYTYPE, STAYSTATUS } from '@src/API';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';

export default function CheckoutReminderBlock(props) {
  const [daysAfterWarning, setDaysAfterWarning] = useState(0);

  useEffect(() => {
    API.graphql(
      graphqlOperation(getConfigurationSettingByName, { name: 'days_after_checkout_alert' })
    )
      .then((res) => {
        if (res.data.getConfigurationSettingByName.items.length > 0) {
          setDaysAfterWarning(res.data.getConfigurationSettingByName.items[0].value);
        }
      })
      .catch((err) => {
        console.log('Error getting configuration value', err);
      });
  }, []);

  const { stays } = props;

  let message = '';

  stays.forEach((stay) => {
    if (stay?.status == STAYSTATUS.APPROVED && stay?.requested_check_out && daysAfterWarning > 0) {
      const checkoutDate = makeTimezoneAwareDate(stay.requested_check_out);
      const today = new Date();
      const diff = today.getTime() / 1000 - checkoutDate.getTime() / 1000;
      if (diff >= 0 && diff >= daysAfterWarning * 86400) {
        message = 'Please complete the follow up information for the  ';
        if (stay.type == STAYTYPE.INITIAL) {
          message += 'Initial Stay ';
        } else {
          message += 'Extended Stay ';
        }
        message += '(checkout <strong>' + format(checkoutDate, 'LLL do, Y') + '</strong>).';
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

CheckoutReminderBlock.defaultProps = {
  stays: [],
};
