import Radios from '@components/Inputs/Radios';
import NameBlock from '@components/CommonInputs/NameBlock';
import ContactInfoBlock from '@components/CommonInputs/ContactInfoBlock';
import { Fragment, useEffect, useState } from 'react';
import { BRANCHESOFSERVICE, SERVICEMEMBERSTATUS, RELATIONSHIPTOSERVICEMEMBER } from '@src/API';
import { yesNoOptions } from '@utils/yesNoOptions';
import Selectfield from '@components/Inputs/Selectfield';
import MedicalCenterAssociation from '@components/CommonInputs/MedicalCenterAssociation';
import BaseAssociation from '@components/CommonInputs/BaseAssociation';
import GroupChangeDialog from '../../GroupChangeDialog';
import { DataStore } from '@aws-amplify/datastore';
import { ServiceMember, Patient, Affiliation, Application } from '@src/models';
import useGroupDialog from '@contexts/GroupDialogContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getApplication } from '@src/graphql/queries';
import { updateServiceMember, updatePatient } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import validateEmail from '@utils/validators/email';
import validatePhoneNumber from '@utils/validators/phone';
import useButtonWait from '@contexts/ButtonWaitContext';
import validateNumeric from '@utils/validators/numeric';
import validateRequired from '@utils/validators/required';
import isGroupEditable from '@utils/isGroupEditable';

