/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Application } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, SwitchField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function ApplicationUpdateForm(props) {
  const {
    id,
    application,
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
    status: undefined,
    liaison_read: undefined,
    admin_read: undefined,
    exception_narrative: undefined,
    liaison_terms_of_use_agreement: false,
    sm_terms_of_use_agreement: false,
  };
  const [status, setStatus] = React.useState(initialValues.status);
  const [liaison_read, setLiaison_read] = React.useState(initialValues.liaison_read);
  const [admin_read, setAdmin_read] = React.useState(initialValues.admin_read);
  const [exception_narrative, setException_narrative] = React.useState(
    initialValues.exception_narrative
  );
  const [liaison_terms_of_use_agreement, setLiaison_terms_of_use_agreement] = React.useState(
    initialValues.liaison_terms_of_use_agreement
  );
  const [sm_terms_of_use_agreement, setSm_terms_of_use_agreement] = React.useState(
    initialValues.sm_terms_of_use_agreement
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = { ...initialValues, ...applicationRecord };
    setStatus(cleanValues.status);
    setLiaison_read(cleanValues.liaison_read);
    setAdmin_read(cleanValues.admin_read);
    setException_narrative(cleanValues.exception_narrative);
    setLiaison_terms_of_use_agreement(cleanValues.liaison_terms_of_use_agreement);
    setSm_terms_of_use_agreement(cleanValues.sm_terms_of_use_agreement);
    setErrors({});
  };
  const [applicationRecord, setApplicationRecord] = React.useState(application);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(Application, id) : application;
      setApplicationRecord(record);
    };
    queryData();
  }, [id, application]);
  React.useEffect(resetStateValues, [applicationRecord]);
  const validations = {
    status: [],
    liaison_read: [],
    admin_read: [],
    exception_narrative: [],
    liaison_terms_of_use_agreement: [],
    sm_terms_of_use_agreement: [],
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
          status,
          liaison_read,
          admin_read,
          exception_narrative,
          liaison_terms_of_use_agreement,
          sm_terms_of_use_agreement,
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
            Application.copyOf(applicationRecord, (updated) => {
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
      {...getOverrideProps(overrides, 'ApplicationUpdateForm')}
    >
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status: value,
              liaison_read,
              admin_read,
              exception_narrative,
              liaison_terms_of_use_agreement,
              sm_terms_of_use_agreement,
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
          children="Requested"
          value="REQUESTED"
          {...getOverrideProps(overrides, 'statusoption0')}
        ></option>
        <option
          children="Exception"
          value="EXCEPTION"
          {...getOverrideProps(overrides, 'statusoption1')}
        ></option>
        <option
          children="Approved"
          value="APPROVED"
          {...getOverrideProps(overrides, 'statusoption2')}
        ></option>
        <option
          children="Completed"
          value="COMPLETED"
          {...getOverrideProps(overrides, 'statusoption3')}
        ></option>
        <option
          children="Draft"
          value="DRAFT"
          {...getOverrideProps(overrides, 'statusoption4')}
        ></option>
        <option
          children="Returned"
          value="RETURNED"
          {...getOverrideProps(overrides, 'statusoption5')}
        ></option>
        <option
          children="Declined"
          value="DECLINED"
          {...getOverrideProps(overrides, 'statusoption6')}
        ></option>
      </SelectField>
      <SelectField
        label="Liaison read"
        placeholder="Please select an option"
        isDisabled={false}
        value={liaison_read}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              liaison_read: value,
              admin_read,
              exception_narrative,
              liaison_terms_of_use_agreement,
              sm_terms_of_use_agreement,
            };
            const result = onChange(modelFields);
            value = result?.liaison_read ?? value;
          }
          if (errors.liaison_read?.hasError) {
            runValidationTasks('liaison_read', value);
          }
          setLiaison_read(value);
        }}
        onBlur={() => runValidationTasks('liaison_read', liaison_read)}
        errorMessage={errors.liaison_read?.errorMessage}
        hasError={errors.liaison_read?.hasError}
        {...getOverrideProps(overrides, 'liaison_read')}
      >
        <option
          children="Read"
          value="READ"
          {...getOverrideProps(overrides, 'liaison_readoption0')}
        ></option>
        <option
          children="Unread"
          value="UNREAD"
          {...getOverrideProps(overrides, 'liaison_readoption1')}
        ></option>
      </SelectField>
      <SelectField
        label="Admin read"
        placeholder="Please select an option"
        isDisabled={false}
        value={admin_read}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              liaison_read,
              admin_read: value,
              exception_narrative,
              liaison_terms_of_use_agreement,
              sm_terms_of_use_agreement,
            };
            const result = onChange(modelFields);
            value = result?.admin_read ?? value;
          }
          if (errors.admin_read?.hasError) {
            runValidationTasks('admin_read', value);
          }
          setAdmin_read(value);
        }}
        onBlur={() => runValidationTasks('admin_read', admin_read)}
        errorMessage={errors.admin_read?.errorMessage}
        hasError={errors.admin_read?.hasError}
        {...getOverrideProps(overrides, 'admin_read')}
      >
        <option
          children="Read"
          value="READ"
          {...getOverrideProps(overrides, 'admin_readoption0')}
        ></option>
        <option
          children="Unread"
          value="UNREAD"
          {...getOverrideProps(overrides, 'admin_readoption1')}
        ></option>
      </SelectField>
      <TextField
        label="Exception narrative"
        isRequired={false}
        isReadOnly={false}
        defaultValue={exception_narrative}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              status,
              liaison_read,
              admin_read,
              exception_narrative: value,
              liaison_terms_of_use_agreement,
              sm_terms_of_use_agreement,
            };
            const result = onChange(modelFields);
            value = result?.exception_narrative ?? value;
          }
          if (errors.exception_narrative?.hasError) {
            runValidationTasks('exception_narrative', value);
          }
          setException_narrative(value);
        }}
        onBlur={() => runValidationTasks('exception_narrative', exception_narrative)}
        errorMessage={errors.exception_narrative?.errorMessage}
        hasError={errors.exception_narrative?.hasError}
        {...getOverrideProps(overrides, 'exception_narrative')}
      ></TextField>
      <SwitchField
        label="Liaison terms of use agreement"
        defaultChecked={false}
        isDisabled={false}
        isChecked={liaison_terms_of_use_agreement}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              status,
              liaison_read,
              admin_read,
              exception_narrative,
              liaison_terms_of_use_agreement: value,
              sm_terms_of_use_agreement,
            };
            const result = onChange(modelFields);
            value = result?.liaison_terms_of_use_agreement ?? value;
          }
          if (errors.liaison_terms_of_use_agreement?.hasError) {
            runValidationTasks('liaison_terms_of_use_agreement', value);
          }
          setLiaison_terms_of_use_agreement(value);
        }}
        onBlur={() =>
          runValidationTasks('liaison_terms_of_use_agreement', liaison_terms_of_use_agreement)
        }
        errorMessage={errors.liaison_terms_of_use_agreement?.errorMessage}
        hasError={errors.liaison_terms_of_use_agreement?.hasError}
        {...getOverrideProps(overrides, 'liaison_terms_of_use_agreement')}
      ></SwitchField>
      <SwitchField
        label="Sm terms of use agreement"
        defaultChecked={false}
        isDisabled={false}
        isChecked={sm_terms_of_use_agreement}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              status,
              liaison_read,
              admin_read,
              exception_narrative,
              liaison_terms_of_use_agreement,
              sm_terms_of_use_agreement: value,
            };
            const result = onChange(modelFields);
            value = result?.sm_terms_of_use_agreement ?? value;
          }
          if (errors.sm_terms_of_use_agreement?.hasError) {
            runValidationTasks('sm_terms_of_use_agreement', value);
          }
          setSm_terms_of_use_agreement(value);
        }}
        onBlur={() => runValidationTasks('sm_terms_of_use_agreement', sm_terms_of_use_agreement)}
        errorMessage={errors.sm_terms_of_use_agreement?.errorMessage}
        hasError={errors.sm_terms_of_use_agreement?.hasError}
        {...getOverrideProps(overrides, 'sm_terms_of_use_agreement')}
      ></SwitchField>
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
