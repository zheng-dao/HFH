/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Affiliation } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function AffiliationUpdateForm(props) {
  const {
    id,
    affiliation,
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
    name: undefined,
    type: undefined,
    status: undefined,
    display_name: undefined,
    address: undefined,
    address_2: undefined,
    city: undefined,
    state: undefined,
    zip: undefined,
    branch: undefined,
  };
  const [name, setName] = React.useState(initialValues.name);
  const [type, setType] = React.useState(initialValues.type);
  const [status, setStatus] = React.useState(initialValues.status);
  const [display_name, setDisplay_name] = React.useState(initialValues.display_name);
  const [address, setAddress] = React.useState(initialValues.address);
  const [address_2, setAddress_2] = React.useState(initialValues.address_2);
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [zip, setZip] = React.useState(initialValues.zip);
  const [branch, setBranch] = React.useState(initialValues.branch);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = { ...initialValues, ...affiliationRecord };
    setName(cleanValues.name);
    setType(cleanValues.type);
    setStatus(cleanValues.status);
    setDisplay_name(cleanValues.display_name);
    setAddress(cleanValues.address);
    setAddress_2(cleanValues.address_2);
    setCity(cleanValues.city);
    setState(cleanValues.state);
    setZip(cleanValues.zip);
    setBranch(cleanValues.branch);
    setErrors({});
  };
  const [affiliationRecord, setAffiliationRecord] = React.useState(affiliation);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(Affiliation, id) : affiliation;
      setAffiliationRecord(record);
    };
    queryData();
  }, [id, affiliation]);
  React.useEffect(resetStateValues, [affiliationRecord]);
  const validations = {
    name: [],
    type: [{ type: 'Required' }],
    status: [{ type: 'Required' }],
    display_name: [],
    address: [],
    address_2: [],
    city: [],
    state: [],
    zip: [],
    branch: [],
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
          name,
          type,
          status,
          display_name,
          address,
          address_2,
          city,
          state,
          zip,
          branch,
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
          await DataStore.save(
            Affiliation.copyOf(affiliationRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, 'AffiliationUpdateForm')}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        defaultValue={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              type,
              status,
              display_name,
              address,
              address_2,
              city,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks('name', value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks('name', name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, 'name')}
      ></TextField>
      <SelectField
        label="Type"
        placeholder="Please select an option"
        isDisabled={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type: value,
              status,
              display_name,
              address,
              address_2,
              city,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks('type', value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks('type', type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, 'type')}
      >
        <option
          children="Fisherhouse"
          value="FISHERHOUSE"
          {...getOverrideProps(overrides, 'typeoption0')}
        ></option>
        <option
          children="Medicalcenter"
          value="MEDICALCENTER"
          {...getOverrideProps(overrides, 'typeoption1')}
        ></option>
        <option
          children="Base"
          value="BASE"
          {...getOverrideProps(overrides, 'typeoption2')}
        ></option>
        <option
          children="Organization"
          value="ORGANIZATION"
          {...getOverrideProps(overrides, 'typeoption3')}
        ></option>
      </SelectField>
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status: value,
              display_name,
              address,
              address_2,
              city,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks('status', value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks('status', status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, 'status')}
      >
        <option
          children="Draft"
          value="DRAFT"
          {...getOverrideProps(overrides, 'statusoption0')}
        ></option>
        <option
          children="Pending"
          value="PENDING"
          {...getOverrideProps(overrides, 'statusoption1')}
        ></option>
        <option
          children="Active"
          value="ACTIVE"
          {...getOverrideProps(overrides, 'statusoption2')}
        ></option>
        <option
          children="Archived"
          value="ARCHIVED"
          {...getOverrideProps(overrides, 'statusoption3')}
        ></option>
      </SelectField>
      <TextField
        label="Display name"
        isRequired={false}
        isReadOnly={false}
        defaultValue={display_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name: value,
              address,
              address_2,
              city,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.display_name ?? value;
          }
          if (errors.display_name?.hasError) {
            runValidationTasks('display_name', value);
          }
          setDisplay_name(value);
        }}
        onBlur={() => runValidationTasks('display_name', display_name)}
        errorMessage={errors.display_name?.errorMessage}
        hasError={errors.display_name?.hasError}
        {...getOverrideProps(overrides, 'display_name')}
      ></TextField>
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        defaultValue={address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name,
              address: value,
              address_2,
              city,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.address ?? value;
          }
          if (errors.address?.hasError) {
            runValidationTasks('address', value);
          }
          setAddress(value);
        }}
        onBlur={() => runValidationTasks('address', address)}
        errorMessage={errors.address?.errorMessage}
        hasError={errors.address?.hasError}
        {...getOverrideProps(overrides, 'address')}
      ></TextField>
      <TextField
        label="Address 2"
        isRequired={false}
        isReadOnly={false}
        defaultValue={address_2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name,
              address,
              address_2: value,
              city,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.address_2 ?? value;
          }
          if (errors.address_2?.hasError) {
            runValidationTasks('address_2', value);
          }
          setAddress_2(value);
        }}
        onBlur={() => runValidationTasks('address_2', address_2)}
        errorMessage={errors.address_2?.errorMessage}
        hasError={errors.address_2?.hasError}
        {...getOverrideProps(overrides, 'address_2')}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        defaultValue={city}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name,
              address,
              address_2,
              city: value,
              state,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks('city', value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks('city', city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, 'city')}
      ></TextField>
      <TextField
        label="State"
        isRequired={false}
        isReadOnly={false}
        defaultValue={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name,
              address,
              address_2,
              city,
              state: value,
              zip,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks('state', value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks('state', state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, 'state')}
      ></TextField>
      <TextField
        label="Zip"
        isRequired={false}
        isReadOnly={false}
        defaultValue={zip}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name,
              address,
              address_2,
              city,
              state,
              zip: value,
              branch,
            };
            const result = onChange(modelFields);
            value = result?.zip ?? value;
          }
          if (errors.zip?.hasError) {
            runValidationTasks('zip', value);
          }
          setZip(value);
        }}
        onBlur={() => runValidationTasks('zip', zip)}
        errorMessage={errors.zip?.errorMessage}
        hasError={errors.zip?.hasError}
        {...getOverrideProps(overrides, 'zip')}
      ></TextField>
      <SelectField
        label="Branch"
        placeholder="Please select an option"
        isDisabled={false}
        value={branch}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              type,
              status,
              display_name,
              address,
              address_2,
              city,
              state,
              zip,
              branch: value,
            };
            const result = onChange(modelFields);
            value = result?.branch ?? value;
          }
          if (errors.branch?.hasError) {
            runValidationTasks('branch', value);
          }
          setBranch(value);
        }}
        onBlur={() => runValidationTasks('branch', branch)}
        errorMessage={errors.branch?.errorMessage}
        hasError={errors.branch?.hasError}
        {...getOverrideProps(overrides, 'branch')}
      >
        <option
          children="Airforce"
          value="AIRFORCE"
          {...getOverrideProps(overrides, 'branchoption0')}
        ></option>
        <option
          children="Coastguard"
          value="COASTGUARD"
          {...getOverrideProps(overrides, 'branchoption1')}
        ></option>
        <option
          children="Navy"
          value="NAVY"
          {...getOverrideProps(overrides, 'branchoption2')}
        ></option>
        <option
          children="Army"
          value="ARMY"
          {...getOverrideProps(overrides, 'branchoption3')}
        ></option>
        <option
          children="Marines"
          value="MARINES"
          {...getOverrideProps(overrides, 'branchoption4')}
        ></option>
      </SelectField>
      <Flex justifyContent="space-between" {...getOverrideProps(overrides, 'CTAFlex')}>
        <Button
          children="Reset"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, 'ResetButton')}
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
