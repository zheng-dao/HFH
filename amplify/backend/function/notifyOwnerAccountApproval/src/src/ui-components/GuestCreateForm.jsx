/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Guest } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, SwitchField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function GuestCreateForm(props) {
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
    relationship: undefined,
    middle_initial: undefined,
    last_name: undefined,
    email: undefined,
    telephone: undefined,
    extension: undefined,
    type: undefined,
    under_age_three: false,
  };
  const [first_name, setFirst_name] = React.useState(initialValues.first_name);
  const [relationship, setRelationship] = React.useState(initialValues.relationship);
  const [middle_initial, setMiddle_initial] = React.useState(initialValues.middle_initial);
  const [last_name, setLast_name] = React.useState(initialValues.last_name);
  const [email, setEmail] = React.useState(initialValues.email);
  const [telephone, setTelephone] = React.useState(initialValues.telephone);
  const [extension, setExtension] = React.useState(initialValues.extension);
  const [type, setType] = React.useState(initialValues.type);
  const [under_age_three, setUnder_age_three] = React.useState(initialValues.under_age_three);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirst_name(initialValues.first_name);
    setRelationship(initialValues.relationship);
    setMiddle_initial(initialValues.middle_initial);
    setLast_name(initialValues.last_name);
    setEmail(initialValues.email);
    setTelephone(initialValues.telephone);
    setExtension(initialValues.extension);
    setType(initialValues.type);
    setUnder_age_three(initialValues.under_age_three);
    setErrors({});
  };
  const validations = {
    first_name: [],
    relationship: [],
    middle_initial: [],
    last_name: [],
    email: [],
    telephone: [],
    extension: [],
    type: [],
    under_age_three: [],
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
          relationship,
          middle_initial,
          last_name,
          email,
          telephone,
          extension,
          type,
          under_age_three,
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
          await DataStore.save(new Guest(modelFields));
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
      {...getOverrideProps(overrides, 'GuestCreateForm')}
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
              relationship,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              type,
              under_age_three,
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
        label="Relationship"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              relationship: value,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              type,
              under_age_three,
            };
            const result = onChange(modelFields);
            value = result?.relationship ?? value;
          }
          if (errors.relationship?.hasError) {
            runValidationTasks('relationship', value);
          }
          setRelationship(value);
        }}
        onBlur={() => runValidationTasks('relationship', relationship)}
        errorMessage={errors.relationship?.errorMessage}
        hasError={errors.relationship?.hasError}
        {...getOverrideProps(overrides, 'relationship')}
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
              relationship,
              middle_initial: value,
              last_name,
              email,
              telephone,
              extension,
              type,
              under_age_three,
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
              relationship,
              middle_initial,
              last_name: value,
              email,
              telephone,
              extension,
              type,
              under_age_three,
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
              relationship,
              middle_initial,
              last_name,
              email: value,
              telephone,
              extension,
              type,
              under_age_three,
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
              relationship,
              middle_initial,
              last_name,
              email,
              telephone: value,
              extension,
              type,
              under_age_three,
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
              relationship,
              middle_initial,
              last_name,
              email,
              telephone,
              extension: value,
              type,
              under_age_three,
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
        label="Type"
        placeholder="Please select an option"
        isDisabled={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              relationship,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              type: value,
              under_age_three,
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
          children="Primary"
          value="PRIMARY"
          {...getOverrideProps(overrides, 'typeoption0')}
        ></option>
        <option
          children="Additional"
          value="ADDITIONAL"
          {...getOverrideProps(overrides, 'typeoption1')}
        ></option>
      </SelectField>
      <SwitchField
        label="Under age three"
        defaultChecked={false}
        isDisabled={false}
        isChecked={under_age_three}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              first_name,
              relationship,
              middle_initial,
              last_name,
              email,
              telephone,
              extension,
              type,
              under_age_three: value,
            };
            const result = onChange(modelFields);
            value = result?.under_age_three ?? value;
          }
          if (errors.under_age_three?.hasError) {
            runValidationTasks('under_age_three', value);
          }
          setUnder_age_three(value);
        }}
        onBlur={() => runValidationTasks('under_age_three', under_age_three)}
        errorMessage={errors.under_age_three?.errorMessage}
        hasError={errors.under_age_three?.hasError}
        {...getOverrideProps(overrides, 'under_age_three')}
      ></SwitchField>
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
