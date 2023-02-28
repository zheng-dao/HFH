import { AFFILIATIONTYPE } from '@src/API';
import Selectfield from '@components/Inputs/Selectfield';
import useAffiliationsHook from '../../hooks/useAffiliationsHook';
import useAuth from '@contexts/AuthContext';

export default function FisherHouseAssociation(props) {
  const { isAdministrator } = useAuth();
  const options = useAffiliationsHook(AFFILIATIONTYPE.FISHERHOUSE, false);

  return (
    <Selectfield
      label="Fisher House"
      wrapperClass="fisher-house"
      options={options}
      inputValue={props.value}
      inputOnChange={props.onChange}
      inputDisabled={props.inputDisabled}
    />
  );
}

FisherHouseAssociation.defaultProps = {
  value: '',
  onChange: () => {},
  inputDisabled: false,
};
