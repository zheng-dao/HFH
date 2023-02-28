/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Patient } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function PatientCreateForm(props) {
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
    relationship: undefined,
  };
  const [first_name, setFirst_name] = React.useState(initialValues.first_name);
  const [middle_initial, setMiddle_initial] = React.useState(initialValues.middle_initial);
  const [last_name, setLast_name] = React.useState(initialValues.last_name);
  const [relationship, setRelationship] = React.useState(initialValues.relationship);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setFirst_name(initialValues.first_name);
    setMiddle_initial(initialValues.middle_initial);
    setLast_name(initialValues.last_name);
    setRelationship(initialValues.relationship);
    setErrors({});
  };
  const validations = {
    first_name: [],
    middle_initial: [],
    last_name: [],
    relationship: [],
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
          relationship,
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
          await DataStore.save(new Patient(modelFields));
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
      {...getOverrideProps(overrides, 'PatientCreateForm')}
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
              relationship,
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
              relationship,
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
              relationship,
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
      <SelectField
        label="Relationship"
        placeholder="Please select an option"
        isDisabled={false}
        value={relationship}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              middle_initial,
              last_name,
              relationship: value,
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
      >
        <option
          children="Aunt"
          value="AUNT"
          {...getOverrideProps(overrides, 'relationshipoption0')}
        ></option>
        <option
          children="Boyfriend"
          value="BOYFRIEND"
          {...getOverrideProps(overrides, 'relationshipoption1')}
        ></option>
        <option
          children="Brother"
          value="BROTHER"
          {...getOverrideProps(overrides, 'relationshipoption2')}
        ></option>
        <option
          children="Brotherinlaw"
          value="BROTHERINLAW"
          {...getOverrideProps(overrides, 'relationshipoption3')}
        ></option>
        <option
          children="Caregiver"
          value="CAREGIVER"
          {...getOverrideProps(overrides, 'relationshipoption4')}
        ></option>
        <option
          children="Cousin"
          value="COUSIN"
          {...getOverrideProps(overrides, 'relationshipoption5')}
        ></option>
        <option
          children="Daughter"
          value="DAUGHTER"
          {...getOverrideProps(overrides, 'relationshipoption6')}
        ></option>
        <option
          children="Daughterinlaw"
          value="DAUGHTERINLAW"
          {...getOverrideProps(overrides, 'relationshipoption7')}
        ></option>
        <option
          children="Exhusband"
          value="EXHUSBAND"
          {...getOverrideProps(overrides, 'relationshipoption8')}
        ></option>
        <option
          children="Exwife"
          value="EXWIFE"
          {...getOverrideProps(overrides, 'relationshipoption9')}
        ></option>
        <option
          children="Father"
          value="FATHER"
          {...getOverrideProps(overrides, 'relationshipoption10')}
        ></option>
        <option
          children="Fatherinlaw"
          value="FATHERINLAW"
          {...getOverrideProps(overrides, 'relationshipoption11')}
        ></option>
        <option
          children="Fiance"
          value="FIANCE"
          {...getOverrideProps(overrides, 'relationshipoption12')}
        ></option>
        <option
          children="Fiancee"
          value="FIANCEE"
          {...getOverrideProps(overrides, 'relationshipoption13')}
        ></option>
        <option
          children="Friend"
          value="FRIEND"
          {...getOverrideProps(overrides, 'relationshipoption14')}
        ></option>
        <option
          children="Girlfriend"
          value="GIRLFRIEND"
          {...getOverrideProps(overrides, 'relationshipoption15')}
        ></option>
        <option
          children="Grandchild"
          value="GRANDCHILD"
          {...getOverrideProps(overrides, 'relationshipoption16')}
        ></option>
        <option
          children="Grandfather"
          value="GRANDFATHER"
          {...getOverrideProps(overrides, 'relationshipoption17')}
        ></option>
        <option
          children="Grandmother"
          value="GRANDMOTHER"
          {...getOverrideProps(overrides, 'relationshipoption18')}
        ></option>
        <option
          children="Husband"
          value="HUSBAND"
          {...getOverrideProps(overrides, 'relationshipoption19')}
        ></option>
        <option
          children="Mother"
          value="MOTHER"
          {...getOverrideProps(overrides, 'relationshipoption20')}
        ></option>
        <option
          children="Motherinlaw"
          value="MOTHERINLAW"
          {...getOverrideProps(overrides, 'relationshipoption21')}
        ></option>
        <option
          children="Nephew"
          value="NEPHEW"
          {...getOverrideProps(overrides, 'relationshipoption22')}
        ></option>
        <option
          children="Niece"
          value="NIECE"
          {...getOverrideProps(overrides, 'relationshipoption23')}
        ></option>
        <option
          children="Nonmedicalassistant"
          value="NONMEDICALASSISTANT"
          {...getOverrideProps(overrides, 'relationshipoption24')}
        ></option>
        <option
          children="Self"
          value="SELF"
          {...getOverrideProps(overrides, 'relationshipoption25')}
        ></option>
        <option
          children="Sister"
          value="SISTER"
          {...getOverrideProps(overrides, 'relationshipoption26')}
        ></option>
        <option
          children="Sisterinlaw"
          value="SISTERINLAW"
          {...getOverrideProps(overrides, 'relationshipoption27')}
        ></option>
        <option
          children="Son"
          value="SON"
          {...getOverrideProps(overrides, 'relationshipoption28')}
        ></option>
        <option
          children="Stepdaughter"
          value="STEPDAUGHTER"
          {...getOverrideProps(overrides, 'relationshipoption29')}
        ></option>
        <option
          children="Stepson"
          value="STEPSON"
          {...getOverrideProps(overrides, 'relationshipoption30')}
        ></option>
        <option
          children="Uncle"
          value="UNCLE"
          {...getOverrideProps(overrides, 'relationshipoption31')}
        ></option>
        <option
          children="Wife"
          value="WIFE"
          {...getOverrideProps(overrides, 'relationshipoption32')}
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
