import Selectfield from '@components/Inputs/Selectfield';
import Datefield from '@components/Inputs/Datefield';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import isBefore from 'date-fns/isBefore';
import addDays from 'date-fns/addDays';
import { USERSTATUS } from '@src/API';
import { format } from 'date-fns';

export default function ProfileAdminSidebar(props) {
  const roles = [
    {
      value: 'Administrators',
      label: 'Admin',
    },
    {
      value: 'Liaisons',
      label: 'Liaison',
    },
  ];

  const updateExpirationValue = (e) => {
    if (e.target.value === '') {
      props.updateProfile('expiration_date', null);
    } else {
      props.updateProfile('expiration_date', formatISO(new Date(e.target.value)));
    }
  };

  return (
    <div className="sidebar">
      <div className="app-pane">
        <h3>User Settings</h3>

        <form role="form">
          <Selectfield
            inputRequired={true}
            label="Role"
            options={roles}
            inputValue={props.role}
            inputOnChange={props.updateRole}
            blankValue={false}
            useReactSelect
            useRegularSelect={false}
            isClearable={false}
          />

          <Datefield
            label="Account Expiration Date (Optional)"
            selected={
              props.profile?.expiration_date ? format(new Date(props.profile?.expiration_date), 'yyyy-MM-dd') : null
            }
            onChange={updateExpirationValue}
            minDate={format(new Date(), 'yyyy-MM-dd')}
            inputDisabled={
              props.profile?.status == USERSTATUS.INACTIVE ||
              (props.profile?.expiration_date
                ? isBefore(parseISO(props.profile?.expiration_date), addDays(new Date(), -1))
                : false)
            }
          />
        </form>
      </div>
    </div>
  );
}

ProfileAdminSidebar.defaultProps = {
  username: null,
  profile: {},
  updateProfile: () => {},
  role: 'Liaison',
  updateRole: () => {},
};
