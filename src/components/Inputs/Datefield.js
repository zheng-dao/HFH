import DatePicker from 'react-datepicker';
import { Fragment, useState } from 'react';
import uniqueId from '@utils/uniqueId';
import 'react-datepicker/dist/react-datepicker.css';
import valueOrEmptyString from '@utils/valueOrEmptyString';
import format from 'date-fns/format';

export default function Datefield(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = !props.isValid ? 'error' : '';

  if (props.inputDisabled) {
    let printedValue = props.selected ? valueOrEmptyString(props.selected.toString()) : '';
    if (printedValue == '') {
      printedValue = <p dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
    } else {
      printedValue = <p>{format(new Date(props.selected), 'MM/dd/Y')}</p>;
    }
    return (
      <div className={`input-combo ${props.wrapperClass}`}>
        <label className="disabled">{props.label}</label>
        <div className="displaybox">{printedValue}</div>
      </div>
    );
  }

  const handleChangeRaw = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`input-combo ${props.wrapperClass}`}>
      <label className={extraErrorClass} htmlFor={htmlId}>
        {props.label}
        {props.labelCount >= 0 && (
          <Fragment>
            &nbsp;
            <abbr title={'There are ' + props.labelCount + ' unique values for this input.'}>
              ({props.labelCount})
            </abbr>
          </Fragment>
        )}
      </label>
      {/* <DatePicker
        disabled={props.inputDisabled}
        strictParsing
        placeholderText="mm/dd/yyyy"
        maxDate={new Date('December 31, 9999 00:00:00')}
        onChangeRaw={(e) => handleChangeRaw(e)}
        {...props}
      /> */}
      <input
        type="date"
        placeholder=""
        value={props.selected || ''}
        min={props.minDate}
        max={props.maxDate}
        onChange={props.onChange}
        disabled={props.inputDisabled}
      />
      {!props.isValid ? <p className="errMsg">{props.errorMessage}</p> : ''}
    </div>
  );
}

Datefield.defaultProps = {
  wrapperClass: 'something',
  label: 'My Label',
  labelCount: -1,
  inputType: 'text',
  inputValue: '',
  inputRequired: false,
  inputOnChange: () => {},
  inputOnBlur: () => {},
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  maxLength: 128,
  childProps: {},
  inputDisabled: false,
};