export default function GroupFormPage2(props) {
  const [firstName, setFirstName] = useState('');
  const [firstNameOriginal, setFirstNameOriginal] = useState('');
  const [firstNameCount, setFirstNameCount] = useState(-1);
  const [middleInitial, setMiddleInitial] = useState('');
  const [middleInitialOriginal, setMiddleInitialOriginal] = useState('');
  const [middleInitialCount, setMiddleInitialCount] = useState(-1);
  const [lastName, setLastName] = useState('');
  const [lastNameOriginal, setLastNameOriginal] = useState('');
  const [lastNameCount, setLastNameCount] = useState(-1);
  const [email, setEmail] = useState('');
  const [emailOriginal, setEmailOriginal] = useState('');
  const [emailCount, setEmailCount] = useState(-1);
  const [telephone, setTelephone] = useState('');
  const [telephoneOriginal, setTelephoneOriginal] = useState('');
  const [telephoneCount, setTelephoneCount] = useState(-1);
  const [extension, setExtension] = useState('');
  const [extensionOriginal, setExtensionOriginal] = useState('');
  const [extensionCount, setExtensionCount] = useState(-1);
  const [branchOfService, setBranchOfService] = useState('');
  const [branchOfServiceOriginal, setBranchOfServiceOriginal] = useState('');
  const [branchOfServiceCount, setBranchOfServiceCount] = useState(-1);
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentStatusOriginal, setCurrentStatusOriginal] = useState('');
  const [currentStatusCount, setCurrentStatusCount] = useState(-1);
  const [baseAssigned, setBaseAssigned] = useState('');
  const [baseAssignedOriginal, setBaseAssignedOriginal] = useState('');
  const [baseAssignedCount, setBaseAssignedCount] = useState(-1);
  const [militaryTravelOrders, setMilitaryTravelOrders] = useState('');
  const [militaryTravelOrdersOriginal, setMilitaryTravelOrdersOriginal] = useState('');
  const [militaryTravelOrdersCount, setMilitaryTravelOrdersCount] = useState(-1);
  const [treatmentFacility, setTreatmentFacility] = useState('');
  const [treatmentFacilityOriginal, setTreatmentFacilityOriginal] = useState('');
  const [treatmentFacilityCount, setTreatmentFacilityCount] = useState(-1);
  const [patientOtherThanMember, setPatientOtherThanMember] = useState('');
  const [patientOtherThanMemberOriginal, setPatientOtherThanMemberOriginal] = useState('');
  const [patientOtherThanMemberCount, setPatientOtherThanMemberCount] = useState(-1);
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientFirstNameOriginal, setPatientFirstNameOriginal] = useState('');
  const [patientFirstNameCount, setPatientFirstNameCount] = useState(-1);
  const [patientMiddleInitial, setPatientMiddleInitial] = useState('');
  const [patientMiddleInitialOriginal, setPatientMiddleInitialOriginal] = useState('');
  const [patientMiddleInitialCount, setPatientMiddleInitialCount] = useState(-1);
  const [patientLastName, setPatientLastName] = useState('');
  const [patientLastNameOriginal, setPatientLastNameOriginal] = useState('');
  const [patientLastNameCount, setPatientLastNameCount] = useState(-1);
  const [patientRelationship, setPatientRelationship] = useState('');
  const [patientRelationshipOriginal, setPatientRelationshipOriginal] = useState('');
  const [patientRelationshipCount, setPatientRelationshipCount] = useState(-1);
  const { setShouldShowGroupChange, setApplyChangesFunction, setCancelFunction } = useGroupDialog();

  const { setMessage } = useDialog();

  const { isWaiting, setIsWaiting } = useButtonWait();
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [extensionValid, setExtensionValid] = useState(false);

  const [baseAssignedValid, setBaseAssignedValid] = useState(false);

  // Determine if all values are the same and if so, set that accordingly.
  useEffect(() => {
    const reduceAndSetUniqueServiceMemberValue = (
      field_name,
      set_function,
      set_original_function,
      set_count_function
    ) => {
      const available = props.applications.map((item) =>
        item?.ServiceMember ? item?.ServiceMember[field_name] : null
      );
      const unique = [...new Set(available)].filter((item) => item !== '');
      if (unique.length > 1) {
        set_count_function(unique.length);
      } else if (unique.length == 1) {
        set_count_function();
        set_function(unique[0]);
        set_original_function(unique[0]);
      } else {
        set_count_function();
      }
    };

    const reduceAndSetUniquePatientValue = (
      field_name,
      set_function,
      set_original_function,
      set_count_function
    ) => {
      const available = props.applications.map((item) =>
        item?.Patient ? item?.Patient[field_name] : ''
      );
      const unique = [...new Set(available)].filter((item) => item !== '');
      if (unique.length > 1) {
        set_count_function(unique.length);
      } else if (unique.length == 1) {
        set_count_function();
        set_function(unique[0]);
        set_original_function(unique[0]);
      } else {
        set_count_function();
      }
    };

    reduceAndSetUniqueServiceMemberValue(
      'first_name',
      setFirstName,
      setFirstNameOriginal,
      setFirstNameCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'middle_initial',
      setMiddleInitial,
      setMiddleInitialOriginal,
      setMiddleInitialCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'last_name',
      setLastName,
      setLastNameOriginal,
      setLastNameCount
    );
    reduceAndSetUniqueServiceMemberValue('email', setEmail, setEmailOriginal, setEmailCount);
    reduceAndSetUniqueServiceMemberValue(
      'telephone',
      setTelephone,
      setTelephoneOriginal,
      setTelephoneCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'extension',
      setExtension,
      setExtensionOriginal,
      setExtensionCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'branch_of_service',
      setBranchOfService,
      setBranchOfServiceOriginal,
      setBranchOfServiceCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'current_status',
      setCurrentStatus,
      setCurrentStatusOriginal,
      setCurrentStatusCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'serviceMemberBaseAssignedToId',
      setBaseAssigned,
      setBaseAssignedOriginal,
      setBaseAssignedCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'on_military_travel_orders',
      setMilitaryTravelOrders,
      setMilitaryTravelOrdersOriginal,
      setMilitaryTravelOrdersCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'other_patient',
      setPatientOtherThanMember,
      setPatientOtherThanMemberOriginal,
      setPatientOtherThanMemberCount
    );

    reduceAndSetUniquePatientValue(
      'first_name',
      setPatientFirstName,
      setPatientFirstNameOriginal,
      setPatientFirstNameCount
    );
    reduceAndSetUniquePatientValue(
      'middle_initial',
      setPatientMiddleInitial,
      setPatientMiddleInitialOriginal,
      setPatientMiddleInitialCount
    );
    reduceAndSetUniquePatientValue(
      'last_name',
      setPatientLastName,
      setPatientLastNameOriginal,
      setPatientLastNameCount
    );
    reduceAndSetUniquePatientValue(
      'relationship',
      setPatientRelationship,
      setPatientRelationshipOriginal,
      setPatientRelationshipCount
    );
    reduceAndSetUniqueServiceMemberValue(
      'serviceMemberTreatmentFacilityId',
      setTreatmentFacility,
      setTreatmentFacilityOriginal,
      setTreatmentFacilityCount
    );
  }, [props.applications]);

  const onSetEmail = (e) => {
    if (e.target.value === '') {
      setEmailValid({
        valid: true,
        message: '',
      });
    }
    setEmail(e.target.value);
  };

  const onSetTelephone = (e) => {
    if (e === undefined) {
      setTelephoneValid({
        valid: true,
        message: '',
      });
    }
    setTelephone(e);
  };

  const handleBlur = (field, value, original_value) => {
    if (value === '') {
      if (field === 'email') {
        setEmailValid({
          valid: true,
          message: '',
        });
      }
    }
    if (value === undefined) {
      if (field == 'telephone') {
        setTelephoneValid({
          valid: true,
          message: '',
        });
      }
    }
    if (value != original_value) {
      if ((value === '' || value === undefined) && original_value === null) {
        return;
      } else {
        if (field == 'email') {
          if (value !== '') {
            const isValid = validateEmail(value);
            setEmailValid(isValid);
            if (!isValid.valid) {
              return;
            }
          } else {
            if (!value && original_value === null) {
              const isValid = validateEmail(value);
              setEmailValid(isValid);
              if (!isValid.valid) {
                return;
              }
            } else {
              setEmailValid({
                valid: true,
                message: '',
              });
            }
          }
        } else if (field == 'telephone') {
          if (value !== '') {
            if (value === undefined) {
              setTelephoneValid({
                valid: true,
                message: '',
              });
              value = null;
            } else {
              const isValid = validatePhoneNumber(value);
              setTelephoneValid(isValid);
              if (!isValid.valid) {
                return;
              }
            }
          } else {
            setTelephoneValid({
              valid: true,
              message: '',
            });
          }
        } else if (field === 'extension') {
          if (value !== '') {
            const isValid = validateNumeric(value);
            setExtensionValid(isValid);
            if (!isValid.valid) {
              return;
            }
          } else {
            setTelephoneValid({
              valid: true,
              message: '',
            });
          }
        } else if (field === 'serviceMemberBaseAssignedToId') {
          const isValid = validateRequired(value);
          setBaseAssignedValid(validateRequired(value));
          if (!isValid.valid) {
            return;
          }
        }
      }

      switch (field) {
        case 'first_name':
          setCancelFunction(() => () => setFirstName(firstNameOriginal));
          break;

        case 'middle_initial':
          setCancelFunction(() => () => setMiddleInitial(middleInitialOriginal));
          break;

        case 'last_name':
          setCancelFunction(() => () => setLastName(lastNameOriginal));
          break;

        case 'email':
          setCancelFunction(() => () => setEmail(emailOriginal));
          break;

        case 'telephone':
          setCancelFunction(() => () => setTelephone(telephoneOriginal));
          break;

        case 'extension':
          setCancelFunction(() => () => setExtension(extensionOriginal));
          break;

        case 'branch_of_service':
          setCancelFunction(() => () => setBranchOfService(branchOfServiceOriginal));
          break;

        case 'current_status':
          setCancelFunction(() => () => setCurrentStatus(currentStatusOriginal));
          break;

        case 'serviceMemberBaseAssignedToId':
          setCancelFunction(() => () => {
            setBaseAssignedValid(validateRequired(baseAssignedOriginal));
            setBaseAssigned(baseAssignedOriginal);
          });
          break;

        case 'on_military_travel_orders':
          setCancelFunction(() => () => setMilitaryTravelOrders(militaryTravelOrdersOriginal));
          break;

        case 'other_patient':
          setCancelFunction(() => () => setPatientOtherThanMember(patientOtherThanMemberOriginal));
          break;

        case 'serviceMemberTreatmentFacilityId':
          setCancelFunction(() => () => setTreatmentFacility(treatmentFacilityOriginal));
          break;

        default:
          break;
      }
      setApplyChangesFunction(() => async () => {
        props.applications.forEach((app) => {
          if (shouldUseDatastore()) {
            console.log('Group actions via Datastore are not supported.');
            // DataStore.save(newServiceMember).then(() => {
            //   DataStore.query(Application, app.id).then((newApp) => newApplications.push(newApp));
            // });
          } else {
            let newInput = {
              id: app.ServiceMember.id,
            };
            newInput[field] = value;
            if (field === 'current_status') {
              if (original_value) {
                if (value !== original_value) {
                  if (app?.ServiceMember?.current_status !== value) {
                    newInput['serviceMemberBaseAssignedToId'] = null;
                  }
                }
              } else {
                if (app?.ServiceMember?.current_status !== value) {
                  newInput['serviceMemberBaseAssignedToId'] = null;
                }
              }
            }
            setIsWaiting(true);
            API.graphql(graphqlOperation(updateServiceMember, { input: newInput }))
              .then(() => {
                API.graphql(graphqlOperation(getApplication, { id: app.id }))
                  .then((newApp) => {
                    switch (field) {
                      case 'first_name':
                        setFirstNameOriginal(value);
                        break;

                      case 'middle_initial':
                        setMiddleInitialOriginal(value);
                        break;

                      case 'last_name':
                        setLastNameOriginal(value);
                        break;

                      case 'email':
                        setEmailOriginal(value);
                        break;

                      case 'telephone':
                        setTelephoneOriginal(value);
                        break;

                      case 'extension':
                        setExtensionOriginal(value);
                        break;

                      case 'branch_of_service':
                        setBranchOfServiceOriginal(value);
                        break;

                      case 'current_status':
                        setCurrentStatusOriginal(value);
                        break;

                      case 'serviceMemberBaseAssignedToId':
                        setBaseAssignedOriginal(value);
                        break;

                      case 'on_military_travel_orders':
                        setMilitaryTravelOrdersOriginal(value);
                        break;

                      case 'other_patient':
                        setPatientOtherThanMemberOriginal(value);
                        break;

                      case 'serviceMemberTreatmentFacilityId':
                        setTreatmentFacilityOriginal(value);
                        break;

                      default:
                        break;
                    }
                    setIsWaiting(false);
                    setShouldShowGroupChange(false);
                  })
                  .catch((err) => {
                    setIsWaiting(false);
                    setShouldShowGroupChange(false);
                    console.log('Caught error', err);
                    setMessage(
                      'There was an error saving the Service Member. Please reload the page and try again.'
                    );
                  });
              })
              .catch((err) => {
                setIsWaiting(false);
                setShouldShowGroupChange(false);
                console.log('Caught error', err);
                setMessage(
                  'There was an error saving the Service Member. Please reload the page and try again.'
                );
              });
          }
        });
      });
      setShouldShowGroupChange(true);
    }
  };

  const handlePatientBlur = (field, value, original_value) => {
    if (value != original_value) {
      switch (field) {
        case 'first_name':
          setCancelFunction(() => () => setPatientFirstName(patientFirstNameOriginal));
          break;

        case 'middle_initial':
          setCancelFunction(() => () => setPatientMiddleInitial(patientMiddleInitialOriginal));
          break;

        case 'last_name':
          setCancelFunction(() => () => setPatientLastName(patientLastNameOriginal));
          break;

        case 'relationship':
          setCancelFunction(() => () => setPatientRelationship(patientRelationshipOriginal));
          break;

        default:
          break;
      }
      setApplyChangesFunction(() => () => {
        let newApplications = [];
        props.applications.forEach((app) => {
          if (shouldUseDatastore()) {
            console.log('Group actions via Datastore are not supported.');
            // DataStore.save(newPatient).then(() => {
            //   DataStore.query(Application, app.id).then((newApp) => newApplications.push(newApp));
            // });
          } else {
            let newInput = {
              id: app.Patient.id,
            };
            newInput[field] = value;
            setIsWaiting(true);
            API.graphql(graphqlOperation(updatePatient, { input: newInput }))
              .then(() => {
                API.graphql(graphqlOperation(getApplication, { id: app.id }))
                  .then((newApp) => {
                    newApplications.push(deserializeModel(Application, newApp));
                    switch (field) {
                      case 'first_name':
                        setPatientFirstNameOriginal(value);
                        break;

                      case 'middle_initial':
                        setPatientMiddleInitialOriginal(value);
                        break;

                      case 'last_name':
                        setPatientLastNameOriginal(value);
                        break;

                      case 'relationship':
                        setPatientRelationshipOriginal(value);
                        break;

                      default:
                        break;
                    }
                    setIsWaiting(false);
                    setShouldShowGroupChange(false);
                  })
                  .catch((err) => {
                    console.log('Caught error', err);
                    setMessage(
                      'There was an error saving the Patient. Please reload the page and try again.'
                    );
                  });
              })
              .catch((err) => {
                console.log('Caught error', err);
                setMessage(
                  'There was an error saving the Patient. Please reload the page and try again.'
                );
              });
          }
        });
      });
      setShouldShowGroupChange(true);
    }
  };

  return (
    <div>
      <h3>
        Service Member or Veteran Info <small>(As it appears on government ID)</small>
      </h3>

      <div className="inner-pane">
        <NameBlock
          firstNameValue={firstName}
          firstNameOnChange={(e) => setFirstName(e.target.value)}
          firstNameValid={firstNameValid}
          firstNameOnBlur={() => handleBlur('first_name', firstName, firstNameOriginal)}
          firstNameCount={firstNameCount}
          middleInitialValue={middleInitial}
          middleInitialOnChange={(e) => {
            setMiddleInitial(e.target.value);
          }}
          middleInitialOnBlur={() =>
            handleBlur('middle_initial', middleInitial, middleInitialOriginal)
          }
          middleInitialCount={middleInitialCount}
          lastNameValue={lastName}
          lastNameOnChange={(e) => setLastName(e.target.value)}
          lastNameValid={lastNameValid}
          lastNameOnBlur={() => handleBlur('last_name', lastName, lastNameOriginal)}
          lastNameCount={lastNameCount}
          inputDisabled={!isGroupEditable(props.applications)}
        />

        <div className="contact-details">
          <ContactInfoBlock
            emailValue={email}
            emailOnChange={(e) => onSetEmail(e)}
            emailOnBlur={() => handleBlur('email', email, emailOriginal)}
            emailValid={emailValid}
            emailCount={emailCount}
            telephoneValue={telephone}
            telephoneOnChange={(e) => onSetTelephone(e)}
            telephoneValid={telephoneValid}
            telephoneOnBlur={() => handleBlur('telephone', telephone, telephoneOriginal)}
            telephoneCount={telephoneCount}
            extensionValue={extension}
            extensionOnChange={(e) => setExtension(e.target.value)}
            extensionOnBlur={() => handleBlur('extension', extension, extensionOriginal)}
            extensionValid={extensionValid}
            extensionCount={extensionCount}
            inputDisabled={!isGroupEditable(props.applications)}
          />
        </div>

        <Radios
          title="Branch of Service"
          titleCount={branchOfServiceCount}
          options={BRANCHESOFSERVICE}
          selected={branchOfService}
          onChange={(e) => {
            setBranchOfService(e.target.value);
            handleBlur('branch_of_service', e.target.value, branchOfServiceOriginal);
          }}
          inputDisabled={!isGroupEditable(props.applications)}
        />

        <Radios
          title="Current Status"
          titleCount={currentStatusCount}
          options={SERVICEMEMBERSTATUS}
          selected={currentStatus}
          onChange={(e) => {
            setCurrentStatus(e.target.value);
            handleBlur('current_status', e.target.value, currentStatusOriginal);
          }}
          inputDisabled={!isGroupEditable(props.applications)}
        />

        {currentStatus && currentStatus != SERVICEMEMBERSTATUS.VETERAN && (
          <BaseAssociation
            label="Base Assigned"
            labelCount={baseAssignedCount}
            value={baseAssigned}
            onChange={(e) => {
              setBaseAssigned(e.value);
              handleBlur('serviceMemberBaseAssignedToId', e.value, baseAssignedOriginal);
            }}
            // inputDisabled={!isApplicationEditable(application)}
            isValid={baseAssignedValid.valid}
            errorMessage={baseAssignedValid.message}
            inputDisabled={!isGroupEditable(props.applications)}
          />
        )}

        {currentStatus == SERVICEMEMBERSTATUS.VETERAN && (
          <MedicalCenterAssociation
            label="VA Assigned"
            labelCount={baseAssignedCount}
            value={baseAssigned}
            onChange={(e) => {
              setBaseAssigned(e.value);
              handleBlur('serviceMemberBaseAssignedToId', e.value, baseAssignedOriginal);
            }}
            // inputDisabled={!isApplicationEditable(application)}
            blankValue="Select VA Assigned..."
            withFakeNoneOption
            isValid={baseAssignedValid.valid}
            errorMessage={baseAssignedValid.message}
            inputDisabled={!isGroupEditable(props.applications)}
          />
        )}

        <Radios
          title="Is the family on military travel orders (ITO&rsquo;s) or eligible for lodging reimbursement?"
          titleCount={militaryTravelOrdersCount}
          options={yesNoOptions}
          selected={militaryTravelOrders}
          onChange={(e) => {
            setMilitaryTravelOrders(e.target.value);
            handleBlur('on_military_travel_orders', e.target.value, militaryTravelOrdersOriginal);
          }}
        />

        <Radios
          title="Is the patient someone other than the Service Member?"
          titleCount={patientOtherThanMemberCount}
          options={yesNoOptions}
          selected={patientOtherThanMember}
          onChange={(e) => {
            setPatientOtherThanMember(e.target.value);
            handleBlur('other_patient', e.target.value, patientOtherThanMemberOriginal);
          }}
          inputDisabled={!isGroupEditable(props.applications)}
        />

        {(patientOtherThanMember == 'true' || patientOtherThanMember === true) && (
          <Fragment>
            <h3>Patient Info</h3>

            <NameBlock
              firstNameValue={patientFirstName}
              firstNameOnChange={(e) => setPatientFirstName(e.target.value)}
              firstNameOnBlur={() =>
                handlePatientBlur('first_name', patientFirstName, patientFirstNameOriginal)
              }
              firstNameCount={patientFirstNameCount}
              middleInitialValue={patientMiddleInitial}
              middleInitialOnChange={(e) => setPatientMiddleInitial(e.target.value)}
              middleInitialOnBlur={() =>
                handlePatientBlur(
                  'middle_initial',
                  patientMiddleInitial,
                  patientMiddleInitialOriginal
                )
              }
              middleInitialCount={patientMiddleInitialCount}
              lastNameValue={patientLastName}
              lastNameOnChange={(e) => setPatientLastName(e.target.value)}
              lastNameOnBlur={() =>
                handlePatientBlur('last_name', patientLastName, patientLastNameOriginal)
              }
              lastNameCount={patientLastNameCount}
              inputDisabled={!isGroupEditable(props.applications)}
            />

            <Selectfield
              label="Relationship to Service Member"
              labelCount={patientRelationshipCount}
              options={RELATIONSHIPTOSERVICEMEMBER}
              blankValue=""
              inputValue={patientRelationship}
              useReactSelect
              placeholder="Select Relationship..."
              inputOnChange={(e) => {
                setPatientRelationship(e?.value);
                handlePatientBlur('relationship', e?.value, patientRelationshipOriginal);
              }}
              inputDisabled={!isGroupEditable(props.applications)}
            />
          </Fragment>
        )}

        <h3>Treatment Facility</h3>

        <MedicalCenterAssociation
          label="Select a Treatment Facility"
          labelCount={treatmentFacilityCount}
          value={treatmentFacility}
          onChange={(e) => {
            setTreatmentFacility(e?.value);
            handleBlur(
              'serviceMemberTreatmentFacilityId',
              e?.value || '',
              treatmentFacilityOriginal
            );
          }}
          inputDisabled={!isGroupEditable(props.applications)}
        />
      </div>
    </div>
  );
}

GroupFormPage2.defaultProps = {
  applications: [],
};
