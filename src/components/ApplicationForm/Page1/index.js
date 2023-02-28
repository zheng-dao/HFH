import Textfield from '@components/Inputs/Textfield';
import Radios from '@components/Inputs/Radios';
import NameBlock from '@components/CommonInputs/NameBlock';
import ContactInfoBlock from '@components/CommonInputs/ContactInfoBlock';
import validateRequired from '@utils/validators/required';
import validateEmail from '@utils/validators/email';
import { useState, useEffect, useRef, Fragment } from 'react';
import { DataStore } from 'aws-amplify';
import { Affiliation, Applicant } from '@src/models';
import { AFFILIATIONTYPE, AFFILIATIONSTATUS, NOTEACTION } from '@src/API';
import useDialog from '@contexts/DialogContext';
import useAffiliationsHook from '@src/hooks/useAffiliationsHook';
import toast from 'react-hot-toast';
import AffiliationBlock from '@components/AffiliationBlock';
import { yesNoOptions } from '@utils/yesNoOptions';
import useApplication from '@contexts/ApplicationContext';
import useAuth from '@contexts/AuthContext';
import isApplicationEditable from '@utils/isApplicationEditable';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listAffiliations } from '@src/graphql/queries';
import validatePhoneNumber from '@utils/validators/phone';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import createNote from '@utils/createNote';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';
import htmlEntities from '@utils/htmlEntities';
import validateNumeric from '@utils/validators/numeric';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';

