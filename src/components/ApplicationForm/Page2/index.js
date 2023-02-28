import Radios from '@components/Inputs/Radios';
import NameBlock from '@components/CommonInputs/NameBlock';
import ContactInfoBlock from '@components/CommonInputs/ContactInfoBlock';
import validateRequired from '@utils/validators/required';
import validateEmail from '@utils/validators/email';
import { Fragment, useEffect, useState, useRef } from 'react';
import { ServiceMember, Patient, Affiliation, Application } from '@src/models';
import useDialog from '@contexts/DialogContext';
import useAuth from '@contexts/AuthContext';
import toast from 'react-hot-toast';
import validatePhoneNumber from '@utils/validators/phone';
import {
  BRANCHESOFSERVICE,
  SERVICEMEMBERSTATUS,
  RELATIONSHIPTOSERVICEMEMBER,
  NOTEACTION,
  AFFILIATIONSTATUS,
} from '@src/API';
import { yesNoOptions } from '@utils/yesNoOptions';
import Selectfield from '@components/Inputs/Selectfield';
import MedicalCenterAssociation from '@components/CommonInputs/MedicalCenterAssociation';
import BaseAssociation from '@components/CommonInputs/BaseAssociation';
import useApplicationContext from '@contexts/ApplicationContext';
import { DataStore } from '@aws-amplify/datastore';
import isApplicationEditable from '@utils/isApplicationEditable';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getAffiliation } from '@src/graphql/queries';
import valueOrEmptyString from '@utils/valueOrEmptyString';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import createNote from '@utils/createNote';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';
import htmlEntities from '@utils/htmlEntities';
import { FAKEUUID } from '@utils/fakeUUID';
import validateNumeric from '@utils/validators/numeric';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import { deserializeModel } from '@aws-amplify/datastore/ssr';

