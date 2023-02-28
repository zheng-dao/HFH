/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { HotelProperty } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, SwitchField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function HotelPropertyCreateForm(props) {
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
    name: undefined,
    address: undefined,
    address_2: undefined,
    city: undefined,
    state: undefined,
    zip: undefined,
    contact_name: undefined,
    contact_position: undefined,
    telephone: undefined,
    email: undefined,
    is_blacklist: false,
    status: undefined,
    extension: undefined,
  };
  const [name, setName] = React.useState(initialValues.name);
  const [address, setAddress] = React.useState(initialValues.address);
  const [address_2, setAddress_2] = React.useState(initialValues.address_2);
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [zip, setZip] = React.useState(initialValues.zip);
  const [contact_name, setContact_name] = React.useState(initialValues.contact_name);
  const [contact_position, setContact_position] = React.useState(initialValues.contact_position);
  const [telephone, setTelephone] = React.useState(initialValues.telephone);
  const [email, setEmail] = React.useState(initialValues.email);
  const [is_blacklist, setIs_blacklist] = React.useState(initialValues.is_blacklist);
  const [status, setStatus] = React.useState(initialValues.status);
  const [extension, setExtension] = React.useState(initialValues.extension);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setAddress(initialValues.address);
    setAddress_2(initialValues.address_2);
    setCity(initialValues.city);
    setState(initialValues.state);
    setZip(initialValues.zip);
    setContact_name(initialValues.contact_name);
    setContact_position(initialValues.contact_position);
    setTelephone(initialValues.telephone);
    setEmail(initialValues.email);
    setIs_blacklist(initialValues.is_blacklist);
    setStatus(initialValues.status);
    setExtension(initialValues.extension);
    setErrors({});
  };
  const validations = {
    name: [],
    address: [],
    address_2: [],
    city: [],
    state: [],
    zip: [],
    contact_name: [],
    contact_position: [],
    telephone: [],
    email: [],
    is_blacklist: [],
    status: [],
    extension: [],
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
          address,
          address_2,
          city,
          state,
          zip,
          contact_name,
          contact_position,
          telephone,
          email,
          is_blacklist,
          status,
          extension,
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
          await DataStore.save(new HotelProperty(modelFields));
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
      {...getOverrideProps(overrides, 'HotelPropertyCreateForm')}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
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
      <TextField
        label="Address"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address: value,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2: value,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city: value,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state: value,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
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
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip: value,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
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
      <TextField
        label="Contact name"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name: value,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
            };
            const result = onChange(modelFields);
            value = result?.contact_name ?? value;
          }
          if (errors.contact_name?.hasError) {
            runValidationTasks('contact_name', value);
          }
          setContact_name(value);
        }}
        onBlur={() => runValidationTasks('contact_name', contact_name)}
        errorMessage={errors.contact_name?.errorMessage}
        hasError={errors.contact_name?.hasError}
        {...getOverrideProps(overrides, 'contact_name')}
      ></TextField>
      <TextField
        label="Contact position"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position: value,
              telephone,
              email,
              is_blacklist,
              status,
              extension,
            };
            const result = onChange(modelFields);
            value = result?.contact_position ?? value;
          }
          if (errors.contact_position?.hasError) {
            runValidationTasks('contact_position', value);
          }
          setContact_position(value);
        }}
        onBlur={() => runValidationTasks('contact_position', contact_position)}
        errorMessage={errors.contact_position?.errorMessage}
        hasError={errors.contact_position?.hasError}
        {...getOverrideProps(overrides, 'contact_position')}
      ></TextField>
      <TextField
        label="Telephone"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone: value,
              email,
              is_blacklist,
              status,
              extension,
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
        label="Email"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email: value,
              is_blacklist,
              status,
              extension,
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
      <SwitchField
        label="Is blacklist"
        defaultChecked={false}
        isDisabled={false}
        isChecked={is_blacklist}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist: value,
              status,
              extension,
            };
            const result = onChange(modelFields);
            value = result?.is_blacklist ?? value;
          }
          if (errors.is_blacklist?.hasError) {
            runValidationTasks('is_blacklist', value);
          }
          setIs_blacklist(value);
        }}
        onBlur={() => runValidationTasks('is_blacklist', is_blacklist)}
        errorMessage={errors.is_blacklist?.errorMessage}
        hasError={errors.is_blacklist?.hasError}
        {...getOverrideProps(overrides, 'is_blacklist')}
      ></SwitchField>
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
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status: value,
              extension,
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
        <option
          children="Blacklisted"
          value="BLACKLISTED"
          {...getOverrideProps(overrides, 'statusoption4')}
        ></option>
      </SelectField>
      <TextField
        label="Extension"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              address,
              address_2,
              city,
              state,
              zip,
              contact_name,
              contact_position,
              telephone,
              email,
              is_blacklist,
              status,
              extension: value,
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
