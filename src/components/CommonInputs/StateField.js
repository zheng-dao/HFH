import { State } from '@utils/states';
import Selectfield from '@components/Inputs/Selectfield';

export default function StateField(props) {
  const options = new State().getStatesOfCountry('US').map((i) => {
    return { value: i.name, label: i.name + ' (' + i.isoCode + ')' };
  });

  const inputValue = options.find((item) => item.value == props.inputValue);

  const onChange = (e) => {
    props.inputOnChange({
      target: { value: e == null || e?.value == props.blankValue ? '' : e.value },
    });
  };

  return (
    <Selectfield
      {...props}
      inputOnChange={onChange}
      options={options}
      useReactSelect
      useRegularSelect={false}
      inputValue={inputValue}
      placeholder={props.blankValue}
      blankValue=""
    />
  );
}

StateField.defaultProps = {
  label: 'State',
  wrapperClass: 'state',
  inputValue: '',
  inputOnChange: () => {},
  blankValue: 'Select a state...',
  isValid: true,
  errorMessage: '',
};
