import classNames from 'classnames';
import { useState, Fragment } from 'react';
import uniqueId from '@utils/uniqueId';
import Select, { createFilter } from 'react-select';
import AsyncSelect from 'react-select/async';
import ConditionalWrap from 'conditional-wrap';
import { mapEnumValue } from '@utils/mapEnumValue';

export default function SelectBox(props) {
  const [htmlId] = useState(() => uniqueId('input-'));

  const extraErrorClass = classNames(props.inputClass, {
    error: !props.isValid,
  });

  const selectBoxWrapperClass = classNames('selectbox', {
    'with-add-new': props.withAddNew,
    error: !props.isValid,
  });

  const stringify = ({ label }) => label;
  const filterConfig = {
    ignoreCase: true,
    stringify,
  };

  let selectOptions = [];

  if (props.options instanceof Array) {
    selectOptions = props.options;
  } else {
    selectOptions = Object.keys(props.options).map((key) => {
      if (props.useReactSelect) {
        return {
          value: key,
          label: props.shouldMapEnumValues ? mapEnumValue(props.options[key]) : props.options[key],
        };
      } else {
        return {
          key: key,
          value: props.shouldMapEnumValues ? mapEnumValue(props.options[key]) : props.options[key],
        };
      }
    });
  }

  if (props.blankValue) {
    selectOptions = [{ key: '', value: props.blankValue }, ...selectOptions];
  }

  let value = '';
  if (props.inputValue != null) {
    value = props.inputValue;
    if (typeof props.inputValue != Object && props.useReactSelect && props.inputValue.length > 0) {
      value = selectOptions.find((item) => item.value == props.inputValue);
    }
  }

  const caseInsensitive = createFilter({ ignoreCase: true, stringify });
  const filterOption = (candidate, input) => {
    return candidate.data.__isNew__ || candidate.label?.includes(input);
  };

  return (
    <Fragment>
      <ConditionalWrap
        condition={props.useRegularSelect && props.withWrapper}
        wrap={(children) => <div className={selectBoxWrapperClass}>{children}</div>}
      >
        {props.useRegularSelect && !props.useReactSelect && (
          <select
            id={htmlId}
            value={value}
            onChange={props.inputOnChange}
            required={props.inputRequired}
            onBlur={props.inputOnBlur}
            disabled={props.inputDisabled}
            {...props.childProps}
          >
            {selectOptions.map((item) => {
              return (
                <option
                  disabled={false && item.key == '' && props.inputRequired}
                  key={item.key}
                  value={item.key}
                >
                  {item.value}
                </option>
              );
            })}
          </select>
        )}

        {props.useReactSelect && props.getOptions && (
          props.isSideBar ?
            <AsyncSelect
              value={value}
              onChange={props.inputOnChange}
              onBlur={props.inputOnBlur}
              placeholder={props.placeholder}
              isSearchable
              isClearable={props.isClearable}
              className="search-select"
              classNamePrefix="search-select"
              cacheOptions
              defaultOptions
              loadOptions={props.getOptions}
              filterOption={caseInsensitive}
              isDisabled={props.inputDisabled}
              styles={
                props.inputDisabled && {
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    color: 'white',
                  }),
                  singleValue: (baseStyles) => ({
                    ...baseStyles,
                    color: 'white',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: '#262626',
                  }),
                }
              }
            />
            :
            <AsyncSelect
              value={value}
              onChange={props.inputOnChange}
              onBlur={props.inputOnBlur}
              placeholder={props.placeholder}
              isSearchable
              isClearable={props.isClearable}
              className="search-select"
              classNamePrefix="search-select"
              cacheOptions
              defaultOptions
              loadOptions={props.getOptions}
              filterOption={caseInsensitive}
              isDisabled={props.inputDisabled}
              styles={
                props.inputDisabled && {
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: '#262626',
                  }),
                  singleValue: (baseStyles) => ({
                    ...baseStyles,
                    color: '#262626',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: '#262626',
                  }),
                }
              }
            />
        )}

        {props.useReactSelect && !props.getOptions && (
          props.isSideBar ?
            <Select
              value={value}
              onChange={props.inputOnChange}
              onBlur={props.inputOnBlur}
              placeholder={props.placeholder}
              isSearchable
              isClearable={props.isClearable}
              className="search-select"
              // menuIsOpen={true}
              classNamePrefix="search-select"
              options={selectOptions}
              isDisabled={props.inputDisabled}
              filterOption={caseInsensitive}
              // filterOption={filterOption}
              styles={
                props.inputDisabled && {
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    color: 'white',
                  }),
                  singleValue: (baseStyles) => ({
                    ...baseStyles,
                    color: 'white',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: '#262626',
                  }),
                }
              }
            />
            :
            <Select
              value={value}
              onChange={props.inputOnChange}
              onBlur={props.inputOnBlur}
              placeholder={props.placeholder}
              isSearchable
              isClearable={props.isClearable}
              className="search-select"
              // menuIsOpen={true}
              classNamePrefix="search-select"
              options={selectOptions}
              isDisabled={props.inputDisabled}
              filterOption={caseInsensitive}
              // filterOption={filterOption}
              styles={
                props.inputDisabled && {
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    color: '#262626',
                  }),
                  singleValue: (baseStyles) => ({
                    ...baseStyles,
                    color: '#262626',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: '#262626',
                  }),
                }
              }
            />
        )}

        {props.withAddNew && (
          <button
            className="small add"
            type="button"
            onClick={props.onAddNewClick}
            disabled={props.inputDisabled}
          >
            Add New
          </button>
        )}
      </ConditionalWrap>
      {!props.isValid && props.errorMessage ? <p className="errMsg">{props.errorMessage}</p> : ''}
    </Fragment>
  );
}

SelectBox.defaultProps = {
  wrapperClass: '',
  label: '',
  blankValue: 'None',
  inputValue: '',
  inputRequired: false,
  inputOnChange: () => { },
  inputOnBlur: () => { },
  isValid: true,
  errorMessage: 'Please review this field for errors.',
  options: [],
  childProps: {},
  withAddNew: false,
  onAddNewClick: () => { },
  placeholder: '',
  useRegularSelect: true,
  useReactSelect: false,
  getOptions: false,
  inputDisabled: false,
  inputClass: '',
  withWrapper: true,
  isClearable: true,
  shouldMapEnumValues: true,
};
