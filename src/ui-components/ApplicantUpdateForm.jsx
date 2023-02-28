/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Applicant } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import { Button, Flex, Grid, SelectField, SwitchField, TextField } from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
export default function ApplicantUpdateForm(props) {
  const {
    id,
    applicant,
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
    last_name: undefined,
    email: undefined,
    telephone: undefined,
    signature: undefined,
    job: undefined,
    branch_of_service: undefined,
    current_status: undefined,
    base_assigned_to: undefined,
    relation_to_service_member: undefined,
    referrer_date: undefined,
    user_type: undefined,
    middle_initial: undefined,
    patient_type: undefined,
    extension: undefined,
    family_lodge: undefined,
    location_name: undefined,
    location_address: undefined,
    lodging_explanation: undefined,
    affiliation_type: undefined,
    collected_outside_fisherhouse: false,
  };
  const [first_name, setFirst_name] = React.useState(initialValues.first_name);
  const [last_name, setLast_name] = React.useState(initialValues.last_name);
  const [email, setEmail] = React.useState(initialValues.email);
  const [telephone, setTelephone] = React.useState(initialValues.telephone);
  const [signature, setSignature] = React.useState(initialValues.signature);
  const [job, setJob] = React.useState(initialValues.job);
  const [branch_of_service, setBranch_of_service] = React.useState(initialValues.branch_of_service);
  const [current_status, setCurrent_status] = React.useState(initialValues.current_status);
  const [base_assigned_to, setBase_assigned_to] = React.useState(initialValues.base_assigned_to);
  const [relation_to_service_member, setRelation_to_service_member] = React.useState(
    initialValues.relation_to_service_member
  );
  const [referrer_date, setReferrer_date] = React.useState(initialValues.referrer_date);
  const [user_type, setUser_type] = React.useState(initialValues.user_type);
  const [middle_initial, setMiddle_initial] = React.useState(initialValues.middle_initial);
  const [patient_type, setPatient_type] = React.useState(initialValues.patient_type);
  const [extension, setExtension] = React.useState(initialValues.extension);
  const [family_lodge, setFamily_lodge] = React.useState(initialValues.family_lodge);
  const [location_name, setLocation_name] = React.useState(initialValues.location_name);
  const [location_address, setLocation_address] = React.useState(initialValues.location_address);
  const [lodging_explanation, setLodging_explanation] = React.useState(
    initialValues.lodging_explanation
  );
  const [affiliation_type, setAffiliation_type] = React.useState(initialValues.affiliation_type);
  const [collected_outside_fisherhouse, setCollected_outside_fisherhouse] = React.useState(
    initialValues.collected_outside_fisherhouse
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = { ...initialValues, ...applicantRecord };
    setFirst_name(cleanValues.first_name);
    setLast_name(cleanValues.last_name);
    setEmail(cleanValues.email);
    setTelephone(cleanValues.telephone);
    setSignature(cleanValues.signature);
    setJob(cleanValues.job);
    setBranch_of_service(cleanValues.branch_of_service);
    setCurrent_status(cleanValues.current_status);
    setBase_assigned_to(cleanValues.base_assigned_to);
    setRelation_to_service_member(cleanValues.relation_to_service_member);
    setReferrer_date(cleanValues.referrer_date);
    setUser_type(cleanValues.user_type);
    setMiddle_initial(cleanValues.middle_initial);
    setPatient_type(cleanValues.patient_type);
    setExtension(cleanValues.extension);
    setFamily_lodge(cleanValues.family_lodge);
    setLocation_name(cleanValues.location_name);
    setLocation_address(cleanValues.location_address);
    setLodging_explanation(cleanValues.lodging_explanation);
    setAffiliation_type(cleanValues.affiliation_type);
    setCollected_outside_fisherhouse(cleanValues.collected_outside_fisherhouse);
    setErrors({});
  };
  const [applicantRecord, setApplicantRecord] = React.useState(applicant);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(Applicant, id) : applicant;
      setApplicantRecord(record);
    };
    queryData();
  }, [id, applicant]);
  React.useEffect(resetStateValues, [applicantRecord]);
  const validations = {
    first_name: [],
    last_name: [],
    email: [],
    telephone: [],
    signature: [],
    job: [],
    branch_of_service: [],
    current_status: [],
    base_assigned_to: [],
    relation_to_service_member: [],
    referrer_date: [],
    user_type: [],
    middle_initial: [],
    patient_type: [],
    extension: [],
    family_lodge: [],
    location_name: [],
    location_address: [],
    lodging_explanation: [],
    affiliation_type: [],
    collected_outside_fisherhouse: [],
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
          last_name,
          email,
          telephone,
          signature,
          job,
          branch_of_service,
          current_status,
          base_assigned_to,
          relation_to_service_member,
          referrer_date,
          user_type,
          middle_initial,
          patient_type,
          extension,
          family_lodge,
          location_name,
          location_address,
          lodging_explanation,
          affiliation_type,
          collected_outside_fisherhouse,
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
            Applicant.copyOf(applicantRecord, (updated) => {
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
      {...getOverrideProps(overrides, 'ApplicantUpdateForm')}
    >
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        defaultValue={first_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name: value,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        defaultValue={last_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name: value,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        defaultValue={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email: value,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        defaultValue={telephone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone: value,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        defaultValue={signature}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature: value,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        defaultValue={job}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job: value,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
      <TextField
        label="Branch of service"
        isRequired={false}
        isReadOnly={false}
        defaultValue={branch_of_service}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service: value,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
      ></TextField>
      <TextField
        label="Current status"
        isRequired={false}
        isReadOnly={false}
        defaultValue={current_status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status: value,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
      ></TextField>
      <TextField
        label="Base assigned to"
        isRequired={false}
        isReadOnly={false}
        defaultValue={base_assigned_to}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to: value,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.base_assigned_to ?? value;
          }
          if (errors.base_assigned_to?.hasError) {
            runValidationTasks('base_assigned_to', value);
          }
          setBase_assigned_to(value);
        }}
        onBlur={() => runValidationTasks('base_assigned_to', base_assigned_to)}
        errorMessage={errors.base_assigned_to?.errorMessage}
        hasError={errors.base_assigned_to?.hasError}
        {...getOverrideProps(overrides, 'base_assigned_to')}
      ></TextField>
      <TextField
        label="Relation to service member"
        isRequired={false}
        isReadOnly={false}
        defaultValue={relation_to_service_member}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member: value,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.relation_to_service_member ?? value;
          }
          if (errors.relation_to_service_member?.hasError) {
            runValidationTasks('relation_to_service_member', value);
          }
          setRelation_to_service_member(value);
        }}
        onBlur={() => runValidationTasks('relation_to_service_member', relation_to_service_member)}
        errorMessage={errors.relation_to_service_member?.errorMessage}
        hasError={errors.relation_to_service_member?.hasError}
        {...getOverrideProps(overrides, 'relation_to_service_member')}
      ></TextField>
      <TextField
        label="Referrer date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        defaultValue={referrer_date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date: value,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.referrer_date ?? value;
          }
          if (errors.referrer_date?.hasError) {
            runValidationTasks('referrer_date', value);
          }
          setReferrer_date(value);
        }}
        onBlur={() => runValidationTasks('referrer_date', referrer_date)}
        errorMessage={errors.referrer_date?.errorMessage}
        hasError={errors.referrer_date?.hasError}
        {...getOverrideProps(overrides, 'referrer_date')}
      ></TextField>
      <TextField
        label="User type"
        isRequired={false}
        isReadOnly={false}
        defaultValue={user_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type: value,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.user_type ?? value;
          }
          if (errors.user_type?.hasError) {
            runValidationTasks('user_type', value);
          }
          setUser_type(value);
        }}
        onBlur={() => runValidationTasks('user_type', user_type)}
        errorMessage={errors.user_type?.errorMessage}
        hasError={errors.user_type?.hasError}
        {...getOverrideProps(overrides, 'user_type')}
      ></TextField>
      <TextField
        label="Middle initial"
        isRequired={false}
        isReadOnly={false}
        defaultValue={middle_initial}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial: value,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        label="Patient type"
        isRequired={false}
        isReadOnly={false}
        defaultValue={patient_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type: value,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.patient_type ?? value;
          }
          if (errors.patient_type?.hasError) {
            runValidationTasks('patient_type', value);
          }
          setPatient_type(value);
        }}
        onBlur={() => runValidationTasks('patient_type', patient_type)}
        errorMessage={errors.patient_type?.errorMessage}
        hasError={errors.patient_type?.hasError}
        {...getOverrideProps(overrides, 'patient_type')}
      ></TextField>
      <TextField
        label="Extension"
        isRequired={false}
        isReadOnly={false}
        defaultValue={extension}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension: value,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
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
        label="Family lodge"
        isRequired={false}
        isReadOnly={false}
        defaultValue={family_lodge}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge: value,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.family_lodge ?? value;
          }
          if (errors.family_lodge?.hasError) {
            runValidationTasks('family_lodge', value);
          }
          setFamily_lodge(value);
        }}
        onBlur={() => runValidationTasks('family_lodge', family_lodge)}
        errorMessage={errors.family_lodge?.errorMessage}
        hasError={errors.family_lodge?.hasError}
        {...getOverrideProps(overrides, 'family_lodge')}
      ></TextField>
      <TextField
        label="Location name"
        isRequired={false}
        isReadOnly={false}
        defaultValue={location_name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name: value,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.location_name ?? value;
          }
          if (errors.location_name?.hasError) {
            runValidationTasks('location_name', value);
          }
          setLocation_name(value);
        }}
        onBlur={() => runValidationTasks('location_name', location_name)}
        errorMessage={errors.location_name?.errorMessage}
        hasError={errors.location_name?.hasError}
        {...getOverrideProps(overrides, 'location_name')}
      ></TextField>
      <TextField
        label="Location address"
        isRequired={false}
        isReadOnly={false}
        defaultValue={location_address}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address: value,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse,
            };
            const result = onChange(modelFields);
            value = result?.location_address ?? value;
          }
          if (errors.location_address?.hasError) {
            runValidationTasks('location_address', value);
          }
          setLocation_address(value);
        }}
        onBlur={() => runValidationTasks('location_address', location_address)}
        errorMessage={errors.location_address?.errorMessage}
        hasError={errors.location_address?.hasError}
        {...getOverrideProps(overrides, 'location_address')}
      ></TextField>
      <TextField
        label="Lodging explanation"
        isRequired={false}
        isReadOnly={false}
        defaultValue={lodging_explanation}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation: value,
              affiliation_type,
              collected_outside_fisherhouse,
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
      <SelectField
        label="Affiliation type"
        placeholder="Please select an option"
        isDisabled={false}
        value={affiliation_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type: value,
              collected_outside_fisherhouse,
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
      <SwitchField
        label="Collected outside fisherhouse"
        defaultChecked={false}
        isDisabled={false}
        isChecked={collected_outside_fisherhouse}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              first_name,
              last_name,
              email,
              telephone,
              signature,
              job,
              branch_of_service,
              current_status,
              base_assigned_to,
              relation_to_service_member,
              referrer_date,
              user_type,
              middle_initial,
              patient_type,
              extension,
              family_lodge,
              location_name,
              location_address,
              lodging_explanation,
              affiliation_type,
              collected_outside_fisherhouse: value,
            };
            const result = onChange(modelFields);
            value = result?.collected_outside_fisherhouse ?? value;
          }
          if (errors.collected_outside_fisherhouse?.hasError) {
            runValidationTasks('collected_outside_fisherhouse', value);
          }
          setCollected_outside_fisherhouse(value);
        }}
        onBlur={() =>
          runValidationTasks('collected_outside_fisherhouse', collected_outside_fisherhouse)
        }
        errorMessage={errors.collected_outside_fisherhouse?.errorMessage}
        hasError={errors.collected_outside_fisherhouse?.hasError}
        {...getOverrideProps(overrides, 'collected_outside_fisherhouse')}
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
