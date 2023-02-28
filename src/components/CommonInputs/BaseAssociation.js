import { AFFILIATIONTYPE } from '@src/API';
import Selectfield from '@components/Inputs/Selectfield';
import useAffiliationsHook from '../../hooks/useAffiliationsHook';
import useAuth from '@contexts/AuthContext';

export default function BaseAssociation(props) {
  const options = useAffiliationsHook(AFFILIATIONTYPE.BASE, false);
  const optionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.BASE, false, true);

  return (
    <Selectfield
      label={props.label}
      labelCount={props.labelCount}
      inputDisabled={props.inputDisabled}
      wrapperClass="base"
      options={options.find((item) => item.value === props.value) ? options :
        optionsIncludingArchiving.find((item) => item.value === props.value) ? [...options, optionsIncludingArchiving.find((item) => item.value === props.value)] :
          options}
      inputValue={props.value}
      inputOnChange={props.onChange}
      placeholder="Select Base Assigned..."
      useReactSelect
      blankValue=""
      useRegularSelect={false}
      isValid={props.isValid}
      errorMessage={props.errorMessage}
    />
  );
}

BaseAssociation.defaultProps = {
  value: '',
  onChange: () => { },
  label: 'Base',
  inputDisabled: false,
  isValid: true,
  errorMessage: '',
};
