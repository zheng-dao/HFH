import { useState, useRef, useEffect } from 'react';
import Textfield from '@components/Inputs/Textfield';
import Emailfield from '@components/Inputs/Emailfield';
import Telephonefield from '@components/Inputs/Telephonefield';
import validateRequired from '@utils/validators/required';
import validateLetter from '@utils/validators/letter';
import validateEmail from '@utils/validators/email';
import validatePhoneNumber from '@utils/validators/phone';
import validateNumeric from '@utils/validators/numeric';
import { USERSTATUS, AFFILIATIONTYPE, AFFILIATIONSTATUS } from '@src/API';
import Radio from '@components/Inputs/Radio';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import { User } from '@src/models';
import AffiliationBlock from '@components/AffiliationBlock';
import useAuth from '@contexts/AuthContext';
import useAffiliationsHook from '@src/hooks/useAffiliationsHook';
import { formatISO } from 'date-fns';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';
import { API, graphqlOperation } from 'aws-amplify';
import { updateAffiliation } from '@src/graphql/mutations';
import humanName from '@utils/humanName';
import { listApplications } from '@src/graphql/queries';
import { useRouter } from 'next/router';

export default function ProfileForm(props) {
  const { setMessage } = useDialog();
  const { user, isAdministrator, profile } = useAuth();
  const { setIsWaiting } = useButtonWait();
  const router = useRouter();

  // State for all the fields!
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [middleInitialValid, setMiddleInitialValid] = useState(false);
  const [lastNameValid, setLastNameValid] = useState(false);
  const [jobTitleValid, setJobTitleValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [extensionValid, setExtensionValid] = useState(false);
  const [affiliationTypeValid, setAffiliationTypeValid] = useState(false);
  const [affiliationValid, setAffiliationValid] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');

  const [isDeletable, setIsDeletable] = useState(false);

  const affiliationBlockRef = useRef();

  // options
  const fisherhouseOptions = useAffiliationsHook(AFFILIATIONTYPE.FISHERHOUSE, false);
  const medicalCenterOptions = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false);
  const organizationOptions = useAffiliationsHook(AFFILIATIONTYPE.ORGANIZATION, false);
  const baseOptions = useAffiliationsHook(AFFILIATIONTYPE.BASE, false);

  const fisherhouseOptionsIncludingArchiving = useAffiliationsHook(
    AFFILIATIONTYPE.FISHERHOUSE,
    false,
    true
  );
  const medicalCenterOptionsIncludingArchiving = useAffiliationsHook(
    AFFILIATIONTYPE.MEDICALCENTER,
    false,
    true
  );
  const organizationOptionsIncludingArchiving = useAffiliationsHook(
    AFFILIATIONTYPE.ORGANIZATION,
    false,
    true
  );
  const baseOptionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.BASE, false, true);

  useEffect(() => {
    if (originalEmail == '' && props.profile?.username) {
      setOriginalEmail(props.profile?.username);
    }
  }, [props.profile?.username, originalEmail]);

  useEffect(() => {
    if (props.profile) {
      let filter = {};
      filter = {
        or: [
          {
            applicationUserId: { eq: props.profile?.id },
          },
          {
            applicationAssignedToId: { eq: props.profile?.id },
          },
        ],
      };
      API.graphql(
        graphqlOperation(listApplications, {
          filter,
          limit: 10000,
        })
      )
        .then((results) => {
          if (results && results.data.listApplications.items.length > 0) {
            setIsDeletable(false);
          } else {
            setIsDeletable(true);
          }
        })
        .catch((err) => {
          console.log('Caught error1 -- ', err);
        });
    }
  }, [props.profile]);

  function isValidProfileForm() {
    const firstNameIsValid = validateRequired(props.profile?.first_name);
    setFirstNameValid(firstNameIsValid);
    let middleInitialIsValid = {};
    if (!props.profile?.middle_initial || props.profile?.middle_initial.length == 0) {
      middleInitialIsValid = validateLetter(props.profile?.middle_initial);
      setMiddleInitialValid(middleInitialIsValid);
    } else {
      middleInitialIsValid = {
        valid: true,
        message: '',
      };
    }
    const emailIsValid = validateEmail(props.profile?.username);
    setEmailValid(emailIsValid);
    const lastNameIsValid = validateRequired(props.profile?.last_name);
    setLastNameValid(lastNameIsValid);
    const jobIsValid = validateRequired(props.profile?.job);
    setJobTitleValid(jobIsValid);
    const phoneIsValid = validatePhoneNumber(props.profile?.telephone);
    setTelephoneValid(phoneIsValid);
    const extensionIsValid = validateNumeric(props.profile?.extension);
    setExtensionValid(extensionIsValid);
    const affiliationTypeSelectionValid = validateRequired(props.profile?.affiliation_type);
    setAffiliationTypeValid(affiliationTypeSelectionValid);
    const affiliationChosenValid = validateRequired(props.profile?.AffiliationID);
    setAffiliationValid(affiliationChosenValid);
    // const affiliationObjectValid = affiliationBlockRef.current.validateAffiliationForm();
    return (
      firstNameIsValid.valid &&
      middleInitialIsValid.valid &&
      lastNameIsValid.valid &&
      emailIsValid.valid &&
      jobIsValid.valid &&
      phoneIsValid.valid &&
      extensionIsValid.valid &&
      affiliationTypeSelectionValid.valid &&
      affiliationChosenValid.valid
      // &&
      // affiliationObjectValid
    );
  }

  async function handleUserSave(event) {
    event.preventDefault();
    if (!isValidProfileForm()) {
      setMessage(
        'Your profile is missing required information for it to be saved. Please review your information and try again.'
      );
    } else {
      setButtonDisabled(true);
      setIsWaiting(true);
      const outcome = await props.saveProfile(props.profile);
      if (outcome) {
        setMessage('User profile updated.');
      } else {
        setMessage('There was an error saving the data. Please try again later.');
      }
      setButtonDisabled(false);
      setIsWaiting(false);
    }
  }

  async function handleUserRequestApproval(event) {
    event.preventDefault();
    if (!isValidProfileForm()) {
      setMessage(
        'Your profile is missing required information for it to be approved. Please review your information and try again.'
      );
    } else {
      setButtonDisabled(true);
      setIsWaiting(true);
      const outcome = await props.saveProfile(
        User.copyOf(props.profile, (u) => {
          u.status = USERSTATUS.PENDING;
        })
      );
      API.post('Utils', '/utils/notify/registration', {
        body: {
          name: `${props.profile.first_name} ${props.profile.last_name}`,
          link: `${window.location.host}/profile/${props.profile.id}`,
        }
      });

      const affObject = affiliationBlockRef.current.getAffiliationObject();
      if (affObject?.status == AFFILIATIONSTATUS.DRAFT) {
        await API.graphql(
          graphqlOperation(updateAffiliation, {
            input: {
              id: affObject.id,
              status: AFFILIATIONSTATUS.PENDING,
            },
          })
        );

      }
      if (outcome) {
        setMessage(
          'Your account has been submitted for Administrator review and approval. You will be notified by email when your account is approved.'
        );
      } else {
        setMessage('There was an error saving the data. Please try again later.');
      }
      setButtonDisabled(false);
      setIsWaiting(false);
    }
  }

  async function handleUserApproval(event) {
    event.preventDefault();
    if (!isValidProfileForm()) {
      setMessage(
        'This profile is missing required information for it to be approved. Please review the information prior to approving.'
      );
      return 
    } 

    if(props.profile?.Affiliation &&
      (props.profile?.Affiliation.status === 'DRAFT' ||
        props.profile?.Affiliation.status === 'PENDING')
    ) {
      setMessage(
        'Please approve the suggested Affiliation in order to continue, or choose a different Affiliation.'
      );
      return;
    } 
    
    setButtonDisabled(true);
    setIsWaiting(true);
    const status = props.profile.status;
    const outcome = await props.saveProfile(
      User.copyOf(props.profile, (u) => {
        u.status = USERSTATUS.ACTIVE;
        u.expiration_date = null;
      })
    );
    if (outcome) {
      if (status == USERSTATUS.INACTIVE) {
        setMessage('The account has been activated.'); 
      } else {
        if(props.profile.receive_emails) {
          await API.post('Utils', '/utils/notify/approval', {
              body: {
                name: humanName(props.profile),
                link: `${window.location.host}/user`,
                email: props.profile.username,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(() => console.log("Email sended!"));
        }
        setMessage('The account has been approved.');
      }
    } else {
      setMessage('There was an error saving the data. Please try again later.');
    }
    setButtonDisabled(false);
    setIsWaiting(false);
  }

  async function handleUserArchive(event) {
    event.preventDefault();
    if (!isValidProfileForm()) {
      setMessage(
        'The profile is missing required information for it to be archived. Please review your information prior to archiving.'
      );
    } else {
      setButtonDisabled(true);
      setIsWaiting(true);
      const outcome = await props.saveProfile(
        User.copyOf(props.profile, (u) => {
          u.status = USERSTATUS.INACTIVE;
          u.expiration_date = formatISO(new Date());
        })
      );
      if (outcome) {
        setMessage('The account has been archived.');
      } else {
        setMessage('There was an error saving the data. Please try again later.');
      }
      setButtonDisabled(false);
      setIsWaiting(false);
    }
  }

  async function handleUserDelete(event) {
    event.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    const outcome = await props.deleteProfile(props.profile.id);
    if (outcome) {
      setMessage('The account has been deleted.');
      router.push('/users');
    } else {
      setMessage('There was an error saving the data. Please try again later.');
    }
    setButtonDisabled(false);
    setIsWaiting(false);
  }

  const updateEmailOnBlur = (e) => {
    if (e.target.value == originalEmail) {
      return;
    }
    if (isAdministrator()) {
      alert(
        "You are changing this user's email address. Once you have saved their profile with the new email, they will need to confirm the address before they can log in or receive notifications with the new email address."
      );
    } else {
      alert(
        'You are changing your email address. Once you have saved your profile with the new email, you will need to confirm the address before you can log in or receive notifications with the new email address.'
      );
    }
    setEmailValid(validateEmail(e.target.value));
  };

  const canEditProfile =
    props.profile?.status == USERSTATUS.DRAFT ||
    (isAdministrator() && profile?.status != USERSTATUS.INACTIVE);
  const canEditAffiliation =
    isAdministrator() && profile?.status != USERSTATUS.INACTIVE
      ? props.profile?.status == USERSTATUS.PENDING || props.profile?.status == USERSTATUS.ACTIVE
      : props.profile?.status == USERSTATUS.DRAFT;
  const canEditIfApprovedOrDraft =
    props.profile?.status == USERSTATUS.ACTIVE ||
    props.profile?.status == USERSTATUS.DRAFT ||
    (isAdministrator() && profile?.status != USERSTATUS.INACTIVE);

  const sectionClassNames = classNames('primary', 'app-pane', {
    loading: props.profile == null,
  });

  return (
    <div>
      <section className={sectionClassNames}>
        <form id="user-profile" action="#">
          <h3 className="user-profile">
            Personal Info
            <span className={'app-status status-' + props.profile?.status?.toLowerCase()}>
              {props.profile?.status}
            </span>
          </h3>

          <div className="name-block">
            <Textfield
              label="First Name"
              wrapperClass="first-name"
              inputValue={props.profile?.first_name}
              inputOnChange={(e) => props.updateProfile('first_name', e.target.value)}
              inputRequired={true}
              inputOnBlur={(e) => setFirstNameValid(validateRequired(e.target.value))}
              isValid={firstNameValid.valid}
              errorMessage={firstNameValid.message}
              inputDisabled={!canEditProfile}
            />

            <Textfield
              label="MI"
              wrapperClass="mi"
              inputValue={props.profile?.middle_initial}
              inputOnChange={(e) => props.updateProfile('middle_initial', e.target.value)}
              maxLength="1"
              inputOnBlur={(e) => setMiddleInitialValid(validateLetter(e.target.value))}
              isValid={middleInitialValid.valid}
              errorMessage={middleInitialValid.message}
              inputDisabled={!canEditProfile}
            />

            <Textfield
              label="Last Name"
              wrapperClass="last-name"
              inputValue={props.profile?.last_name}
              inputOnChange={(e) => props.updateProfile('last_name', e.target.value)}
              inputRequired={true}
              inputOnBlur={(e) => setLastNameValid(validateRequired(e.target.value))}
              isValid={lastNameValid.valid}
              errorMessage={lastNameValid.message}
              inputDisabled={!canEditProfile}
            />
          </div>

          <div className="contact-details">
            <Textfield
              label="Job Title"
              wrapperClass="job-title"
              inputValue={props.profile?.job}
              inputOnChange={(e) => props.updateProfile('job', e.target.value)}
              inputRequired={true}
              inputOnBlur={(e) => setJobTitleValid(validateRequired(e.target.value))}
              isValid={jobTitleValid.valid}
              errorMessage={jobTitleValid.message}
              inputDisabled={!canEditIfApprovedOrDraft}
            />

            <Emailfield
              label="Email"
              wrapperClass="email"
              inputValue={props.profile?.username}
              inputOnChange={(e) => props.updateProfile('username', e.target.value)}
              inputRequired={true}
              inputOnBlur={updateEmailOnBlur}
              isValid={emailValid.valid}
              errorMessage={emailValid.message}
              inputDisabled={!canEditIfApprovedOrDraft}
            >
              {props.profile?.pending_email ? (
                <p className="infoMsg">*Confirming: {props.profile.pending_email}</p>
              ) : null}
            </Emailfield>

            <div className="tel-block">
              <Telephonefield
                label="Telephone"
                wrapperClass="telephone"
                inputValue={props.profile?.telephone}
                inputOnChange={(e) => props.updateProfile('telephone', e)}
                inputRequired={true}
                inputOnBlur={(e) => setTelephoneValid(validatePhoneNumber(e.target.value))}
                isValid={telephoneValid.valid}
                errorMessage={telephoneValid.message}
                inputDisabled={!canEditIfApprovedOrDraft}
              />

              <Textfield
                label="Ext"
                wrapperClass="extension"
                inputValue={props.profile?.extension}
                inputOnChange={(e) => props.updateProfile('extension', e.target.value)}
                inputRequired={false}
                inputOnBlur={(e) => setExtensionValid(validateNumeric(e.target.value))}
                isValid={extensionValid.valid}
                errorMessage={extensionValid.message}
                inputDisabled={!canEditIfApprovedOrDraft}
              />
            </div>
          </div>

          <AffiliationBlock
            selectedAffiliationType={props.profile?.affiliation_type}
            affiliationTypeValid={affiliationTypeValid.valid}
            affiliationTypeMessage={affiliationTypeValid.message}
            selectedAffiliation={props.profile?.AffiliationID}
            affiliationValid={affiliationValid.valid}
            affiliationMessage={affiliationValid.message}
            setAffiliationType={(e) => {
              props.updateProfile('affiliation_type', e.target.value);
              setAffiliationTypeValid(validateRequired(e.target.value));
            }}
            setAffiliation={(affiliation) => {
              props.updateProfile('AffiliationID', affiliation);
              setAffiliationValid(validateRequired(affiliation));
            }}
            fisherhouseOptions={
              fisherhouseOptions.find((item) => item.value === props.profile?.AffiliationID)
                ? fisherhouseOptions
                : fisherhouseOptionsIncludingArchiving.find(
                    (item) => item.value === props.profile?.AffiliationID
                  )
                ? [
                    ...fisherhouseOptions,
                    fisherhouseOptionsIncludingArchiving.find(
                      (item) => item.value === props.profile?.AffiliationID
                    ),
                  ]
                : fisherhouseOptions
            }
            medicalCenterOptions={
              medicalCenterOptions.find((item) => item.value === props.profile?.AffiliationID)
                ? medicalCenterOptions
                : medicalCenterOptionsIncludingArchiving.find(
                    (item) => item.value === props.profile?.AffiliationID
                  )
                ? [
                    ...medicalCenterOptions,
                    medicalCenterOptionsIncludingArchiving.find(
                      (item) => item.value === props.profile?.AffiliationID
                    ),
                  ]
                : medicalCenterOptions
            }
            baseOptions={
              baseOptions.find((item) => item.value === props.profile?.AffiliationID)
                ? baseOptions
                : baseOptionsIncludingArchiving.find(
                    (item) => item.value === props.profile?.AffiliationID
                  )
                ? [
                    ...baseOptions,
                    baseOptionsIncludingArchiving.find(
                      (item) => item.value === props.profile?.AffiliationID
                    ),
                  ]
                : baseOptions
            }
            organizationOptions={
              organizationOptions.find((item) => item.value === props.profile?.AffiliationID)
                ? organizationOptions
                : organizationOptionsIncludingArchiving.find(
                    (item) => item.value === props.profile?.AffiliationID
                  )
                ? [
                    ...organizationOptions,
                    organizationOptionsIncludingArchiving.find(
                      (item) => item.value === props.profile?.AffiliationID
                    ),
                  ]
                : organizationOptions
            }
            inputDisabled={!canEditAffiliation}
            ref={affiliationBlockRef}
            profile={props.profile}
          />

          <h3>Receive Email Notifications?</h3>

          <fieldset className="radios">
            <Radio
              label="Yes"
              inputValue="1"
              inputChecked={props.profile?.receive_emails}
              inputOnChange={(e) => props.updateProfile('receive_emails', true)}
              inputDisabled={!canEditIfApprovedOrDraft}
            />
            <Radio
              label="No"
              inputValue="0"
              inputChecked={!props.profile?.receive_emails}
              inputOnChange={(e) => props.updateProfile('receive_emails', false)}
              inputDisabled={!canEditIfApprovedOrDraft}
            />
          </fieldset>
        </form>
      </section>
      {props.profile?.status == USERSTATUS.DRAFT && (
        <div className="app-controls">
          <SubmitButton
            inputValue="Request Approval"
            inputClass="review"
            inputOnClick={handleUserRequestApproval}
            inputDisabled={buttonDisabled}
          />
        </div>
      )}
      {props.profile?.status == USERSTATUS.ACTIVE &&
        user?.attributes?.email == originalEmail &&
        !isAdministrator() && (
          <div className="app-controls">
            <SubmitButton
              inputValue="Save"
              inputClass="save"
              inputOnClick={handleUserSave}
              inputDisabled={buttonDisabled}
            />
          </div>
        )}
      {props.profile?.status == USERSTATUS.PENDING &&
        isAdministrator() &&
        user?.attributes?.email != originalEmail && (
          <div className="app-controls">
            <SubmitButton
              inputValue="Save"
              inputClass="save"
              inputOnClick={handleUserSave}
              inputDisabled={buttonDisabled}
            />
            <SubmitButton
              inputValue="Approve"
              inputClass="approve"
              inputOnClick={handleUserApproval}
              inputDisabled={buttonDisabled}
            />
          </div>
        )}
      {props.profile?.status == USERSTATUS.PENDING && !isAdministrator() && (
        <div className="app-controls">
          <div className="awaiting-admin-response">
            <span className="loading">Awaiting Admin Response</span>
          </div>
        </div>
      )}
      {props.profile?.status == USERSTATUS.ACTIVE &&
        isAdministrator() &&
        user?.attributes?.email != originalEmail && (
          <div className="app-controls">
            <SubmitButton
              inputValue="Save"
              inputClass="save"
              inputOnClick={handleUserSave}
              inputDisabled={buttonDisabled}
            />
            {isDeletable ? (
              <SubmitButton
                inputValue="Delete"
                inputClass="delete"
                inputOnClick={handleUserDelete}
                inputDisabled={buttonDisabled}
              />
            ) : (
              <SubmitButton
                inputValue="Archive"
                inputClass="archive"
                inputOnClick={handleUserArchive}
                inputDisabled={buttonDisabled}
              />
            )}
          </div>
        )}
      {props.profile?.status == USERSTATUS.INACTIVE &&
        isAdministrator() &&
        user?.attributes?.email != originalEmail && (
          <div className="app-controls">
            <SubmitButton
              inputValue="Save"
              inputClass="save"
              inputOnClick={handleUserSave}
              inputDisabled={buttonDisabled}
            />
            <SubmitButton
              inputValue="Activate"
              inputClass="approve"
              inputOnClick={handleUserApproval}
              inputDisabled={buttonDisabled}
            />
          </div>
        )}
      {isAdministrator() && user?.attributes?.email == originalEmail && (
        <div className="app-controls">
          <SubmitButton
            inputValue="Save"
            inputClass="save"
            inputOnClick={handleUserSave}
            inputDisabled={buttonDisabled}
          />
        </div>
      )}
    </div>
  );
}

ProfileForm.defaultProps = {
  profile: {
    first_name: '',
    last_name: '',
    middle_initial: '',
    job_title: '',
    email: '',
    telephone: '',
    extension: '',
    timezone: '',
    observes_dst: true,
    receives_email_notifications: true,
    fisherhouse: '',
    medicalcenter: '',
    organization: '',
    base: '',
    receive_emails: true,
    affiliation_type: '',
    affiliation: {},
  },
  updateProfile: () => {},
  saveProfile: () => {},
  deleteProfile: () => {},
};
