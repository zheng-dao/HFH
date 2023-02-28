import uniqueId from '@utils/uniqueId';
import { Fragment, useState } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import SelectBox from './SelectBox';
import valueOrEmptyString from '@utils/valueOrEmptyString';
import { mapEnumValue } from '@utils/mapEnumValue';

export default function Selectfield(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = classNames({
    error: !props.isValid,
  });
  // if (props.inputDisabled) {
  //   let printedValue = valueOrEmptyString(props.inputValue);
  //   if (printedValue == '' || printedValue == null) {
  //     printedValue = <p dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />;
  //   } else {
  //     printedValue = mapEnumValue(printedValue);
  //     let selectOptions = [];

  //     if (props.options instanceof Array) {
  //       selectOptions = props.options;
  //     } else {
  //       selectOptions = Object.keys(props.options).map((key) => {
  //         if (props.useReactSelect) {
  //           return {
  //             value: key,
  //             label: mapEnumValue(props.options[key]),
  //           };
  //         } else {
  //           return {
  //             key: key,
  //             value: mapEnumValue(props.options[key]),
  //           };
  //         }
  //       });
  //     }

  //     if (selectOptions.filter((item) => item.key == printedValue).length > 0) {
  //       printedValue = selectOptions.find((item) => item.key == printedValue).value;
  //     } else if (selectOptions.filter((item) => item.value == printedValue).length > 0) {
  //       printedValue = selectOptions.find((item) => item.value == printedValue).value;
  //     }
  //     if (
  //       props.useReactSelect &&
  //       selectOptions.filter((item) => item.value == printedValue).length > 0
  //     ) {
  //       printedValue = selectOptions.find((item) => item.value == printedValue).label;
  //     }
  //     if (
  //       typeof printedValue === 'object' &&
  //       !Array.isArray(printedValue) &&
  //       printedValue !== null
  //     ) {
  //       printedValue = printedValue.label;
  //     }
  //     printedValue = <p>{printedValue}</p>;
  //   }
  //   return (
  //     <div className={`input-combo ${props.wrapperClass}`}>
  //       <label className="disabled">{props.label}</label>
  //       <div className="displaybox">{printedValue}</div>
  //     </div>
  //   );
  // }

  return (
    <div className={`input-combo ${props.wrapperClass}`}>
      {props.label && (
        <label className={props.inputDisabled ? 'disabled' : extraErrorClass} htmlFor={htmlId}>
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
      )}

      <SelectBox {...props} />
    </div>
  );
}

Selectfield.defaultProps = {
  wrapperClass: '',
  label: '',
  labelCount: -1,
  inputValue: '',
  inputRequired: false,
  inputOnChange: () => {},
  inputOnBlur: () => {},
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  options: [],
  childProps: {},
  withAddNew: false,
  onAddNewClick: () => {},
  placeholder: '',
  useRegularSelect: true,
  useReactSelect: false,
  getOptions: false,
  inputDisabled: false,
  shouldMapEnumValues: true,
  isSideBar: false
};
