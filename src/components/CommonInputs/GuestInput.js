import { useState, Fragment, useEffect } from 'react';
import ContactInfoBlock from './ContactInfoBlock';
import NameBlock from './NameBlock';
import validateRequired from '@utils/validators/required';
import validateEmail from '@utils/validators/email';
import validatePhoneNumber from '@utils/validators/phone';
import validateNumeric from '@utils/validators/numeric';
import classNames from 'classnames';
import Textfield from '@components/Inputs/Textfield';
import Checkboxfield from '@components/Inputs/Checkboxfield';
import { GUESTTYPE } from '@src/API';
import StateField from '@components/CommonInputs/StateField';
import validateZip from '@utils/validators/zip';
import valueOrEmptyString from '@utils/valueOrEmptyString';

export default function GuestInput(props) {
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [extensionValid, setExtensionValid] = useState(false);
  const [relationshipValid, setRelationshipValid] = useState(false);
  const [address1Valid, setAddress1Valid] = useState(false);
  const [cityValid, setCityValid] = useState(false);
  const [stateValid, setStateValid] = useState(false);
  const [zipValid, setZipValid] = useState(false);
  const [isReadyForDelete, setIsReadyForDelete] = useState(false);

  const isAdditionalGuest = props.guest?.type == GUESTTYPE.ADDITIONAL;

  useEffect(() => {
    if (props?.shouldShowErrorMessagesFromSubmitValidation) {
      setFirstNameValid(validateRequired(props.guest?.first_name));
      setLastNameValid(validateRequired(props.guest?.last_name));
      if (!isAdditionalGuest) {
        if (props.guest?.email) {
          setEmailValid(validateEmail(props.guest?.email));
        }
        setTelephoneValid(validatePhoneNumber(props.guest?.telephone));
        setExtensionValid(validateNumeric(props.guest?.extension));
        setRelationshipValid(validateRequired(props.guest?.relationship));
        setAddress1Valid(validateRequired(props.guest?.address));
        setCityValid(validateRequired(props.guest?.city));
        setStateValid(validateRequired(props.guest?.state));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.shouldShowErrorMessagesFromSubmitValidation]);

  const removeGuest = (e) => {
    e.preventDefault();
    if (isReadyForDelete) {
      props.removeCall(props.guest?.id);
    } else {
      setIsReadyForDelete(true);
    }
  };

  const firstNameOnBlur = (e) => {
    const is_valid = validateRequired(e.target.value);
    setFirstNameValid(is_valid);
    props.saveGuest(e);
  };

  const middleInitialOnBlur = (e) => {
    const is_valid = true;
    props.saveGuest(e);
  };

  const lastNameOnBlur = (e) => {
    const is_valid = validateRequired(e.target.value);
    setLastNameValid(is_valid);
    props.saveGuest(e);
  };

  const emailOnBlur = (e) => {
    if (e.target.value.length > 0) {
      const is_valid = validateEmail(e.target.value);
      setEmailValid(is_valid);
      if (is_valid.valid && e.target.value.length > 0) {
        props.saveGuest(e);
      }
    } else {
      setEmailValid({
        valid: true,
        message: '',
      });
      props.saveGuest(e);
    }
  };

  const telephoneOnBlur = (e) => {
    const is_valid = validatePhoneNumber(e.target.value);
    setTelephoneValid(is_valid);
    props.saveGuest(e);
  };

  const extensionOnBlur = (e) => {
    const is_valid = validateNumeric(e.target.value);
    setExtensionValid(is_valid);
    props.saveGuest(e);
  };

  const relationshipOnBlur = (e) => {
    const is_valid = validateRequired(e.target.value);
    if (!isAdditionalGuest) {
      setRelationshipValid(is_valid);
    }
    props.saveGuest(e);
  };

  const address1OnBlur = (e) => {
    const is_valid = validateRequired(e.target.value);
    setAddress1Valid(is_valid);
    props.saveGuest(e);
  };

  const address2OnBlur = (e) => {
    props.saveGuest(e);
  };

  const cityOnBlur = (e) => {
    const is_valid = validateRequired(e.target.value, 'The Primary Guest City');
    setCityValid(is_valid);
    props.saveGuest(e);
  };

  const stateOnBlur = (e) => {
    const is_valid = validateRequired(e.target.value, 'The Primary Guest State');
    setStateValid(is_valid);
    props.saveStateField(e);
  };

  const zipOnBlur = (e) => {
    const is_valid = validateZip(e.target.value);
    setZipValid(is_valid);
    props.saveGuest(e);
  };

  const divClass = classNames('inner-pane', props.wrapperClassName, {
    remove: isReadyForDelete,
    primary: !isAdditionalGuest,
    additional: isAdditionalGuest,
  });

  const removeClass = classNames('remove', {
    clicked: isReadyForDelete,
  });

  return (
    <div className={divClass} onMouseLeave={() => setIsReadyForDelete(false)}>
      {props.removable && !props.inputDisabled && (
        <button className={removeClass} title={'Remove'} onClick={removeGuest} type='button'>
          {'Remove'}
        </button>
      )}

      {props.title && <h4>{props.title}</h4>}

      <NameBlock
        inputDisabled={props.inputDisabled}
        firstNameValue={props.guest?.first_name}
        firstNameOnChange={props.updateGuest}
        firstNameValid={firstNameValid}
        firstNameOnBlur={firstNameOnBlur}
        middleInitialValue={props.guest?.middle_initial}
        middleInitialOnChange={props.updateGuest}
        middleInitialOnBlur={middleInitialOnBlur}
        lastNameValue={props.guest?.last_name}
        lastNameOnChange={props.updateGuest}
        lastNameValid={lastNameValid}
        lastNameOnBlur={lastNameOnBlur}
      />

      {!isAdditionalGuest && (
        <div className="contact-details">
          <ContactInfoBlock
            inputDisabled={props.inputDisabled}
            emailValue={props.guest?.email}
            emailOnChange={props.updateGuest}
            emailValid={emailValid}
            emailOnBlur={emailOnBlur}
            emailLabel={'Email (Optional)'}
            telephoneValue={props.guest?.telephone}
            telephoneOnChange={props.updateGuest}
            telephoneValid={telephoneValid}
            telephoneOnBlur={telephoneOnBlur}
            extensionValue={props.guest?.extension}
            extensionOnChange={props.updateGuest}
            extensionValid={extensionValid}
            extensionOnBlur={extensionOnBlur}
          />
        </div>
      )}

      {!isAdditionalGuest && (
        <div className="street-address-block">
          <Textfield
            label="Street Address"
            wrapperClass="street-address"
            inputValue={props.guest?.address}
            inputOnChange={props.updateGuest}
            inputRequired
            inputOnBlur={address1OnBlur}
            isValid={address1Valid.valid}
            errorMessage={address1Valid.message}
            fieldName="address"
            inputDisabled={props.inputDisabled}
          >
            {!props.inputDisabled && (
              <input
                className="no-label"
                type="text"
                value={valueOrEmptyString(props.guest?.address_2)}
                onChange={props.updateGuest}
                onBlur={address2OnBlur}
                data-field="address_2"
                disabled={props.inputDisabled}
              />
            )}
            {props.inputDisabled && <Fragment>{props.guest?.address_2}</Fragment>}
          </Textfield>

          <Textfield
            label="City"
            wrapperClass="city"
            inputValue={props.guest?.city}
            inputOnChange={props.updateGuest}
            inputRequired
            inputOnBlur={cityOnBlur}
            isValid={cityValid.valid}
            errorMessage={''}
            fieldName="city"
            inputDisabled={props.inputDisabled}
          />
          <StateField
            inputValue={props.guest?.state}
            inputOnChange={stateOnBlur}
            inputRequired
            isValid={stateValid.valid}
            errorMessage={''}
            fieldName="state"
            inputDisabled={props.inputDisabled}
          />
          <Textfield
            label="Zip (Optional)"
            wrapperClass="zip"
            inputValue={props.guest?.zip}
            inputOnChange={props.updateGuest}
            inputOnBlur={zipOnBlur}
            isValid={zipValid.valid}
            errorMessage={''}
            fieldName="zip"
            inputDisabled={props.inputDisabled}
          />
          {(cityValid.message || stateValid.message || zipValid.message) && (
            <Fragment>
              <p className="errMsg">
                {[cityValid.message, stateValid.message, zipValid.message]
                  .filter((i) => i)
                  .join(' ')}
              </p>
            </Fragment>
          )}
        </div>
      )}

      <div className="relationship-info">
        <Textfield
          inputDisabled={props.inputDisabled}
          wrapperClass="relationship"
          label={'Relationship to Service Member' + (isAdditionalGuest ? ' (Optional)' : '')}
          inputValue={props.guest?.relationship}
          inputOnChange={props.updateGuest}
          inputOnBlur={relationshipOnBlur}
          inputRequired={true}
          isValid={relationshipValid.valid}
          errorMessage={relationshipValid.message}
          fieldName="relationship"
        />

        {props.shouldPromptForAge && (
          <div className="input-combo age">
            <label className={props.inputDisabled ? 'disabled' : ''}>Guest Age</label>
            <div className="checkboxes single labeled">
              <Checkboxfield
                inputDisabled={props.inputDisabled}
                label="Check if under 3"
                inputChecked={props.guest?.under_age_three}
                inputOnChange={props.saveAgeField}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

GuestInput.props = {
  title: '',
  removable: false,
  id: '',
  updateGuest: () => {},
  saveGuest: () => {},
  wrapperClassName: '',
  guest: {},
  shouldPromptForAge: false,
  saveAgeField: () => {},
  saveStateField: () => {},
  inputDisabled: false,
};
