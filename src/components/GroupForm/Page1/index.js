import NameBlock from '@components/CommonInputs/NameBlock';
import ContactInfoBlock from '@components/CommonInputs/ContactInfoBlock';
import Textfield from '@components/Inputs/Textfield';
import Radios from '@components/Inputs/Radios';
import AffiliationBlock from '@components/AffiliationBlock';
import { useState, useEffect, Fragment } from 'react';
import GroupChangeDialog from '../../GroupChangeDialog';
import { DataStore } from '@aws-amplify/datastore';
import { Applicant, Application } from '@src/models';
import validateEmail from '@utils/validators/email';
import validatePhoneNumber from '@utils/validators/phone';
import validateNumeric from '@utils/validators/numeric';
import useGroupDialog from '@contexts/GroupDialogContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getApplication } from '@src/graphql/queries';
import { updateApplicant } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import useAffiliationsHook from '@src/hooks/useAffiliationsHook';
import { AFFILIATIONTYPE, AFFILIATIONSTATUS, NOTEACTION } from '@src/API';
import useButtonWait from '@contexts/ButtonWaitContext';
import { yesNoOptions } from '@utils/yesNoOptions';
import isGroupEditable from '@utils/isGroupEditable';

export default function GroupFormPage1(props) {
  // options
  const fisherhouseOptions = useAffiliationsHook(AFFILIATIONTYPE.FISHERHOUSE, false);
  const medicalCenterOptions = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false);
  const organizationOptions = useAffiliationsHook(AFFILIATIONTYPE.ORGANIZATION, false);
  const baseOptions = useAffiliationsHook(AFFILIATIONTYPE.BASE, false);

  const fisherhouseOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.FISHERHOUSE, false, true);
  const medicalCenterOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false, true);
  const organizationOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.ORGANIZATION, false, true);
  const baseOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.BASE, false, true);

  const { isWaiting, setIsWaiting } = useButtonWait();

  const [collectedOutsideFisherhouse, setCollectedOutsideFisherhouse] = useState('');
  const [collectedOutsideFisherhouseOriginal, setCollectedOutsideFisherhouseOriginal] =
    useState('');
  const [collectedOutsideFisherhouseCount, setCollectedOutsideFisherhouseCount] = useState(-1);
  const [firstName, setFirstName] = useState('');
  const [firstNameOriginal, setFirstNameOriginal] = useState('');
  const [firstNameCount, setFirstNameCount] = useState(-1);
  const [middleInitial, setMiddleInitial] = useState('');
  const [middleInitialOriginal, setMiddleInitialOriginal] = useState('');
  const [middleInitialCount, setMiddleInitialCount] = useState(-1);
  const [lastName, setLastName] = useState('');
  const [lastNameOriginal, setLastNameOriginal] = useState('');
  const [lastNameCount, setLastNameCount] = useState(-1);
  const [jobTitle, setJobTitle] = useState('');
  const [jobTitleOriginal, setJobTitleOriginal] = useState('');
  const [jobTitleCount, setJobTitleCount] = useState(-1);
  const [email, setEmail] = useState('');
  const [emailOriginal, setEmailOriginal] = useState('');
  const [emailCount, setEmailCount] = useState(-1);
  const [telephone, setTelephone] = useState('');
  const [telephoneOriginal, setTelephoneOriginal] = useState('');
  const [telephoneCount, setTelephoneCount] = useState(-1);
  const [extension, setExtension] = useState('');
  const [extensionOriginal, setExtensionOriginal] = useState('');
  const [extensionCount, setExtensionCount] = useState(-1);
  const [affiliationType, setAffiliationType] = useState('');
  const [affiliationTypeOriginal, setAffiliationTypeOriginal] = useState('');
  const [affiliationTypeCount, setAffiliationTypeCount] = useState(-1);
  const [affiliation, setAffiliation] = useState('');
  const [affiliationOriginal, setAffiliationOriginal] = useState('');
  const [affiliationCount, setAffiliationCount] = useState(-1);

  const [emailValid, setEmailValid] = useState(false);
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [extensionValid, setExtensionValid] = useState(false);

  const { setShouldShowGroupChange, setApplyChangesFunction, setCancelFunction } = useGroupDialog();

  const { setMessage } = useDialog();

  // Determine if all values are the same and if so, set that accordingly.
  useEffect(() => {
    const reduceAndSetUniqueApplicantValue = (
      field_name,
      set_function,
      set_original_function,
      set_count_function
    ) => {
      const available = props.applications.map((item) =>
        item?.Applicant ? item?.Applicant[field_name] : ''
      );
      const unique = [...new Set(available)].filter(item => item !== '');
      if (unique.length > 1) {
        set_count_function(unique.length);
      }
      else if (unique.length == 1) {
        set_count_function();
        set_function(unique[0]);
        set_original_function(unique[0]);
      } else {
        set_count_function();
      }
    };

    reduceAndSetUniqueApplicantValue(
      'collected_outside_fisherhouse',
      setCollectedOutsideFisherhouse,
      setCollectedOutsideFisherhouseOriginal,
      setCollectedOutsideFisherhouseCount
    );
    reduceAndSetUniqueApplicantValue(
      'first_name',
      setFirstName,
      setFirstNameOriginal,
      setFirstNameCount
    );
    reduceAndSetUniqueApplicantValue(
      'middle_initial',
      setMiddleInitial,
      setMiddleInitialOriginal,
      setMiddleInitialCount
    );
    reduceAndSetUniqueApplicantValue(
      'last_name',
      setLastName,
      setLastNameOriginal,
      setLastNameCount
    );
    reduceAndSetUniqueApplicantValue('job', setJobTitle, setJobTitleOriginal, setJobTitleCount);
    reduceAndSetUniqueApplicantValue('email', setEmail, setEmailOriginal, setEmailCount);
    reduceAndSetUniqueApplicantValue(
      'telephone',
      setTelephone,
      setTelephoneOriginal,
      setTelephoneCount
    );
    reduceAndSetUniqueApplicantValue(
      'extension',
      setExtension,
      setExtensionOriginal,
      setExtensionCount
    );
    reduceAndSetUniqueApplicantValue(
      'affiliation_type',
      setAffiliationType,
      setAffiliationTypeOriginal,
      setAffiliationTypeCount
    );
    reduceAndSetUniqueApplicantValue(
      'applicantAffiliationId',
      setAffiliation,
      setAffiliationOriginal,
      setAffiliationCount
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
        if (field === 'email') {
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
        } else if (field === 'telephone') {
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
        } else if (field == 'extension') {
          if (value !== '') {
            const isValid = validateNumeric(value);
            setExtensionValid(isValid);
            if (!isValid.valid) {
              return;
            }
          } else {
            setExtensionValid({
              valid: true,
              message: '',
            });
          }
        }
      }

      switch (field) {
        case 'collected_outside_fisherhouse':
          setCancelFunction(
            () => () => setCollectedOutsideFisherhouse(collectedOutsideFisherhouseOriginal)
          );
          break;

        case 'first_name':
          setCancelFunction(() => () => setFirstName(firstNameOriginal));
          break;

        case 'middle_initial':
          setCancelFunction(() => () => setMiddleInitial(middleInitialOriginal));
          break;

        case 'last_name':
          setCancelFunction(() => () => setLastName(lastNameOriginal));
          break;

        case 'job':
          setCancelFunction(() => () => setJobTitle(jobTitleOriginal));
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

        case 'affiliation_type':
          setCancelFunction(() => () => setAffiliationType(affiliationTypeOriginal));
          break;

        case 'applicantAffiliationId':
          setCancelFunction(() => () => setAffiliation(affiliationOriginal));
          break;

        default:
          break;
      }
      setApplyChangesFunction(() => async () => {
        props.applications.forEach((app) => {
          if (shouldUseDatastore()) {
            console.log('Group actions via Datastore are not supported.');
            // DataStore.save(newApplicant).then(() => {
            //   DataStore.query(Application, app.id).then((newApp) => newApplications.push(newApp));
            // });
          } else {
            let newInput = {
              id: app.Applicant.id,
            };
            newInput[field] = value;
            setIsWaiting(true);
            API.graphql(graphqlOperation(updateApplicant, { input: newInput }))
              .then(() => {
                API.graphql(graphqlOperation(getApplication, { id: app.id }))
                  .then(() => {
                    switch (field) {
                      case 'collected_outside_fisherhouse':
                        setCollectedOutsideFisherhouseOriginal(value);
                        break;

                      case 'first_name':
                        setFirstNameOriginal(value);
                        break;

                      case 'middle_initial':
                        setMiddleInitialOriginal(value);
                        break;

                      case 'last_name':
                        setLastNameOriginal(value);
                        break;

                      case 'job':
                        setJobTitleOriginal(value);
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

                      case 'affiliation_type':
                        setAffiliationTypeOriginal(value);
                        setAffiliation();
                        break;

                      case 'applicantAffiliationId':
                        setAffiliationOriginal(value);
                        break;

                      default:
                        break;
                    }
                    setIsWaiting(false);
                    setShouldShowGroupChange(false);
                  })
                  .catch((err) => {
                    console.log('Caught error', err);
                    setIsWaiting(false);
                    setShouldShowGroupChange(false);
                    setMessage(
                      'There was an error saving the Applicant. Please reload the page and try again.'
                    );
                  });
              })
              .catch((err) => {
                console.log('Caught error', err);
                setIsWaiting(false);
                setShouldShowGroupChange(false);
                setMessage(
                  'There was an error saving the Applicant. Please reload the page and try again.'
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
        Were case details collected by someone other than yourself?
        {collectedOutsideFisherhouseCount >= 0 && (
          <Fragment>
            &nbsp;
            <abbr
              title={
                'There are ' + collectedOutsideFisherhouseCount + ' unique values for this input.'
              }
            >
              ({collectedOutsideFisherhouseCount})
            </abbr>
          </Fragment>
        )}
      </h3>

      <Radios
        options={yesNoOptions}
        selected={collectedOutsideFisherhouse}
        onChange={(e) => {
          setCollectedOutsideFisherhouse(e.target.value == 'true');
          handleBlur(
            'collected_outside_fisherhouse',
            e.target.value == 'true',
            collectedOutsideFisherhouseOriginal
          );
        }}
        inputDisabled={!isGroupEditable(props.applications)}
      />

      {collectedOutsideFisherhouse && (
        <div className="inner-pane">
          <NameBlock
            firstNameValue={firstName}
            firstNameOnChange={(e) => setFirstName(e.target.value)}
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
            lastNameOnBlur={() => handleBlur('last_name', lastName, lastNameOriginal)}
            lastNameCount={lastNameCount}
            inputDisabled={!isGroupEditable(props.applications)}
          />

          <div className="contact-details">
            <Textfield
              label="Job Title"
              labelCount={jobTitleCount}
              wrapperClass="job-title"
              inputValue={jobTitle}
              inputOnChange={(e) => setJobTitle(e.target.value)}
              inputOnBlur={() => handleBlur('job', jobTitle, jobTitleOriginal)}
              inputDisabled={!isGroupEditable(props.applications)}
            />

            <ContactInfoBlock
              emailValue={email}
              emailOnChange={(e) => onSetEmail(e)}
              emailOnBlur={() => handleBlur('email', email, emailOriginal)}
              emailValid={emailValid}
              emailCount={emailCount}
              telephoneValid={telephoneValid}
              telephoneValue={telephone}
              telephoneOnChange={(e) => onSetTelephone(e)}
              telephoneOnBlur={() => handleBlur('telephone', telephone, telephoneOriginal)}
              telephoneCount={telephoneCount}
              extensionValue={extension}
              extensionOnChange={(e) => setExtension(e.target.value)}
              extensionOnBlur={() => handleBlur('extension', extension, extensionOriginal)}
              extensionCount={extensionCount}
              extensionValid={extensionValid}
              inputDisabled={!isGroupEditable(props.applications)}
            />
          </div>

          <AffiliationBlock
            selectedAffiliationType={affiliationType}
            affiliationTypeCount={affiliationTypeCount}
            setAffiliationType={(e) => {
              setAffiliationType(e.target.value);
              handleBlur('affiliation_type', e.target.value, affiliationTypeOriginal);
            }}
            selectedAffiliation={affiliation}
            affiliationCount={affiliationCount}
            fisherhouseOptions={
              fisherhouseOptions.find((item) => item.value === affiliation) ? fisherhouseOptions :
                fisherhouseOptionsIncludingArchiving.find((item) => item.value === affiliation) ? [...fisherhouseOptions, fisherhouseOptionsIncludingArchiving.find((item) => item.value === affiliation)] :
                  fisherhouseOptions
            }
            medicalCenterOptions={
              medicalCenterOptions.find((item) => item.value === affiliation) ? medicalCenterOptions :
                medicalCenterOptionsIncludingArchiving.find((item) => item.value === affiliation) ? [...medicalCenterOptions, medicalCenterOptionsIncludingArchiving.find((item) => item.value === affiliation)] :
                  medicalCenterOptions
            }
            baseOptions={
              baseOptions.find((item) => item.value === affiliation) ? baseOptions :
                baseOptionsIncludingArchiving.find((item) => item.value === affiliation) ? [...baseOptions, baseOptionsIncludingArchiving.find((item) => item.value === affiliation)] :
                  baseOptions
            }
            organizationOptions={
              organizationOptions.find((item) => item.value === affiliation) ? organizationOptions :
                organizationOptionsIncludingArchiving.find((item) => item.value === affiliation) ? [...organizationOptions, organizationOptionsIncludingArchiving.find((item) => item.value === affiliation)] :
                  organizationOptions
            }
            withAddNew={false}
            setAffiliation={(e) => {
              setAffiliation(e);
              handleBlur('applicantAffiliationId', e || '', affiliationOriginal);
            }}
            inputDisabled={!isGroupEditable(props.applications)}
          />
        </div>
      )}
    </div>
  );
}

GroupFormPage1.defaultProps = {
  applications: [],
  setApplications: () => { },
  setShouldShowGroupChange: () => { },
};
