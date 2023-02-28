/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { ServiceMember } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, SwitchField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function ServiceMemberCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    first_name: undefined,
    middle_initial: undefined,
    last_name: undefined,
    email: undefined,
    telephone: undefined,
    extension: undefined,
    branch_of_service: undefined,
    current_status: undefined,
    on_military_travel_orders: false,
    other_patient: false,
    lodging_explanation: undefined,
    unidentified_explanation: undefined,
  };
  const [first_name, setFirst_name] = React.useState(initialValues.first_name);
  const [middle_initial, setMiddle_initial] = React.useState(initialValues.middle_initial);
  const [last_name, setLast_name] = React.useState(initialValues.last_name);
  const [email, setEmail] = React.useState(initialValues.email);
  const [telephone, setTelephone] = React.useState(initialValues.telephone);
  const [extension, setExtension] = React.useState(initialValues.extension);
  const [branch_of_service, setBranch_of_service] = React.useState(initialValues.branch_of_service);
  const [current_status, setCurrent_status] = React.useState(initialValues.current_status);
  const [on_military_travel_orders, setOn_military_travel_orders] = React.useState(
    initialValues.on_military_travel_orders
  );
  const [other_patient, setOther_patient] = React.useState(initialValues.other_patient);
  const [lodging_explanation, setLodging_explanation] = React.useState(
    initialValues.lodging_explanation
  );
  const [unidentified_explanation, setUnidentified_explanation] = React.useState(
    initialValues.unidentified_explanation
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirst_name(initialValues.first_name);
    setMiddle_initial(initialValues.middle_initial);
    setLast_name(initialValues.last_name);
    setEmail(initialValues.email);
    setTelephone(initialValues.telephone);
    setExtension(initialValues.extension);
    setBranch_of_service(initialValues.branch_of_service);
    setCurrent_status(initialValues.current_status);
    setOn_military_travel_orders(initialValues.on_military_travel_orders);
    setOther_patient(initialValues.other_patient);
    setLodging_explanation(initialValues.lodging_explanation);
    setUnidentified_explanation(initialValues.unidentified_explanation);
    setErrors({});
  };
  const validations = {
    first_name: [],
    middle_initial: [],
    last_name: [],
    email: [],
    telephone: [],
    extension: [],
    branch_of_service: [],
    current_status: [],
    on_military_travel_orders: [],
    other_patient: [],
    lodging_explanation: [],
    unidentified_explanation: [],
  };
  const runValidationTasks = async (fieldName, value) => {
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          first_name,
          middle_initial,
          last_name,
          email,
          telephone,
          extension,
          branch_of_service,
          current_status,
          on_military_travel_orders,
          other_patient,
          lodging_explanation,
          unidentified_explanation,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) => runValidationTasks(fieldName, item))
              );
              return promises;
            }
            promises.push(runValidationTasks(fieldName, modelFields[fieldName]));
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          await DataStore.save(new ServiceMember(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, 'ServiceMemberCreateForm')}
    >
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name: value,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.first_name ?? value;
          }
          if (errors.first_name?.hasError) {
            runValidationTasks('first_name', value);
          }
          setFirst_name(value);
        }}
        onBlur={() => runValidationTasks('first_name', first_name)}
        errorMessage={errors.first_name?.errorMessage}
        hasError={errors.first_name?.hasError}
        {...getOverrideProps(overrides, 'first_name')}
      ></TextField>
      <TextField
        label="Middle initial"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial: value,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.middle_initial ?? value;
          }
          if (errors.middle_initial?.hasError) {
            runValidationTasks('middle_initial', value);
          }
          setMiddle_initial(value);
        }}
        onBlur={() => runValidationTasks('middle_initial', middle_initial)}
        errorMessage={errors.middle_initial?.errorMessage}
        hasError={errors.middle_initial?.hasError}
        {...getOverrideProps(overrides, 'middle_initial')}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name: value,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.last_name ?? value;
          }
          if (errors.last_name?.hasError) {
            runValidationTasks('last_name', value);
          }
          setLast_name(value);
        }}
        onBlur={() => runValidationTasks('last_name', last_name)}
        errorMessage={errors.last_name?.errorMessage}
        hasError={errors.last_name?.hasError}
        {...getOverrideProps(overrides, 'last_name')}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email: value,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks('email', value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks('email', email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, 'email')}
      ></TextField>
      <TextField
        label="Telephone"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone: value,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.telephone ?? value;
          }
          if (errors.telephone?.hasError) {
            runValidationTasks('telephone', value);
          }
          setTelephone(value);
        }}
        onBlur={() => runValidationTasks('telephone', telephone)}
        errorMessage={errors.telephone?.errorMessage}
        hasError={errors.telephone?.hasError}
        {...getOverrideProps(overrides, 'telephone')}
      ></TextField>
      <TextField
        label="Extension"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension: value,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.extension ?? value;
          }
          if (errors.extension?.hasError) {
            runValidationTasks('extension', value);
          }
          setExtension(value);
        }}
        onBlur={() => runValidationTasks('extension', extension)}
        errorMessage={errors.extension?.errorMessage}
        hasError={errors.extension?.hasError}
        {...getOverrideProps(overrides, 'extension')}
      ></TextField>
      <SelectField
        label="Branch of service"
        placeholder="Please select an option"
        isDisabled={false}
        value={branch_of_service}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service: value,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.branch_of_service ?? value;
          }
          if (errors.branch_of_service?.hasError) {
            runValidationTasks('branch_of_service', value);
          }
          setBranch_of_service(value);
        }}
        onBlur={() => runValidationTasks('branch_of_service', branch_of_service)}
        errorMessage={errors.branch_of_service?.errorMessage}
        hasError={errors.branch_of_service?.hasError}
        {...getOverrideProps(overrides, 'branch_of_service')}
      >
        <option
          children="Airforce"
          value="AIRFORCE"
          {...getOverrideProps(overrides, 'branch_of_serviceoption0')}
        ></option>
        <option
          children="Coastguard"
          value="COASTGUARD"
          {...getOverrideProps(overrides, 'branch_of_serviceoption1')}
        ></option>
        <option
          children="Navy"
          value="NAVY"
          {...getOverrideProps(overrides, 'branch_of_serviceoption2')}
        ></option>
        <option
          children="Army"
          value="ARMY"
          {...getOverrideProps(overrides, 'branch_of_serviceoption3')}
        ></option>
        <option
          children="Marines"
          value="MARINES"
          {...getOverrideProps(overrides, 'branch_of_serviceoption4')}
        ></option>
      </SelectField>
      <SelectField
        label="Current status"
        placeholder="Please select an option"
        isDisabled={false}
        value={current_status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status: value,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.current_status ?? value;
          }
          if (errors.current_status?.hasError) {
            runValidationTasks('current_status', value);
          }
          setCurrent_status(value);
        }}
        onBlur={() => runValidationTasks('current_status', current_status)}
        errorMessage={errors.current_status?.errorMessage}
        hasError={errors.current_status?.hasError}
        {...getOverrideProps(overrides, 'current_status')}
      >
        <option
          children="Activeduty"
          value="ACTIVEDUTY"
          {...getOverrideProps(overrides, 'current_statusoption0')}
        ></option>
        <option
          children="Reserve"
          value="RESERVE"
          {...getOverrideProps(overrides, 'current_statusoption1')}
        ></option>
        <option
          children="Nationalguard"
          value="NATIONALGUARD"
          {...getOverrideProps(overrides, 'current_statusoption2')}
        ></option>
        <option
          children="Veteran"
          value="VETERAN"
          {...getOverrideProps(overrides, 'current_statusoption3')}
        ></option>
      </SelectField>
      <SwitchField
        label="On military travel orders"
        defaultChecked={false}
        isDisabled={false}
        isChecked={on_military_travel_orders}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders: value,
              other_patient,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.on_military_travel_orders ?? value;
          }
          if (errors.on_military_travel_orders?.hasError) {
            runValidationTasks('on_military_travel_orders', value);
          }
          setOn_military_travel_orders(value);
        }}
        onBlur={() => runValidationTasks('on_military_travel_orders', on_military_travel_orders)}
        errorMessage={errors.on_military_travel_orders?.errorMessage}
        hasError={errors.on_military_travel_orders?.hasError}
        {...getOverrideProps(overrides, 'on_military_travel_orders')}
      ></SwitchField>
      <SwitchField
        label="Other patient"
        defaultChecked={false}
        isDisabled={false}
        isChecked={other_patient}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient: value,
              lodging_explanation,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.other_patient ?? value;
          }
          if (errors.other_patient?.hasError) {
            runValidationTasks('other_patient', value);
          }
          setOther_patient(value);
        }}
        onBlur={() => runValidationTasks('other_patient', other_patient)}
        errorMessage={errors.other_patient?.errorMessage}
        hasError={errors.other_patient?.hasError}
        {...getOverrideProps(overrides, 'other_patient')}
      ></SwitchField>
      <TextField
        label="Lodging explanation"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation: value,
              unidentified_explanation,
            };
            const result = onChange(modelFields);
            value = result?.lodging_explanation ?? value;
          }
          if (errors.lodging_explanation?.hasError) {
            runValidationTasks('lodging_explanation', value);
          }
          setLodging_explanation(value);
        }}
        onBlur={() => runValidationTasks('lodging_explanation', lodging_explanation)}
        errorMessage={errors.lodging_explanation?.errorMessage}
        hasError={errors.lodging_explanation?.hasError}
        {...getOverrideProps(overrides, 'lodging_explanation')}
      ></TextField>
      <TextField
        label="Unidentified explanation"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              branch_of_service,
              current_status,
              on_military_travel_orders,
              other_patient,
              lodging_explanation,
              unidentified_explanation: value,
            };
            const result = onChange(modelFields);
            value = result?.unidentified_explanation ?? value;
          }
          if (errors.unidentified_explanation?.hasError) {
            runValidationTasks('unidentified_explanation', value);
          }
          setUnidentified_explanation(value);
        }}
        onBlur={() => runValidationTasks('unidentified_explanation', unidentified_explanation)}
        errorMessage={errors.unidentified_explanation?.errorMessage}
        hasError={errors.unidentified_explanation?.hasError}
        {...getOverrideProps(overrides, 'unidentified_explanation')}
      ></TextField>
      <Flex justifyContent="space-between" {...getOverrideProps(overrides, 'CTAFlex')}>
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, 'ClearButton')}
        ></Button>
        <Flex gap="15px" {...getOverrideProps(overrides, 'RightAlignCTASubFlex')}>
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, 'CancelButton')}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, 'SubmitButton')}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
