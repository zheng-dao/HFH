/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { User } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, SwitchField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function UserCreateForm(props) {
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
    username: undefined,
    first_name: undefined,
    last_name: undefined,
    middle_initial: undefined,
    telephone: undefined,
    signature: undefined,
    job: undefined,
    admin_approval: false,
    expiration_date: undefined,
    extension: undefined,
    affiliation: undefined,
    timezone: undefined,
    observes_dst: undefined,
    receive_emails: false,
    status: undefined,
    affiliation_type: undefined,
  };
  const [username, setUsername] = React.useState(initialValues.username);
  const [first_name, setFirst_name] = React.useState(initialValues.first_name);
  const [last_name, setLast_name] = React.useState(initialValues.last_name);
  const [middle_initial, setMiddle_initial] = React.useState(initialValues.middle_initial);
  const [telephone, setTelephone] = React.useState(initialValues.telephone);
  const [signature, setSignature] = React.useState(initialValues.signature);
  const [job, setJob] = React.useState(initialValues.job);
  const [admin_approval, setAdmin_approval] = React.useState(initialValues.admin_approval);
  const [expiration_date, setExpiration_date] = React.useState(initialValues.expiration_date);
  const [extension, setExtension] = React.useState(initialValues.extension);
  const [affiliation, setAffiliation] = React.useState(initialValues.affiliation);
  const [timezone, setTimezone] = React.useState(initialValues.timezone);
  const [observes_dst, setObserves_dst] = React.useState(initialValues.observes_dst);
  const [receive_emails, setReceive_emails] = React.useState(initialValues.receive_emails);
  const [status, setStatus] = React.useState(initialValues.status);
  const [affiliation_type, setAffiliation_type] = React.useState(initialValues.affiliation_type);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUsername(initialValues.username);
    setFirst_name(initialValues.first_name);
    setLast_name(initialValues.last_name);
    setMiddle_initial(initialValues.middle_initial);
    setTelephone(initialValues.telephone);
    setSignature(initialValues.signature);
    setJob(initialValues.job);
    setAdmin_approval(initialValues.admin_approval);
    setExpiration_date(initialValues.expiration_date);
    setExtension(initialValues.extension);
    setAffiliation(initialValues.affiliation);
    setTimezone(initialValues.timezone);
    setObserves_dst(initialValues.observes_dst);
    setReceive_emails(initialValues.receive_emails);
    setStatus(initialValues.status);
    setAffiliation_type(initialValues.affiliation_type);
    setErrors({});
  };
  const validations = {
    username: [],
    first_name: [],
    last_name: [],
    middle_initial: [],
    telephone: [],
    signature: [],
    job: [],
    admin_approval: [],
    expiration_date: [],
    extension: [],
    affiliation: [],
    timezone: [],
    observes_dst: [],
    receive_emails: [],
    status: [],
    affiliation_type: [],
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
          username,
          first_name,
          last_name,
          middle_initial,
          telephone,
          signature,
          job,
          admin_approval,
          expiration_date,
          extension,
          affiliation,
          timezone,
          observes_dst,
          receive_emails,
          status,
          affiliation_type,
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
          await DataStore.save(new User(modelFields));
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
      {...getOverrideProps(overrides, 'UserCreateForm')}
    >
      <TextField
        label="Username"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username: value,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.username ?? value;
          }
          if (errors.username?.hasError) {
            runValidationTasks('username', value);
          }
          setUsername(value);
        }}
        onBlur={() => runValidationTasks('username', username)}
        errorMessage={errors.username?.errorMessage}
        hasError={errors.username?.hasError}
        {...getOverrideProps(overrides, 'username')}
      ></TextField>
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name: value,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
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
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name: value,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
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
        label="Middle initial"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial: value,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
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
        label="Telephone"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone: value,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
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
        label="Signature"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature: value,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.signature ?? value;
          }
          if (errors.signature?.hasError) {
            runValidationTasks('signature', value);
          }
          setSignature(value);
        }}
        onBlur={() => runValidationTasks('signature', signature)}
        errorMessage={errors.signature?.errorMessage}
        hasError={errors.signature?.hasError}
        {...getOverrideProps(overrides, 'signature')}
      ></TextField>
      <TextField
        label="Job"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job: value,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.job ?? value;
          }
          if (errors.job?.hasError) {
            runValidationTasks('job', value);
          }
          setJob(value);
        }}
        onBlur={() => runValidationTasks('job', job)}
        errorMessage={errors.job?.errorMessage}
        hasError={errors.job?.hasError}
        {...getOverrideProps(overrides, 'job')}
      ></TextField>
      <SwitchField
        label="Admin approval"
        defaultChecked={false}
        isDisabled={false}
        isChecked={admin_approval}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval: value,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.admin_approval ?? value;
          }
          if (errors.admin_approval?.hasError) {
            runValidationTasks('admin_approval', value);
          }
          setAdmin_approval(value);
        }}
        onBlur={() => runValidationTasks('admin_approval', admin_approval)}
        errorMessage={errors.admin_approval?.errorMessage}
        hasError={errors.admin_approval?.hasError}
        {...getOverrideProps(overrides, 'admin_approval')}
      ></SwitchField>
      <TextField
        label="Expiration date"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date: value,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.expiration_date ?? value;
          }
          if (errors.expiration_date?.hasError) {
            runValidationTasks('expiration_date', value);
          }
          setExpiration_date(new Date(value).toISOString());
        }}
        onBlur={() => runValidationTasks('expiration_date', expiration_date)}
        errorMessage={errors.expiration_date?.errorMessage}
        hasError={errors.expiration_date?.hasError}
        {...getOverrideProps(overrides, 'expiration_date')}
      ></TextField>
      <TextField
        label="Extension"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension: value,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
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
      <TextField
        label="Affiliation"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation: value,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.affiliation ?? value;
          }
          if (errors.affiliation?.hasError) {
            runValidationTasks('affiliation', value);
          }
          setAffiliation(value);
        }}
        onBlur={() => runValidationTasks('affiliation', affiliation)}
        errorMessage={errors.affiliation?.errorMessage}
        hasError={errors.affiliation?.hasError}
        {...getOverrideProps(overrides, 'affiliation')}
      ></TextField>
      <SelectField
        label="Timezone"
        placeholder="Please select an option"
        isDisabled={false}
        value={timezone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone: value,
              observes_dst,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.timezone ?? value;
          }
          if (errors.timezone?.hasError) {
            runValidationTasks('timezone', value);
          }
          setTimezone(value);
        }}
        onBlur={() => runValidationTasks('timezone', timezone)}
        errorMessage={errors.timezone?.errorMessage}
        hasError={errors.timezone?.hasError}
        {...getOverrideProps(overrides, 'timezone')}
      >
        <option
          children="Eastern"
          value="EASTERN"
          {...getOverrideProps(overrides, 'timezoneoption0')}
        ></option>
        <option
          children="Central"
          value="CENTRAL"
          {...getOverrideProps(overrides, 'timezoneoption1')}
        ></option>
        <option
          children="Mountain"
          value="MOUNTAIN"
          {...getOverrideProps(overrides, 'timezoneoption2')}
        ></option>
        <option
          children="Pacific"
          value="PACIFIC"
          {...getOverrideProps(overrides, 'timezoneoption3')}
        ></option>
      </SelectField>
      <TextField
        label="Observes dst"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst: value,
              receive_emails,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.observes_dst ?? value;
          }
          if (errors.observes_dst?.hasError) {
            runValidationTasks('observes_dst', value);
          }
          setObserves_dst(value);
        }}
        onBlur={() => runValidationTasks('observes_dst', observes_dst)}
        errorMessage={errors.observes_dst?.errorMessage}
        hasError={errors.observes_dst?.hasError}
        {...getOverrideProps(overrides, 'observes_dst')}
      ></TextField>
      <SwitchField
        label="Receive emails"
        defaultChecked={false}
        isDisabled={false}
        isChecked={receive_emails}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails: value,
              status,
              affiliation_type,
            };
            const result = onChange(modelFields);
            value = result?.receive_emails ?? value;
          }
          if (errors.receive_emails?.hasError) {
            runValidationTasks('receive_emails', value);
          }
          setReceive_emails(value);
        }}
        onBlur={() => runValidationTasks('receive_emails', receive_emails)}
        errorMessage={errors.receive_emails?.errorMessage}
        hasError={errors.receive_emails?.hasError}
        {...getOverrideProps(overrides, 'receive_emails')}
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
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status: value,
              affiliation_type,
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
          children="Inactive"
          value="INACTIVE"
          {...getOverrideProps(overrides, 'statusoption3')}
        ></option>
      </SelectField>
      <SelectField
        label="Affiliation type"
        placeholder="Please select an option"
        isDisabled={false}
        value={affiliation_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              username,
              first_name,
              last_name,
              middle_initial,
              telephone,
              signature,
              job,
              admin_approval,
              expiration_date,
              extension,
              affiliation,
              timezone,
              observes_dst,
              receive_emails,
              status,
              affiliation_type: value,
            };
            const result = onChange(modelFields);
            value = result?.affiliation_type ?? value;
          }
          if (errors.affiliation_type?.hasError) {
            runValidationTasks('affiliation_type', value);
          }
          setAffiliation_type(value);
        }}
        onBlur={() => runValidationTasks('affiliation_type', affiliation_type)}
        errorMessage={errors.affiliation_type?.errorMessage}
        hasError={errors.affiliation_type?.hasError}
        {...getOverrideProps(overrides, 'affiliation_type')}
      >
        <option
          children="Fisherhouse"
          value="FISHERHOUSE"
          {...getOverrideProps(overrides, 'affiliation_typeoption0')}
        ></option>
        <option
          children="Medicalcenter"
          value="MEDICALCENTER"
          {...getOverrideProps(overrides, 'affiliation_typeoption1')}
        ></option>
        <option
          children="Base"
          value="BASE"
          {...getOverrideProps(overrides, 'affiliation_typeoption2')}
        ></option>
        <option
          children="Organization"
          value="ORGANIZATION"
          {...getOverrideProps(overrides, 'affiliation_typeoption3')}
        ></option>
      </SelectField>
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
