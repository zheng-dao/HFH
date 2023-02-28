import { AFFILIATIONTYPE } from '@src/API';
import Selectfield from '@components/Inputs/Selectfield';
import useAffiliationsHook from '../../hooks/useAffiliationsHook';
import useAuth from '@contexts/AuthContext';

export default function OrganizationAssociation(props) {
  const { isAdministrator } = useAuth();
  const options = useAffiliationsHook(AFFILIATIONTYPE.ORGANIZATION, false);

  return (
    <Selectfield
      label="Organizations"
      wrapperClass="organizations"
      options={options}
      inputValue={props.value}
      inputOnChange={props.onChange}
      inputDisabled={props.inputDisabled}
    />
  );
}

OrganizationAssociation.defaultProps = {
  value: '',
  onChange: () => {},
  inputDisabled: false,
};