export default function ApplicationFormPage1(props) {
  const { setMessage } = useDialog();
  const { profile, isAdministrator } = useAuth();

  // options
  const fisherhouseOptions = useAffiliationsHook(AFFILIATIONTYPE.FISHERHOUSE, false);
  const medicalCenterOptions = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false);
  const organizationOptions = useAffiliationsHook(AFFILIATIONTYPE.ORGANIZATION, false);
  const baseOptions = useAffiliationsHook(AFFILIATIONTYPE.BASE, false);

  const fisherhouseOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.FISHERHOUSE, false, true);
  const medicalCenterOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false, true);
  const organizationOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.ORGANIZATION, false, true);
  const baseOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.BASE, false, true);

  const {
    applicant,
    setApplicant,
    sourceApplicant,
    setSourceApplicant,
    application,
    saveApplicant,
  } = useApplication();

  const affiliationBlockRef = useRef();

  const updateFirstName = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.first_name = e.target.value || null;
      })
    );
  };

  const updateMiddleInitial = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.middle_initial = e.target.value || null;
      })
    );
  };

  const updateLastName = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.last_name = e.target.value || null;
      })
    );
  };

  const updateJobTitle = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.job = e.target.value || null;
      })
    );
  };

  const updateEmail = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.email = e.target.value || null;
      })
    );
  };

  const updateTelephone = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.telephone = e || null;
      })
    );
  };

  const updateExtension = (e) => {
    setApplicant(
      Applicant.copyOf(applicant, (updated) => {
        updated.extension = e.target.value || null;
      })
    );
  };

  const [caseDetailValid, setCaseDetailValid] = useState(false);
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [jobTitleValid, setJobTitleValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [extensionValid, setExtensionValid] = useState(false);
  const [affiliationValid, setAffiliationValid] = useState(false);
  const [affiliationTypeValid, setAffiliationTypeValid] = useState(false);

  useEffect(() => {
    if (props?.shouldShowErrorMessagesFromSubmitValidation) {
      setCaseDetailValid(validateRequired(applicant?.collected_outside_fisherhouse))
      setFirstNameValid(validateRequired(applicant?.first_name));
      setLastNameValid(validateRequired(applicant?.last_name));
      setJobTitleValid(validateRequired(applicant?.job));
      setEmailValid(validateEmail(applicant?.email));
      if (applicant?.telephone) {
        setTelephoneValid(validatePhoneNumber(applicant?.telephone));
      }
      setAffiliationTypeValid(validateRequired(applicant?.affiliation_type));
      if (applicant?.affiliation_type) {
        setAffiliationValid(validateRequired(applicant?.applicantAffiliationId));
      }
      if (applicant?.extension) {
        setExtensionValid(validateNumeric(applicant?.extension));
      }
      try {
        affiliationBlockRef.current.validateAffiliationForm();
      } catch {
        // Null.
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.shouldShowErrorMessagesFromSubmitValidation]);

  const updateFirstNameValid = (e) => {
    const isValid = validateRequired(e.target.value);
    setFirstNameValid(isValid);
    const originalValue = sourceApplicant?.first_name || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceApplicant(applicant);
    saveApplicant(applicant)
      // .then((a) => setApplicant(a))
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: applicant,
        });
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's First Name</span> from " +
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
      .then(() => toast('Saved First Name.'));
  };

  const updateMiddleInitialValid = (e) => {
    const originalValue = sourceApplicant?.middle_initial || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceApplicant(applicant);
    saveApplicant(applicant)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: applicant,
        });
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Middle Initial</span> from " +
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
      .then(() => toast('Saved Middle Initial.'));
  };

  const updateLastNameValid = (e) => {
    const isValid = validateRequired(e.target.value);
    setLastNameValid(isValid);
    const originalValue = sourceApplicant?.last_name || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceApplicant(applicant);
    saveApplicant(applicant)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: applicant,
        });
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Last Name</span> from " +
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
      .then(() => toast('Saved Last Name.'));
  };

  const updateJobTitleValid = (e) => {
    const isValid = validateRequired(e.target.value);
    setJobTitleValid(isValid);
    const originalValue = sourceApplicant?.job || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceApplicant(applicant);
    saveApplicant(applicant)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: applicant,
        });
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Job Title</span> from " +
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
      .then(() => toast('Saved Job Title.'));
  };

  const updateEmailValid = (e) => {
    const isValid = validateEmail(e.target.value);
    setEmailValid(isValid);
    const originalValue = sourceApplicant?.email || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceApplicant(applicant);
    saveApplicant(applicant)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: applicant,
        });
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Email</span> from " +
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
      .then(() => toast('Saved Email.'));
  };

  const updateTelephoneValid = (e) => {
    if (e.target.value.length > 3) {
      const isValid = validatePhoneNumber(e.target.value);
      setTelephoneValid(isValid);
      if (!isValid.valid) return;
      const originalValue = sourceApplicant?.telephone || htmlEntities('<empty>');
      setSourceApplicant(applicant);
      saveApplicant(applicant)
        .then(() => {
          props.updateApplicationForGroup({
            ...application,
            Applicant: applicant,
          });
          const newValue = applicant?.telephone || htmlEntities('<empty>');
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
              " changed <span class='field'>Referrer's Telephone</span> from " +
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
        .then(() => toast('Saved Telephone.'));
    } else {
      const originalValue = sourceApplicant?.telephone || htmlEntities('<empty>');
      setSourceApplicant(applicant);
      saveApplicant(applicant)
        .then(() => {
          props.updateApplicationForGroup({
            ...application,
            Applicant: applicant,
          });
          const newValue = applicant?.telephone || htmlEntities('<empty>');
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
              " changed <span class='field'>Referrer's Telephone</span> from " +
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
        .then(() => toast('Saved Telephone.'));
      setTelephoneValid({
        valid: true,
        message: '',
      });
    }
  };

  const updateExtensionValid = (e) => {
    setExtensionValid(validateNumeric(e.target.value));
    const originalValue = sourceApplicant?.extension || htmlEntities('<empty>');
    const newValue = e.target.value || htmlEntities('<empty>');
    setSourceApplicant(applicant);
    saveApplicant(applicant)
      .then(() => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: applicant,
        });
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Extension</span> from " +
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
      .then(() => toast('Saved Extension.'));
  };

  const setAffiliationType = (e) => {
    const newApplicant = JSON.parse(JSON.stringify(Applicant.copyOf(applicant, (updated) => {
      (updated.affiliation_type = e),
        (updated.Affiliation = null),
        (updated.applicantAffiliationId = null);
    })));

    if (newApplicant.hasOwnProperty('Application')) {
      delete newApplicant['Application'];
    }
    const originalValue =
      mapEnumValue(sourceApplicant?.affiliation_type) || htmlEntities('<no selection>');
    const newValue = mapEnumValue(e) || htmlEntities('<no selection>');
    saveApplicant(newApplicant)
      .then((a) => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: a,
        });
        setSourceApplicant(a);
        setApplicant(a);
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Affiliation Type</span> from " +
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
      .then(() => toast('Saved Affiliation Type.'));
  };

  const setAffiliation = (e) => {
    setAffiliationValid(validateRequired(e));
    const newApplicant = JSON.parse(JSON.stringify(Applicant.copyOf(applicant, (updated) => {
      updated.applicantAffiliationId = e || null;
    })));
    if (newApplicant.hasOwnProperty('Application')) {
      delete newApplicant['Application'];
    }

    // setApplicant(newApplicant);
    const originalValue =
      sourceApplicant?.Affiliation?.status == AFFILIATIONSTATUS.DRAFT
        ? 'New Affiliation'
        : sourceApplicant?.Affiliation?.name || htmlEntities('<no selection>');
    saveApplicant(newApplicant)
      .then((a) => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: a,
        });
        setSourceApplicant(a);
        setApplicant(a);
        const newValue =
          a.Affiliation == null
            ? htmlEntities('<no selection>')
            : a.Affiliation.status == AFFILIATIONSTATUS.DRAFT
              ? 'New Affiliation'
              : a.Affiliation.name;
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Referrer's Affiliation</span> from " +
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
      .then(() => toast('Saved Affiliation.'));
  };

  const setCollectedOutsideFisherhouse = (e) => {
    const isValid = validateRequired(e.target.value);
    setCaseDetailValid(isValid);
    const newApplicant = Applicant.copyOf(applicant, (updated) => {
      updated.collected_outside_fisherhouse = e.target.value == 'true';
    });
    setApplicant(newApplicant);
    const originalValue =
      sourceApplicant.collected_outside_fisherhouse === true
        ? 'Yes'
        : sourceApplicant.collected_outside_fisherhouse === false
          ? 'No'
          : htmlEntities('<no selection>');
    const newValue = newApplicant.collected_outside_fisherhouse ? 'Yes' : 'No';
    saveApplicant(newApplicant)
      .then((a) => {
        props.updateApplicationForGroup({
          ...application,
          Applicant: a,
        });
        setSourceApplicant(a);
        if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
          createNote(
            humanName(profile) +
            " changed <span class='field'>Were case details collected by someone other than yourself?</span> from " +
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
      .then(() => toast('Saved Case Detail Collection Location.'));
  };

  return (
    <div>
      <h3>Were case details collected by someone other than yourself?</h3>

      <Radios
        options={yesNoOptions}
        selected={applicant?.collected_outside_fisherhouse}
        onChange={setCollectedOutsideFisherhouse}
        inputDisabled={!isApplicationEditable(application)}
        isValid={caseDetailValid.valid}
        errorMessage={caseDetailValid.message}
      />

      {applicant?.collected_outside_fisherhouse && (
        <Fragment>
          <h3>Referred By (Case Manager or Social Worker)</h3>

          <NameBlock
            firstNameValue={applicant?.first_name}
            firstNameOnChange={updateFirstName}
            firstNameOnBlur={updateFirstNameValid}
            firstNameValid={firstNameValid}
            middleInitialValue={applicant?.middle_initial}
            middleInitialOnChange={updateMiddleInitial}
            middleInitialOnBlur={updateMiddleInitialValid}
            lastNameValue={applicant?.last_name}
            lastNameOnChange={updateLastName}
            lastNameOnBlur={updateLastNameValid}
            lastNameValid={lastNameValid}
            inputDisabled={!isApplicationEditable(application)}
          />

          <div className="contact-details">
            <Textfield
              label="Job Title"
              wrapperClass="job-title"
              inputValue={applicant?.job}
              inputOnChange={updateJobTitle}
              inputRequired={true}
              inputOnBlur={updateJobTitleValid}
              isValid={jobTitleValid.valid}
              errorMessage={jobTitleValid.message}
              inputDisabled={!isApplicationEditable(application)}
            />

            <ContactInfoBlock
              emailValue={applicant?.email}
              emailOnChange={updateEmail}
              emailOnBlur={updateEmailValid}
              emailValid={emailValid}
              telephoneValue={applicant?.telephone}
              telephoneOnChange={updateTelephone}
              telephoneOnBlur={updateTelephoneValid}
              telephoneLabel="Telephone (Optional)"
              telephoneValid={telephoneValid}
              extensionValue={applicant?.extension}
              extensionOnChange={updateExtension}
              extensionOnBlur={updateExtensionValid}
              extensionValid={extensionValid}
              inputDisabled={!isApplicationEditable(application)}
            />
          </div>

          <AffiliationBlock
            selectedAffiliationType={applicant?.affiliation_type}
            setAffiliationType={(e) => {
              setAffiliationType(e.target.value);
              setAffiliationTypeValid(validateRequired(e.target.value));
            }}
            setAffiliation={setAffiliation}
            selectedAffiliation={applicant?.applicantAffiliationId}
            fisherhouseOptions={
              fisherhouseOptions.find((item) => item.value === applicant?.applicantAffiliationId) ? fisherhouseOptions :
                fisherhouseOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId) ? [...fisherhouseOptions, fisherhouseOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId)] :
                  fisherhouseOptions
            }
            medicalCenterOptions={
              medicalCenterOptions.find((item) => item.value === applicant?.applicantAffiliationId) ? medicalCenterOptions :
                medicalCenterOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId) ? [...medicalCenterOptions, medicalCenterOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId)] :
                  medicalCenterOptions
            }
            baseOptions={
              baseOptions.find((item) => item.value === applicant?.applicantAffiliationId) ? baseOptions :
                baseOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId) ? [...baseOptions, baseOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId)] :
                  baseOptions
            }
            organizationOptions={
              organizationOptions.find((item) => item.value === applicant?.applicantAffiliationId) ? organizationOptions :
                organizationOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId) ? [...organizationOptions, organizationOptionsIncludingArchiving.find((item) => item.value === applicant?.applicantAffiliationId)] :
                  organizationOptions
            }
            inputDisabled={!isApplicationEditable(application)}
            withAddNew={applicant?.affiliation_type}
            application={application}
            affiliationTypeValid={affiliationTypeValid.valid}
            affiliationTypeMessage={affiliationTypeValid.message}
            affiliationValid={affiliationValid.valid}
            affiliationMessage={affiliationValid.message}
            ref={affiliationBlockRef}
          />
        </Fragment>
      )}
    </div>
  );
}

ApplicationFormPage1.defaultProps = {
  application: {},
  updateApplication: () => { },
  shouldShowErrorMessagesFromSubmitValidation: false,
  setShouldShowErrorMessagesFromSubmitValidation: () => { },
};