export default function ApplicationFormPage2(props) {
  const { setMessage } = useDialog();

  const {
    application,
    setApplication,
    saveApplication,
    serviceMember,
    sourceServiceMember,
    setServiceMember,
    setSourceServiceMember,
    saveServiceMember,
    patient,
    sourcePatient,
    setPatient,
    setSourcePatient,
    savePatient,
  } = useApplicationContext();
  const { profile, isAdministrator } = useAuth();

  const [branchOfServiceValid, setBranchOfServiceValid] = useState(false);
  const [currentStatusValid, setCurrentStatusValid] = useState(false);
  const [mTravelOrderValid, setmTravelOrderValid] = useState(false);
  const [otherPatentValid, setOtherPatentValid] = useState(false);

  const [baseAssignedValid, setBaseAssignedValid] = useState(false);
  const [treatmentFacilityValid, setTreatmentFacilityValid] = useState(false);
  const medicalCenterAssociationRef = useRef();

  const updateFirstName = (e) => {
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.first_name = e.target.value || null;
    });
    setServiceMember(newServiceMember);
  };

  const updateMiddleInitial = (e) => {
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.middle_initial = e.target.value || null;
    });
    setServiceMember(newServiceMember);
  };

  const updateLastName = (e) => {
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.last_name = e.target.value || null;
    });
    setServiceMember(newServiceMember);
  };

  const updateEmail = (e) => {
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.email = e.target.value || null;
    });
    setServiceMember(newServiceMember);
  };

  const updateTelephone = (e) => {
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.telephone = e || null;
    });
    setServiceMember(newServiceMember);
  };

  const updateExtension = (e) => {
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.extension = e.target.value || null;
    });
    setServiceMember(newServiceMember);
  };

  const updateBranchOfService = (e) => {
    const isValid = validateRequired(e.target.value);
    setBranchOfServiceValid(isValid);
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.branch_of_service = e.target.value || null;
    });
    setServiceMember(newServiceMember);
    const originalValue =
      mapEnumValue(sourceServiceMember?.branch_of_service) || htmlEntities('<no selection>');
    const newValue = mapEnumValue(e.target.value) || htmlEntities('<no selection>');
    setSourceServiceMember(newServiceMember);
    saveServiceMember(newServiceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Branch of Service</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Branch of Service.');
      });
  };

  const updateServiceMemberStatus = (e) => {
    const isValid = validateRequired(e.target.value);
    setCurrentStatusValid(isValid);
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.current_status = e.target.value || null;
      updated.serviceMemberBaseAssignedToId = null;
    });
    setServiceMember(newServiceMember);
    const originalValue =
      mapEnumValue(sourceServiceMember?.current_status) || htmlEntities('<no selection>');
    const newValue = mapEnumValue(e.target.value) || htmlEntities('<no selection>');
    setSourceServiceMember(newServiceMember);
    saveServiceMember(newServiceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Current Status</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Current Status.');
      });
  };

  const updateOnMilitaryTravelOrders = (e) => {
    const isValid = validateRequired(e.target.value);
    setmTravelOrderValid(isValid);
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.on_military_travel_orders = e.target.value == 'true';
    });
    setServiceMember(newServiceMember);
    const originalValue =
      sourceServiceMember?.on_military_travel_orders == null
        ? htmlEntities('<no selection>')
        : sourceServiceMember.on_military_travel_orders
          ? 'Yes'
          : 'No';
    const newValue = mapEnumValue(e.target.value) || htmlEntities('<no selection>');
    setSourceServiceMember(newServiceMember);
    saveServiceMember(newServiceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Is the family on military travel orders (ITO&rsquo;s) or eligible for lodging reimbursement?</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Travel Orders.');
      });
  };

  const updateOtherPatient = (e) => {
    const isValid = validateRequired(e.target.value);
    setOtherPatentValid(isValid);
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.other_patient = e.target.value == 'true';
    });
    setServiceMember(newServiceMember);
    const originalValue =
      sourceServiceMember?.other_patient == null
        ? htmlEntities('<no selection>')
        : sourceServiceMember.other_patient
          ? 'Yes'
          : 'No';
    const newValue = mapEnumValue(e.target.value) || htmlEntities('<no selection>');
    setSourceServiceMember(newServiceMember);
    saveServiceMember(newServiceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            ' changed <span class="field">Is the patient someone other than the Service Member?</span> from ' +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Patient.');
      });
  };

  const updateServiceMemberRelationship = (e) => {
    const isValid = validateRequired(e);
    setPatientRelationshipValid(isValid);
    const newPatient = Patient.copyOf(patient, (updated) => {
      updated.relationship = e?.value || null;
    });
    setPatient(newPatient);
    const originalValue =
      mapEnumValue(sourcePatient?.relationship) || htmlEntities('<no selection>');
    setSourcePatient(newPatient);
    savePatient(newPatient)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Patient: newPatient,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          Patient: newPatient,
        }));
        const newValue = mapEnumValue(newPatient?.relationship) || htmlEntities('<no selection>');
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Patient's Relationship to Service Member</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast("Saved Patient's Relationship to Service Member.");
      });
  };

  const updateTreatmentFacility = async (e) => {
    let valueToSave = '';
    if (e?.target) {
      valueToSave = e.target.value || null;
    } else {
      valueToSave = e?.value || null;
    }
    setTreatmentFacilityValid(validateRequired(valueToSave));
    const newServiceMember = JSON.parse(JSON.stringify(ServiceMember.copyOf(serviceMember, (updated) => {
      updated.serviceMemberTreatmentFacilityId = valueToSave;
    })));
    if (newServiceMember.hasOwnProperty('Application')) {
      delete newServiceMember['Application'];
    }
    const originalValue =
      sourceServiceMember.TreatmentFacility == null ||
        typeof sourceServiceMember.serviceMemberTreatmentFacilityId == 'undefined'
        ? htmlEntities('<no selection>')
        : sourceServiceMember.TreatmentFacility.status == AFFILIATIONSTATUS.DRAFT
          ? 'New Treatment Facility'
          : sourceServiceMember.TreatmentFacility.name;
    saveServiceMember(newServiceMember)
      .then((member) => {
        if (e?.target) {
          return;
        }
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        setSourceServiceMember(member);
        setServiceMember(member);
        const treatmentFacilityName =
          member.TreatmentFacility == null ||
            typeof member.serviceMemberTreatmentFacilityId == 'undefined'
            ? htmlEntities('<no selection>')
            : member.TreatmentFacility.status == AFFILIATIONSTATUS.DRAFT
              ? 'New Treatment Facility'
              : member.TreatmentFacility.name;
        if (
          originalValue != treatmentFacilityName &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Treatment Facility</span> from " +
            originalValue +
            ' to ' +
            treatmentFacilityName +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Treatment Facility.');
      });
  };

  const updateBaseAssignedTo = async (e) => {
    setBaseAssignedValid(validateRequired(e?.value));
    const newServiceMember = ServiceMember.copyOf(serviceMember, (updated) => {
      updated.serviceMemberBaseAssignedToId = e?.value || null;
    });
    setServiceMember(newServiceMember);
    const originalValue =
      sourceServiceMember?.serviceMemberBaseAssignedToId == FAKEUUID
        ? 'None/Unknown'
        : mapEnumValue(sourceServiceMember?.BaseAssignedTo?.name) || htmlEntities('<no selection>');
    setSourceServiceMember(newServiceMember);
    saveServiceMember(newServiceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        setSourceServiceMember(member);
        const newValue =
          member?.serviceMemberBaseAssignedToId == FAKEUUID
            ? 'None/Unknown'
            : member?.BaseAssignedTo?.name || htmlEntities('<no selection>');
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          const vaOrBase =
            serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN ? 'VA' : 'Base';
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Assigned " +
            vaOrBase +
            '</span> from ' +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Base Assigned To.');
      });
  };

  const refreshServiceMember = () => {
    saveServiceMember(serviceMember).then((member) => {
      setSourceServiceMember(member);
      setServiceMember(member);
    });
  };

  const updatePatientFirstName = (e) => {
    setPatient(
      Patient.copyOf(patient, (updated) => {
        updated.first_name = e.target.value || null;
      })
    );
  };

  const updatePatientMiddleInitial = (e) => {
    setPatient(
      Patient.copyOf(patient, (updated) => {
        updated.middle_initial = e.target.value || null;
      })
    );
  };

  const updatePatientLastName = (e) => {
    setPatient(
      Patient.copyOf(patient, (updated) => {
        updated.last_name = e.target.value || null;
      })
    );
  };

  const [patientFirstNameValid, setPatientFirstNameValid] = useState(false);
  const [patientLastNameValid, setPatientLastNameValid] = useState(false);
  const [patientRelationshipValid, setPatientRelationshipValid] = useState(false);

  useEffect(() => {
    if (props?.shouldShowErrorMessagesFromSubmitValidation) {
      setFirstNameValid(validateRequired(serviceMember?.first_name));
      setLastNameValid(validateRequired(serviceMember?.last_name));
      if (serviceMember?.email) {
        setEmailValid(validateEmail(serviceMember?.email));
      }
      setTelephoneValid(validatePhoneNumber(serviceMember?.telephone));
      if (serviceMember?.extension) {
        setExtensionValid(validateNumeric(serviceMember?.extension));
      }
      setBranchOfServiceValid(validateRequired(serviceMember?.branch_of_service));
      setCurrentStatusValid(validateRequired(serviceMember?.current_status));
      setmTravelOrderValid(validateRequired(serviceMember?.on_military_travel_orders));
      setOtherPatentValid(validateRequired(serviceMember?.other_patient));
      if (serviceMember?.other_patient) {
        setPatientFirstNameValid(validateRequired(patient?.first_name));
        setPatientLastNameValid(validateRequired(patient?.last_name));
        setPatientRelationshipValid(validateRequired(patient?.relationship));
      }
      setBaseAssignedValid(validateRequired(serviceMember?.serviceMemberBaseAssignedToId));
      setTreatmentFacilityValid(validateRequired(serviceMember?.serviceMemberTreatmentFacilityId));
      try {
        medicalCenterAssociationRef.current.validateAffiliationForm();
      } catch {
        // Null.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.shouldShowErrorMessagesFromSubmitValidation]);

  const patientFirstNameBlur = (e) => {
    const isValid = validateRequired(e.target.value);
    setPatientFirstNameValid(isValid);
    const originalValue = sourcePatient?.first_name || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourcePatient(patient);
    savePatient(patient)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Patient: patient,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          Patient: patient,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Patient's First Name</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Patient First Name.');
      });
  };

  const patientMiddleInitialBlur = (e) => {
    const originalValue = sourcePatient?.middle_initial || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourcePatient(patient);
    savePatient(patient)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Patient: patient,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          Patient: patient,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Patient's Middle Initial</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Patient Middle Initial');
      });
  };

  const patientLastNameBlur = (e) => {
    const isValid = validateRequired(e.target.value);
    setPatientLastNameValid(isValid);
    const originalValue = sourcePatient?.last_name || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourcePatient(patient);
    savePatient(patient)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Patient: patient,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          Patient: patient,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Patient's Last Name</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Patient Last Name');
      });
  };

  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [extensionValid, setExtensionValid] = useState(false);

  const updateFirstNameValid = (e) => {
    const isValid = validateRequired(e.target.value);
    setFirstNameValid(isValid);
    const originalValue = sourceServiceMember?.first_name || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's First Name</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved First Name.');
      });
  };

  const updateMiddleInitialValid = (e) => {
    const originalValue = sourceServiceMember?.middle_initial || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Middle Initial</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Middle Initial.');
      });
  };

  const updateLastNameValid = (e) => {
    const isValid = validateRequired(e.target.value);
    setLastNameValid(isValid);
    const originalValue = sourceServiceMember?.last_name || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then((member) => {
        props.updateApplicationForGroup(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Last Name</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Last Name.');
      });
  };

  const updateEmailValid = (e) => {
    if (e.target.value.length > 0) {
      const isValid = validateEmail(e.target.value);
      setEmailValid(isValid);
    } else {
      setEmailValid({
        valid: true,
        message: '',
      });
    }
    const originalValue = sourceServiceMember?.email || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Email</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Email.');
      });
  };

  const updateTelephoneValid = (e) => {
    if (e.target.value.length > 3) {
      const isValid = validatePhoneNumber(e.target.value);
      setTelephoneValid(isValid);
      if (!isValid.valid) return;
      const originalValue = sourceServiceMember?.telephone || htmlEntities('<empty>');
      saveServiceMember(serviceMember)
        .then((member) => {
          setSourceServiceMember(member);
          const newValue = member?.telephone || htmlEntities('<empty>');
          props.updateApplicationForGroup({
            ...application,
            ServiceMember: member,
          });
          setApplication(deserializeModel(Application, {
            ...application,
            ServiceMember: member,
          }));
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
              " changed <span class='field'>Service Member's Telephone</span> from " +
              (originalValue.includes('+1') ? formatPhoneNumber(originalValue) : formatPhoneNumberIntl(originalValue) || htmlEntities('<empty>')) +
              ' to ' +
              (newValue.includes('+1') ? formatPhoneNumber(newValue) : formatPhoneNumberIntl(newValue) || htmlEntities('<empty>')) +
              '.',
              NOTEACTION.CHANGE_DATA,
              application,
              profile
            );
          }
        })
        .then(() => {
          toast('Saved Telephone.');
        })
        .catch((err) => {
          console.log(err);
          setMessage(err.errors[0].message);
        });
    } else {
      const originalValue = sourceServiceMember?.telephone || htmlEntities('<empty>');

      saveServiceMember(serviceMember)
        .then((member) => {
          setSourceServiceMember(member);
          const newValue = member?.telephone || htmlEntities('<empty>');
          props.updateApplicationForGroup({
            ...application,
            ServiceMember: member,
          });
          setApplication(deserializeModel(Application, {
            ...application,
            ServiceMember: member,
          }));
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
              " changed <span class='field'>Service Member's Telephone</span> from " +
              (originalValue.includes('+1') ? formatPhoneNumber(originalValue) : formatPhoneNumberIntl(originalValue) || htmlEntities('<empty>')) +
              ' to ' +
              (newValue.includes('+1') ? formatPhoneNumber(newValue) : formatPhoneNumberIntl(newValue) || htmlEntities('<empty>')) +
              '.',
              NOTEACTION.CHANGE_DATA,
              application,
              profile
            );
          }
        })
        .then(() => {
          toast('Saved Telephone.');
        })
        .catch((err) => {
          console.log(err);
          setMessage(err.errors[0].message);
        });
      setTelephoneValid({
        valid: true,
        message: '',
      });
    }
  };

  const updateExtensionValid = (e) => {
    setExtensionValid(validateNumeric(e.target.value));
    const originalValue = sourceServiceMember?.extension || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then((member) => {
        props.updateApplicationForGroup({
          ...application,
          ServiceMember: member,
        });
        setApplication(deserializeModel(Application, {
          ...application,
          ServiceMember: member,
        }));
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Service Member's Extension</span> from " +
            originalValue +
            ' to ' +
            newValue +
            '.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      })
      .then(() => {
        toast('Saved Extension.');
      });
  };

  return (
    <div>
      <h3>
        Service Member or Veteran Info <small>(As it appears on government ID)</small>
      </h3>

      <NameBlock
        firstNameValue={serviceMember?.first_name}
        firstNameOnChange={updateFirstName}
        firstNameValid={firstNameValid}
        firstNameOnBlur={updateFirstNameValid}
        middleInitialValue={serviceMember?.middle_initial}
        middleInitialOnChange={updateMiddleInitial}
        middleInitialOnBlur={updateMiddleInitialValid}
        lastNameValue={serviceMember?.last_name}
        lastNameOnChange={updateLastName}
        lastNameValid={lastNameValid}
        lastNameOnBlur={updateLastNameValid}
        inputDisabled={!isApplicationEditable(application)}
      />

      <div className="contact-details">
        <ContactInfoBlock
          emailValue={serviceMember?.email}
          emailOnChange={updateEmail}
          emailOnBlur={updateEmailValid}
          emailValid={emailValid}
          emailLabel="Email (Optional)"
          telephoneValue={serviceMember?.telephone}
          telephoneOnChange={updateTelephone}
          telephoneValid={telephoneValid}
          telephoneOnBlur={updateTelephoneValid}
          extensionValue={serviceMember?.extension}
          extensionOnChange={updateExtension}
          extensionOnBlur={updateExtensionValid}
          extensionValid={extensionValid}
          inputDisabled={!isApplicationEditable(application)}
        />
      </div>

      <Radios
        title="Branch of Service"
        options={BRANCHESOFSERVICE}
        selected={serviceMember?.branch_of_service}
        onChange={updateBranchOfService}
        inputDisabled={!isApplicationEditable(application)}
        isValid={branchOfServiceValid.valid}
        errorMessage={branchOfServiceValid.message}
      />

      <Radios
        title="Current Status"
        options={SERVICEMEMBERSTATUS}
        selected={serviceMember?.current_status}
        onChange={updateServiceMemberStatus}
        inputDisabled={!isApplicationEditable(application)}
        isValid={currentStatusValid.valid}
        errorMessage={currentStatusValid.message}
      />

      {serviceMember?.current_status && serviceMember?.current_status != SERVICEMEMBERSTATUS.VETERAN && (
        <BaseAssociation
          label="Base Assigned"
          value={valueOrEmptyString(serviceMember?.serviceMemberBaseAssignedToId)}
          onChange={updateBaseAssignedTo}
          inputDisabled={!isApplicationEditable(application)}
          isValid={baseAssignedValid.valid}
          errorMessage={baseAssignedValid.message}
        />
      )}

      {serviceMember?.current_status && serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN && (
        <MedicalCenterAssociation
          label="VA Assigned"
          value={serviceMember?.serviceMemberBaseAssignedToId}
          onChange={updateBaseAssignedTo}
          inputDisabled={!isApplicationEditable(application)}
          blankValue="Select VA Assigned..."
          withFakeNoneOption
          isValid={baseAssignedValid.valid}
          errorMessage={baseAssignedValid.message}
        />
      )}

      <Radios
        title="Is the family on military travel orders (ITO&rsquo;s) or eligible for lodging reimbursement?"
        options={yesNoOptions}
        selected={serviceMember?.on_military_travel_orders}
        onChange={updateOnMilitaryTravelOrders}
        inputDisabled={!isApplicationEditable(application)}
        isValid={mTravelOrderValid.valid}
        errorMessage={mTravelOrderValid.message}
      />

      <Radios
        title="Is the patient someone other than the Service Member?"
        options={yesNoOptions}
        selected={serviceMember?.other_patient}
        onChange={updateOtherPatient}
        inputDisabled={!isApplicationEditable(application)}
        isValid={otherPatentValid.valid}
        errorMessage={otherPatentValid.message}
      />

      {serviceMember?.other_patient && (
        <Fragment>
          <h3>Patient Info</h3>

          <NameBlock
            inputDisabled={!isApplicationEditable(application)}
            firstNameValue={patient?.first_name}
            firstNameOnChange={updatePatientFirstName}
            firstNameOnBlur={patientFirstNameBlur}
            firstNameValid={patientFirstNameValid}
            middleInitialValue={patient?.middle_initial}
            middleInitialOnChange={updatePatientMiddleInitial}
            middleInitialOnBlur={patientMiddleInitialBlur}
            lastNameValue={patient?.last_name}
            lastNameOnChange={updatePatientLastName}
            lastNameOnBlur={patientLastNameBlur}
            lastNameValid={patientLastNameValid}
          />

          <Selectfield
            label="Relationship to Service Member"
            options={RELATIONSHIPTOSERVICEMEMBER}
            inputRequired={true}
            inputValue={patient?.relationship}
            inputOnChange={updateServiceMemberRelationship}
            inputDisabled={!isApplicationEditable(application)}
            blankValue=""
            isValid={patientRelationshipValid.valid}
            errorMessage={patientRelationshipValid.message}
            useReactSelect
            placeholder="Select Relationship..."
          />
        </Fragment>
      )}

      <h3>Treatment Facility</h3>

      <MedicalCenterAssociation
        label="Select a Treatment Facility"
        value={serviceMember?.serviceMemberTreatmentFacilityId}
        onChange={updateTreatmentFacility}
        inputDisabled={!isApplicationEditable(application)}
        withAddNew
        isValid={treatmentFacilityValid.valid}
        errorMessage={treatmentFacilityValid.message}
        historyNoteTypeName="New Treatment Facility"
        application={application}
        ref={medicalCenterAssociationRef}
        refreshParentObject={refreshServiceMember}
      />
    </div>
  );
}

ApplicationFormPage2.defaultProps = {
  application: {},
  updateApplication: () => { },
  updateApplicationForGroup: () => { },
};
