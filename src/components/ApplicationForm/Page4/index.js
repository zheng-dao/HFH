import { Fragment, useState, useCallback, useEffect } from 'react';
import ApplicationFormPage4Sidebar from './sidebar';
import useApplicationContext from '@contexts/ApplicationContext';
import { Application, ServiceMember, Stay } from '@src/models';
import {
  NOTEACTION,
  APPLICATIONSTATUS,
  STAYSTATUS,
  STAYTYPE,
  AFFILIATIONSTATUS,
  SERVICEMEMBERSTATUS,
  USERSTATUS,
} from '@src/API';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import useAuth from '@contexts/AuthContext';
import StayReview from '@components/StayReview';
import { useRouter } from 'next/router';
import useDialog from '@contexts/DialogContext';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import isAfterThreePM from '@utils/isAfterThreePM';
import RegressStayDialog from '@components/RegressStayDialog';
import createNote from '@utils/createNote';
import humanName from '@utils/humanName';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import { API, graphqlOperation } from 'aws-amplify';
import { getAffiliation, usersByStatus } from '@src/graphql/queries';
import { updateAffiliation, createStay } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import ExtendedStay from '@components/ExtendedStay';
import isApplicationEditable from '@utils/isApplicationEditable';
import htmlEntities from '@utils/htmlEntities';
import validateRequired from '@utils/validators/required';
import { format } from 'date-fns';
import stayStatusOptions from '@utils/stayStatusOptions';
import { onUpdateStay } from '@src/graphql/subscriptions';

export default function ApplicationFormPage4(props) {
  const {
    application,
    sourceApplication,
    setSourceApplication,
    saveApplication,
    setApplication,
    serviceMember,
    sourceServiceMember,
    setSourceServiceMember,
    setServiceMember,
    initialStay,
    setInitialStay,
    saveStay,
    saveServiceMember,
    missingLiaisonFields,
    missingServiceMemberFields,
    missingPatientFields,
    missingLodgingFields,
    deleteApplication,
    extendedStays,
    setExtendedStays,
    sourceExtendedStays,
    setSourceExtendedStays,
    applicant,
    primaryGuest,
    additionalGuests,
  } = useApplicationContext();

  const [showRegressStayDialog, setShowRegressStayDialog] = useState(false);
  const [regressionStayStatus, setRegressionStayStatus] = useState();
  const [regressionStayId, setRegressionStayId] = useState();
  const [regressToExceptionOverride, setRegressToExceptionOverride] = useState(true);
  const [currentRegressionStayStatus, setCurrentRegressionStayStatus] = useState(null);

  const router = useRouter();
  const { setMessage } = useDialog();
  const { isLiaison, isAdministrator, profile } = useAuth();

  const [allAdmins, setAllAdmins] = useState([]);
  const [allLiaisons, setAllLiaisons] = useState([]);

  const getLiaisonsInGroup = useCallback(async (token) => {
    let results = await API.get('Utils', '/utils/getLiaisons', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return results;
  }, []);

  const getAdminsInGroup = useCallback(async (token) => {
    let results = await API.get('Utils', '/utils/admins', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return results;
  }, []);

  const getUsersInGroup = useCallback(
    async (groupname, token) => {
      if (groupname == 'Liaisons') {
        return getLiaisonsInGroup(token);
      } else {
        return getAdminsInGroup(token);
      }
    },
    [getLiaisonsInGroup, getAdminsInGroup]
  );

  const getActiveUsers = useCallback(async (token) => {
    let results = await API.graphql(
      graphqlOperation(usersByStatus, {
        status: USERSTATUS.ACTIVE,
        nextToken: token,
      })
    );

    let finalResults = [];
    if (results.data.UsersByStatus && results.data.UsersByStatus.nextToken) {
      const moreResults = await getActiveUsers(results.data.UsersByStatus.nextToken);
      finalResults = results.data.UsersByStatus.items.concat(moreResults);
    } else {
      finalResults = results.data.UsersByStatus.items;
    }
    return finalResults;
  }, []);

  const getLiaisons = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Liaisons', null)]).then((values) => {
        const usersFromAPI = values[0];
        const usersFromLiaisons = values[1];
        resolve(
          usersFromAPI
            .filter((item) => usersFromLiaisons.includes(item.owner))
            .filter((item) => (isLiaison() ? profile?.AffiliationID == item?.AffiliationID : true))
            .map((item) => {
              return {
                value: item.id,
                label: humanName(item),
                AffiliationID: item?.AffiliationID,
                receive_emails: item?.receive_emails,
                email: item.username,
                first_name: item.first_name,
              };
            })
        );
      });
    });
  }, [getActiveUsers, getUsersInGroup, isLiaison, profile?.AffiliationID]);

  const getAdmins = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all([getActiveUsers(), getUsersInGroup('Admins', null)]).then((values) => {
        const usersFromAPI = values[0];
        const usersFromAdmins = values[1];
        resolve(
          usersFromAPI
            .filter((item) => usersFromAdmins.includes(item.owner))
            .map((item) => {
              return {
                value: item.id,
                label: humanName(item),
                AffiliationID: item?.AffiliationID,
                receive_emails: item?.receive_emails,
                email: item.username,
                first_name: item.first_name,
              };
            })
        );
      });
    });
  }, [getActiveUsers, getUsersInGroup]);

  useEffect(() => {
    getAdmins().then((result) => setAllAdmins(result));
    getLiaisons().then((result) => setAllLiaisons(result));
    const subscription = API.graphql(
      graphqlOperation(onUpdateStay, {
        applicationID: application?.id,
      })
    ).subscribe({
      next: ({ provider, value }) => {
        const newStay = deserializeModel(Stay, value?.data?.onUpdateStay);
        if (newStay.type === 'INITIAL') {
          if (
            newStay.charge_reconcile !== initialStay.charge_reconcile ||
            newStay.points_reconcile !== initialStay.points_reconcile
          ) {
            setInitialStay(newStay);
          }
        } else {
          const extendedStay = extendedStays.find((item) => item.id === newStay.id);
          if (
            newStay.charge_reconcile !== extendedStay.charge_reconcile ||
            newStay.points_reconcile !== extendedStay.points_reconcile
          ) {
            setExtendedStays(
              extendedStays.map((item) => {
                return item.id == newStay.id ? newStay : item;
              })
            );
          }
        }
      },
      error: (e) => console.log('Error when subscribed to Note updates.', e),
    });

    return () => {
      console.log('Attempting to unsubscribe.');
      subscription.unsubscribe();
    };
  }, [
    getAdmins,
    getLiaisons,
    application?.id,
    extendedStays,
    setExtendedStays,
    setInitialStay,
    initialStay?.charge_reconcile,
    initialStay?.points_reconcile,
  ]);

  const updateAndSaveLiaisonAgreement = (e) => {
    const newApplication = Application.copyOf(application, (updated) => {
      updated.liaison_terms_of_use_agreement = e.target.checked;
    });
    setApplication(newApplication);
    const originalValue =
      sourceApplication.liaison_terms_of_use_agreement == null
        ? htmlEntities('<no selection>')
        : sourceApplication.liaison_terms_of_use_agreement
        ? 'Yes'
        : htmlEntities('<no selection>');
    const newValue = newApplication.liaison_terms_of_use_agreement
      ? 'Yes'
      : htmlEntities('<no selection>');
    setSourceApplication(newApplication);
    saveApplication(newApplication)
      .then(() => {
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile, true) +
              ' changed <span class="field">Liaison Terms of Use Agreement</span> from ' +
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
        toast('Saved Liaison Terms of Use Agreement.');
      });
  };

  const updateAndSaveServiceMemberAgreement = (e) => {
    const newApplication = Application.copyOf(application, (updated) => {
      updated.sm_terms_of_use_agreement = e.target.checked;
    });
    setApplication(newApplication);
    const originalValue =
      sourceApplication.sm_terms_of_use_agreement == null
        ? htmlEntities('<no selection>')
        : sourceApplication.sm_terms_of_use_agreement
        ? 'Yes'
        : htmlEntities('<no selection>');
    const newValue = newApplication.sm_terms_of_use_agreement
      ? 'Yes'
      : htmlEntities('<no selection>');
    setSourceApplication(newApplication);
    saveApplication(newApplication)
      .then(() => {
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile, true) +
              ' changed <span class="field">Service Member Terms of Use Agreement</span> from ' +
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
        toast('Saved Service Member Terms of Use Agreement.');
      });
  };

  const updateServiceMemberLodgingExplanation = (e) => {
    setServiceMember(
      ServiceMember.copyOf(serviceMember, (updated) => {
        updated.lodging_explanation = e.target.value;
      })
    );
  };

  const updateServiceMemberUnidentifiedExplanation = (e) => {
    setServiceMember(
      ServiceMember.copyOf(serviceMember, (updated) => {
        updated.unidentified_explanation = e.target.value;
      })
    );
  };

  const saveServiceMemberDetails = () => {
    const originalValue = sourceServiceMember?.lodging_explanation || htmlEntities('<empty>');
    const newValue = serviceMember?.lodging_explanation || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then(() => {
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile, true) +
              ' changed <span class="field">Missing ITO and Reimbursement Explanation</span> from ' +
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
        toast('Saved Missing ITO and Reimbursement Explanation.');
      });
  };

  const saveServiceMemberUnidentifiedExplanation = () => {
    const originalValue = sourceServiceMember?.unidentified_explanation || htmlEntities('<empty>');
    const newValue = serviceMember?.unidentified_explanation || htmlEntities('<empty>');
    setSourceServiceMember(serviceMember);
    saveServiceMember(serviceMember)
      .then(() => {
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile, true) +
              ' changed <span class="field">Unidentified Service Member Explanation</span> from ' +
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
        toast('Saved Unidentified Service Member Explanation.');
      });
  };

  const isUnidentifiedServiceMember = !serviceMember?.first_name || !serviceMember?.last_name;

  const missingRequiredFields =
    missingLiaisonFields().length > 0 ||
    missingServiceMemberFields().length > 0 ||
    missingPatientFields().length > 0 ||
    missingLodgingFields().length > 0;

  const canBeSubmittedAsException =
    missingRequiredFields ||
    serviceMember?.current_status != SERVICEMEMBERSTATUS.VETERAN ||
    (serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN &&
      serviceMember?.on_military_travel_orders);

  const isToday = (dateToCheck) => {
    const today = new Date();
    return (
      dateToCheck.getDate() == today.getDate() &&
      dateToCheck.getMonth() == today.getMonth() &&
      dateToCheck.getFullYear() == today.getFullYear()
    );
  };

  const checkSameDayAfterThree = () => {
    const currentTime = new Date();
    if (initialStay?.requested_check_in) {
      if (isToday(makeTimezoneAwareDate(initialStay.requested_check_in))) {
        // After 3pm
        if (isAfterThreePM(currentTime)) {
          // User is trying to submit same day checkin.
          if (!isAdministrator()) {
            const newStay = Stay.copyOf(initialStay, (updated) => {
              updated.requested_check_in = e ? format(e, 'yyyy-MM-dd') : e;
            });
            setInitialStay(newStay);
            setSourceInitialStay(newStay);
            saveStay(newStay).then(() => {
              toast('Saved Check In.');
            });
            setMessage(
              'Your check in date is no longer valid. After 3pm Eastern Time, we require a check in date of tomorrow or later. Please update your check in date or submit the application as an Exception. Please also contact us by phone if this application needs attention today.'
            );
            return false;
          }
        }
      }
    }
    return true;
  };

  const lodgingExplanationDescription = () => {
    switch (serviceMember?.current_status) {
      case '':
      case null:
        switch (serviceMember?.on_military_travel_orders) {
          case '':
          case null:
            return "It is unknown whether this unknown status service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case true:
            return "This unknown status service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case false:
            return "This unknown status service member's family is not on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;
        }
        break;

      case SERVICEMEMBERSTATUS.ACTIVEDUTY:
        switch (serviceMember?.on_military_travel_orders) {
          case '':
          case null:
            return "It is unknown whether this Active Duty service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case true:
            return "This Active Duty service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case false:
            return "This Active Duty service member's family is not on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;
        }
        break;

      case SERVICEMEMBERSTATUS.NATIONALGUARD:
        switch (serviceMember?.on_military_travel_orders) {
          case '':
          case null:
            return "It is unknown whether this National Guard service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case true:
            return "This National Guard service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case false:
            return "This National Guard service member's family is not on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;
        }
        break;

      case SERVICEMEMBERSTATUS.RESERVE:
        switch (serviceMember?.on_military_travel_orders) {
          case '':
          case null:
            return "It is unknown whether this Reserve service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case true:
            return "This Reserve service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case false:
            return "This Reserve service member's family <strong>is not</strong> on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;
        }
        break;

      case SERVICEMEMBERSTATUS.VETERAN:
        switch (serviceMember?.on_military_travel_orders) {
          case '':
          case null:
            return "It is unknown whether this Veteran service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case true:
            return "This Veteran service member's family is on military travel orders (ITO's) or eligible for lodging reimbursement.";
            break;

          case false:
            return '';
            break;
        }
        break;

      default:
        break;
    }
    return '';
  };

  const craftExceptionNote = () => {
    let output = '';

    output +=
      humanName(profile, true) +
      ' requested an exception for the Initial Stay (' +
      (initialStay?.requested_check_in
        ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
        : '') +
      ' - ' +
      (initialStay?.requested_check_out
        ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
        : '') +
      ').';

    // Service member not on ITOs.
    if (
      serviceMember?.current_status != SERVICEMEMBERSTATUS.VETERAN ||
      serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN
    ) {
      output +=
        '<ul class="exception-fields"><li>' + lodgingExplanationDescription() + '</li></ul>';
      output +=
        '<h5>Explanation:</h5><p><em>' + (serviceMember?.lodging_explanation || '') + '</em></p>';
    }

    // Unidentified service member.
    if (isUnidentifiedServiceMember) {
      output += '<h5>The service member has not been identified.</h5>';
      output +=
        '<ul class="exception-fields">' +
        missingServiceMemberFields().map((item) => '<li>' + item + '</li>') +
        '</ul>';
      output +=
        '<h5>Circumstances:</h5><p><em>' + serviceMember?.unidentified_explanation + '</em></p>';
    }

    // Missing fields.
    if (missingRequiredFields) {
      output += '<h5>The following fields were incomplete:</h5>';

      if (missingLiaisonFields().length > 0) {
        output += '<h5>Liaison / Referrer</h5>';
        output +=
          '<ul class="exception-fields">' +
          missingLiaisonFields().map((item) => '<li>' + item + '</li>') +
          '</ul>';
      }

      if (!isUnidentifiedServiceMember && missingServiceMemberFields().length > 0) {
        output += '<h5>Service Member</h5>';
        output +=
          '<ul class="exception-fields">' +
          missingServiceMemberFields().map((item) => '<li>' + item + '</li>') +
          '</ul>';
      }

      if (missingPatientFields().length > 0) {
        output += '<h5>Patient</h5>';
        output +=
          '<ul class="exception-fields">' +
          missingPatientFields().map((item) => '<li>' + item + '</li>') +
          '</ul>';
      }

      if (missingLodgingFields().length > 0) {
        output += '<h5>Lodging</h5>';
        output +=
          '<ul class="exception-fields">' +
          missingLodgingFields().map((item) => '<li>' + item + '</li>') +
          '</ul>';
      }

      output +=
        '<h5>Reason for incomplete fields:</h5><p><em>' +
        application?.exception_narrative +
        '</em></p>';
    }

    return output;
  };

  const missingRequiredExceptionFields = () => {
    if (isUnidentifiedServiceMember) {
      // Missing service member
      if (
        !serviceMember?.unidentified_explanation ||
        serviceMember.unidentified_explanation.trim().length == 0
      ) {
        return true;
      }
    }
    if (
      serviceMember?.current_status != SERVICEMEMBERSTATUS.VETERAN ||
      (serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN &&
        serviceMember?.on_military_travel_orders)
    ) {
      // Needs lodging explanation
      if (
        !serviceMember?.lodging_explanation ||
        serviceMember.lodging_explanation.trim().length == 0
      ) {
        return true;
      }
    }
    if (missingRequiredFields) {
      // Exception narrative
      if (!application?.exception_narrative || application.exception_narrative.trim().length == 0) {
        return true;
      }
    }
  };

  const missingSuggestedAffiliationFields = () => {
    if (
      applicant?.Affiliation?.status == AFFILIATIONSTATUS.DRAFT ||
      applicant?.Affiliation?.status == AFFILIATIONSTATUS.PENDING
    ) {
      return (
        !validateRequired(applicant?.Affiliation?.name).valid ||
        !validateRequired(applicant?.Affiliation?.city).valid ||
        !validateRequired(applicant?.Affiliation?.state).valid
      );
    }
    return false;
  };

  const missingSuggestedTreatmentFacilityFields = () => {
    if (
      serviceMember?.TreatmentFacility?.status == AFFILIATIONSTATUS.DRAFT ||
      serviceMember?.TreatmentFacility?.status == AFFILIATIONSTATUS.PENDING
    ) {
      return (
        !validateRequired(serviceMember?.TreatmentFacility?.name).valid ||
        !validateRequired(serviceMember?.TreatmentFacility?.city).valid ||
        !validateRequired(serviceMember?.TreatmentFacility?.state).valid
      );
    }
    return false;
  };

  const submitStayAsException = (e) => {
    e.preventDefault();
    if (missingRequiredExceptionFields()) {
      props.setShouldShowErrorMessagesFromSubmitValidation(true);
      alert('Please fill in all reasons for exceptions on this tab before submitting.');
      return;
    }
    if (missingSuggestedAffiliationFields()) {
      props.setShouldShowErrorMessagesFromSubmitValidation(true);
      alert(
        'Please fully complete the information for your suggested Affiliation before submitting.'
      );
      return;
    }
    if (missingSuggestedTreatmentFacilityFields()) {
      props.setShouldShowErrorMessagesFromSubmitValidation(true);
      alert(
        'Please fully complete the information for your suggested Treatment Facility before submitting.'
      );
      return;
    }
    if (checkSameDayAfterThree()) {
      if (
        confirm(
          'You have not completed all of the normally required fields on this application. Would you like to submit it as an exception?'
        )
      ) {
        const newStay = Stay.copyOf(initialStay, (u) => {
          u.status = STAYSTATUS.EXCEPTION;
        });
        setInitialStay(newStay);
        saveStay(newStay)
          .then(() => {
            if (isAdministrator()) {
              const newApplication = Application.copyOf(application, (u) => {
                u.status = APPLICATIONSTATUS.EXCEPTION;
                u.applicationAssignedToId = profile.id;
              });
              setApplication(newApplication);
              saveApplication(newApplication);
            } else {
              const newApplication = Application.copyOf(application, (u) => {
                u.status = APPLICATIONSTATUS.EXCEPTION;
              });
              setApplication(newApplication);
              saveApplication(newApplication);
            }
          })
          .then(async () => {
            createNote(craftExceptionNote(), NOTEACTION.REQUEST_EXCEPTION, application, profile);
            let to = '';
            const dates =
              (initialStay?.requested_check_in
                ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
                : '') +
              ' - ' +
              (initialStay?.requested_check_out
                ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
                : '');
            let emails = [];
            if (application?.applicationUserId && !application?.applicationAssignedToId) {
              emails = allAdmins.map((item) => item?.email);
              to = 'Administrators';
            } else if (
              !application?.applicationUserId &&
              application?.applicationAssignedToId &&
              application?.AffiliationID
            ) {
              emails = allLiaisons
                .filter((item) => item?.AffiliationID === application.AffiliationID)
                .map((item) => item?.email);
              to = 'Liaisons';
            } else if (
              !application?.applicationUserId &&
              application?.applicationAssignedToId &&
              !application?.AffiliationID
            ) {
              return;
              // emails = allLiaisons.filter(item => item.AffiliationID === profile.AffiliationID).map(item => item?.email);
              // to = 'Liaisons';
            } else {
              if (isAdministrator()) {
                emails.push(application?.User?.username);
                to = humanName(application?.User);
              } else {
                emails.push(application?.AssignedTo?.username);
                to = humanName(application?.AssignedTo);
              }
            }
            let results = await API.post('Utils', '/utils/notify/application/exception', {
              body: {
                to: to,
                name: humanName(profile),
                service_member_name: humanName(serviceMember),
                dates: dates,
                link: window.location.href,
                email: emails,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });
          })
          .then(() => {
            checkAndPromoteDraftAffiliations();
          })
          .then(() => {
            toast('Submitted Application as Exception.');
            let message =
              'Thank you for submitting your Exception Application for lodging to the Hotels for Heroes program.';
            const currentTime = new Date();
            if (isAfterThreePM(currentTime)) {
              message +=
                ' You have submitted your request after 3 p.m. Eastern Time, and your request will be processed on the next business day.';
            }
            setMessage(message);
            // if (isLiaison()) {
            //   router.push('/');
            // }
          });
      } else {
        props.setShouldShowErrorMessagesFromSubmitValidation(true);
      }
    }
  };

  const submitStay = (e) => {
    e.preventDefault();
    if (missingSuggestedAffiliationFields()) {
      props.setShouldShowErrorMessagesFromSubmitValidation(true);
      alert(
        'Please fully complete the information for your suggested Affiliation before submitting.'
      );
      return;
    }
    if (missingSuggestedTreatmentFacilityFields()) {
      props.setShouldShowErrorMessagesFromSubmitValidation(true);
      alert(
        'Please fully complete the information for your suggested Treatment Facility before submitting.'
      );
      return;
    }
    if (checkSameDayAfterThree()) {
      if (confirm('Submitting application. Are you sure?')) {
        const newStay = Stay.copyOf(initialStay, (u) => {
          u.status = STAYSTATUS.REQUESTED;
        });
        setInitialStay(newStay);
        saveStay(newStay)
          .then(() => {
            if (isAdministrator()) {
              const newApplication = Application.copyOf(application, (u) => {
                u.status = APPLICATIONSTATUS.REQUESTED;
                u.applicationAssignedToId = profile.id;
              });
              setApplication(newApplication);
              saveApplication(newApplication);
            } else {
              const newApplication = Application.copyOf(application, (u) => {
                u.status = APPLICATIONSTATUS.REQUESTED;
              });
              setApplication(newApplication);
              saveApplication(newApplication);
            }
          })
          .then(async () => {
            createNote(
              humanName(profile, true) +
                ' requested an Initial Stay (' +
                (initialStay?.requested_check_in
                  ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
                  : '') +
                ' - ' +
                (initialStay?.requested_check_out
                  ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
                  : '') +
                ').',
              NOTEACTION.REQUEST_INITIAL_STAY,
              application,
              profile
            );

            let to = '';
            const dates =
              (initialStay?.requested_check_in
                ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
                : '') +
              ' - ' +
              (initialStay?.requested_check_out
                ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
                : '');
            let emails = [];
            if (application?.applicationUserId && !application?.applicationAssignedToId) {
              emails = allAdmins.map((item) => item?.email);
              to = 'Administrators';
            } else if (
              !application?.applicationUserId &&
              application?.applicationAssignedToId &&
              application?.AffiliationID
            ) {
              emails = allLiaisons
                .filter((item) => item?.AffiliationID === application.AffiliationID)
                .map((item) => item?.email);
              to = 'Liaisons';
            } else if (
              !application?.applicationUserId &&
              application?.applicationAssignedToId &&
              !application?.AffiliationID
            ) {
              return;
              // emails = allLiaisons.filter(item => item.AffiliationID === profile.AffiliationID).map(item => item?.email);
              // to = 'Liaisons';
            } else {
              if (isAdministrator()) {
                emails.push(application?.User?.username);
                to = humanName(application?.User);
              } else {
                emails.push(application?.AssignedTo?.username);
                to = humanName(application?.AssignedTo);
              }
            }
            let results = await API.post('Utils', '/utils/notify/application/requested', {
              body: {
                to: to,
                name: humanName(profile),
                service_member_name: humanName(serviceMember),
                initial: true,
                dates: dates,
                link: window.location.href,
                email: emails,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });
          })
          .then(() => {
            checkAndPromoteDraftAffiliations();
          })
          .then(() => {
            toast('Submitted Application.');
            let message =
              'Thank you for submitting your Application for lodging to the Hotels for Heroes program.';
            const currentTime = new Date();
            if (isAfterThreePM(currentTime)) {
              message +=
                ' You have submitted your request after 3 p.m. Eastern Time, and your request will be processed on the next business day.';
            }
            setMessage(message);
            // if (isLiaison()) {
            //   router.push('/');
            // }
          });
      }
    }
  };

  const checkAndPromoteDraftAffiliations = () => {
    const liaisonAffiliationId = applicant?.applicantAffiliationId;
    const treatmentFacilityId = serviceMember?.serviceMemberTreatmentFacilityId;
    if (liaisonAffiliationId) {
      API.graphql(graphqlOperation(getAffiliation, { id: liaisonAffiliationId })).then((aff) => {
        if (
          aff &&
          aff.data &&
          aff.data.getAffiliation &&
          aff.data.getAffiliation.status == AFFILIATIONSTATUS.DRAFT
        ) {
          API.graphql(
            graphqlOperation(updateAffiliation, {
              input: { id: liaisonAffiliationId, status: AFFILIATIONSTATUS.PENDING },
            })
          );
        }
      });
    }
    if (treatmentFacilityId) {
      API.graphql(graphqlOperation(getAffiliation, { id: treatmentFacilityId })).then((aff) => {
        if (
          aff &&
          aff.data &&
          aff.data.getAffiliation &&
          aff.data.getAffiliation.status == AFFILIATIONSTATUS.DRAFT
        ) {
          API.graphql(
            graphqlOperation(updateAffiliation, {
              input: { id: treatmentFacilityId, status: AFFILIATIONSTATUS.PENDING },
            })
          );
        }
      });
    }
  };

  const updateStay = (stay, updateFunction) => {
    setInitialStay(Stay.copyOf(stay, updateFunction));
  };

  const updateAndSaveStay = (stay, updateFunction) => {
    const newStay = Stay.copyOf(stay, updateFunction);
    // setInitialStay(newStay);
    saveStay(newStay)
      .then((s) => {
        setInitialStay(s)
      })
      .then(() => toast('Saved Stay'));
  };

  const returnStay = (stay) => {
    const newStay = Stay.copyOf(stay, (u) => {
      u.status = STAYSTATUS.RETURNED;
    });
    setInitialStay(newStay);
    saveStay(newStay)
      .then(() => {
        const newApplication = Application.copyOf(application, (u) => {
          u.status = APPLICATIONSTATUS.RETURNED;
        });
        setApplication(newApplication);
        saveApplication(newApplication);
      })
      .then(async () => {
        createNote(
          humanName(profile, true) +
            ' returned the Initial Stay (' +
            (initialStay?.requested_check_in
              ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (initialStay?.requested_check_out
              ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
              : '') +
            ').',
          NOTEACTION.RETURN,
          application,
          profile
        );
        let to = '';
        const dates =
          (initialStay?.requested_check_in
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
            : '') +
          ' - ' +
          (initialStay?.requested_check_out
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
            : '');
        let emails = [];
        if (application?.applicationUserId && !application?.applicationAssignedToId) {
          emails = allAdmins.map((item) => item?.email);
          to = 'Administrators';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          application?.AffiliationID
        ) {
          emails = allLiaisons
            .filter((item) => item?.AffiliationID === application.AffiliationID)
            .map((item) => item?.email);
          to = 'Liaisons';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          !application?.AffiliationID
        ) {
          return;
          // emails = allLiaisons.filter(item => item.AffiliationID === profile.AffiliationID).map(item => item?.email);
          // to = 'Liaisons';
        } else {
          if (isAdministrator()) {
            emails.push(application?.User?.username);
            to = humanName(application?.User);
          } else {
            emails.push(application?.AssignedTo?.username);
            to = humanName(application?.AssignedTo);
          }
        }
        let results = await API.post('Utils', '/utils/notify/application/returned', {
          body: {
            to: to,
            name: humanName(profile),
            service_member_name: humanName(serviceMember),
            initial: true,
            dates: dates,
            reason: stay.reason_return,
            link: window.location.href,
            email: emails,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
      .then(() => toast('Returned Application.'));
  };

  const declineStay = (stay) => {
    const newStay = Stay.copyOf(stay, (u) => {
      u.status = STAYSTATUS.DECLINED;
    });
    setInitialStay(newStay);
    saveStay(newStay)
      .then(() => {
        const newApplication = Application.copyOf(application, (u) => {
          u.status = APPLICATIONSTATUS.DECLINED;
        });
        setApplication(newApplication);
        saveApplication(newApplication);
      })
      .then(async () => {
        createNote(
          humanName(profile, true) +
            ' declined the Initial Stay (' +
            (initialStay?.requested_check_in
              ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (initialStay?.requested_check_out
              ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
              : '') +
            ').',
          NOTEACTION.DECLINE,
          application,
          profile
        );
        let to = '';
        const dates =
          (initialStay?.requested_check_in
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
            : '') +
          ' - ' +
          (initialStay?.requested_check_out
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
            : '');
        let emails = [];
        if (application?.applicationUserId && !application?.applicationAssignedToId) {
          emails = allAdmins.map((item) => item?.email);
          to = 'Administrators';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          application?.AffiliationID
        ) {
          emails = allLiaisons
            .filter((item) => item?.AffiliationID === application.AffiliationID)
            .map((item) => item?.email);
          to = 'Liaisons';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          !application?.AffiliationID
        ) {
          return;
          // emails = allLiaisons.filter(item => item.AffiliationID === profile.AffiliationID).map(item => item?.email);
          // to = 'Liaisons';
        } else {
          if (isAdministrator()) {
            emails.push(application?.User?.username);
            to = humanName(application?.User);
          } else {
            emails.push(application?.AssignedTo?.username);
            to = humanName(application?.AssignedTo);
          }
        }
        let results = await API.post('Utils', '/utils/notify/application/declined', {
          body: {
            to: to,
            name: humanName(profile),
            service_member_name: humanName(serviceMember),
            initial: true,
            dates: dates,
            reason: stay.reason_decline,
            link: window.location.href,
            email: emails,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
      .then(() => toast('Declined Application.'));
  };

  const approveStay = (stay) => {
    if (applicant.collected_outside_fisherhouse) {
      if (!applicant.Affiliation) {
      } else {
        if (applicant.Affiliation?.status === 'DRAFT') {
          setMessage(
            `The liaison proposed an affiliation which hasn't been approved. Please review the proposed affiliation.`
          );
          return;
        }
      }
    }

    if (!serviceMember.TreatmentFacility) {
    } else {
      if (serviceMember.TreatmentFacility?.status === 'DRAFT') {
        setMessage(
          `The liaison proposed a treatment facility which hasn't been approved. Please review the proposed treatment facility.`
        );
        return;
      }
    }

    const newStay = Stay.copyOf(stay, (u) => {
      u.status = STAYSTATUS.APPROVED;
    });
    setInitialStay(newStay);
    saveStay(newStay)
      .then(() => {
        const newApplication = Application.copyOf(application, (u) => {
          u.status = APPLICATIONSTATUS.APPROVED;
        });
        setApplication(newApplication);
        saveApplication(newApplication);
      })
      .then(async () => {
        createNote(
          humanName(profile, true) +
            ' approved the Initial Stay (' +
            (initialStay?.requested_check_in
              ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (initialStay?.requested_check_out
              ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
              : '') +
            ').',
          NOTEACTION.APPROVE,
          application,
          profile
        );

        let to = '';
        const dates =
          (initialStay?.requested_check_in
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
            : '') +
          ' - ' +
          (initialStay?.requested_check_out
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
            : '');
        let emails = [];
        if (application?.applicationUserId && !application?.applicationAssignedToId) {
          emails = allAdmins.map((item) => item?.email);
          to = 'Administrators';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          application?.AffiliationID
        ) {
          emails = allLiaisons
            .filter((item) => item?.AffiliationID === application.AffiliationID)
            .map((item) => item?.email);
          to = 'Liaisons';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          !application?.AffiliationID
        ) {
          return;
          // emails = allLiaisons.filter(item => item.AffiliationID === profile.AffiliationID).map(item => item?.email);
          // to = 'Liaisons';
        } else {
          if (isAdministrator()) {
            emails.push(application?.User?.username);
            to = humanName(application?.User);
          } else {
            emails.push(application?.AssignedTo?.username);
            to = humanName(application?.AssignedTo);
          }
        }
        let results = await API.post('Utils', '/utils/notify/application/approved', {
          body: {
            to: to,
            name: humanName(profile),
            service_member_name: humanName(serviceMember),
            initial: true,
            dates: dates,
            link: window.location.href,
            email: emails,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
      .then(() => toast('Approved Application.'));
  };

  const completeStay = async (stay) => {
    const newStay = Stay.copyOf(stay, (u) => {
      u.status = STAYSTATUS.COMPLETED;
    });
    setInitialStay(newStay);
    saveStay(newStay)
      .then(() => {
        const newApplication = Application.copyOf(application, (u) => {
          u.status = APPLICATIONSTATUS.COMPLETED;
        });
        setApplication(newApplication);
        saveApplication(newApplication);
      })
      .then(async () => {
        let to = '';
        const dates =
          (initialStay?.requested_check_in
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
            : '') +
          ' - ' +
          (initialStay?.requested_check_out
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
            : '');
        const requested_dates =
          (initialStay?.requested_check_in
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_in), 'MM/dd/yyyy')
            : '') +
          ' - ' +
          (initialStay?.requested_check_out
            ? format(makeTimezoneAwareDate(initialStay?.requested_check_out), 'MM/dd/yyyy')
            : '');
        const actual_dates =
          (initialStay?.actual_check_in
            ? format(makeTimezoneAwareDate(initialStay?.actual_check_in), 'MM/dd/yyyy')
            : '') +
          ' - ' +
          (initialStay?.actual_check_out
            ? format(makeTimezoneAwareDate(initialStay?.actual_check_out), 'MM/dd/yyyy')
            : '');
        const completion_type = initialStay.guest_stayed_at_hotel
          ? initialStay?.actual_check_in !== initialStay?.requested_check_in ||
            initialStay?.actual_check_out !== initialStay?.requested_check_out
            ? 'modified'
            : 'stayed'
          : 'noshow';
        const reason =
          completion_type === 'modified' || completion_type === 'noshow'
            ? initialStay.reason_guest_did_not_stay
            : '';

        var note = '';
        if (completion_type === 'modified') {
          note =
            humanName(profile, true) +
            ' completed the Initial Stay with changes (Requested: ' +
            (initialStay.requested_check_in
              ? format(makeTimezoneAwareDate(initialStay.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (initialStay.requested_check_out
              ? format(makeTimezoneAwareDate(initialStay.requested_check_out), 'MM/dd/yyyy')
              : '') +
            ', Actual: ' +
            format(makeTimezoneAwareDate(initialStay.actual_check_in), 'MM/dd/yyyy') +
            ' - ' +
            format(makeTimezoneAwareDate(initialStay.actual_check_out), 'MM/dd/yyyy') +
            '). Reason: <em>' +
            initialStay.reason_guest_did_not_stay +
            '</em>';
        } else if (completion_type === 'stayed') {
          note =
            humanName(profile, true) +
            ' completed the Initial Stay without changes (' +
            (initialStay.actual_check_in
              ? format(makeTimezoneAwareDate(initialStay.actual_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (initialStay.actual_check_out
              ? format(makeTimezoneAwareDate(initialStay.actual_check_out), 'MM/dd/yyyy')
              : '') +
            ').';
        } else {
          note =
            humanName(profile, true) +
            ' completed the Initial Stay. The guest(s) did not stay (Requested: ' +
            (initialStay.requested_check_in
              ? format(makeTimezoneAwareDate(initialStay.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (initialStay.requested_check_out
              ? format(makeTimezoneAwareDate(initialStay.requested_check_out), 'MM/dd/yyyy')
              : '') +
            ', Actual: None). Reason: <em>' +
            initialStay.reason_guest_did_not_stay +
            '</em>';
        }

        createNote(note, NOTEACTION.COMPLETE_INITIAL_STAY, application, profile);

        let emails = [];
        if (application?.applicationUserId && !application?.applicationAssignedToId) {
          emails = allAdmins.map((item) => item?.email);
          to = 'Administrators';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          application?.AffiliationID
        ) {
          emails = allLiaisons
            .filter((item) => item?.AffiliationID === application.AffiliationID)
            .map((item) => item?.email);
          to = 'Liaisons';
        } else if (
          !application?.applicationUserId &&
          application?.applicationAssignedToId &&
          !application?.AffiliationID
        ) {
          return;
          // emails = allLiaisons.filter(item => item.AffiliationID === profile.AffiliationID).map(item => item?.email);
          // to = 'Liaisons';
        } else {
          if (isAdministrator()) {
            emails.push(application?.User?.username);
            to = humanName(application?.User);
          } else {
            emails.push(application?.AssignedTo?.username);
            to = humanName(application?.AssignedTo);
          }
        }

        let results = await API.post('Utils', '/utils/notify/application/completed', {
          body: {
            to: to,
            name: humanName(profile),
            service_member_name: humanName(serviceMember),
            initial: true,
            dates: dates,
            completion_type: completion_type,
            requested_dates: requested_dates,
            actual_dates: actual_dates,
            reason: reason,
            link: window.location.href,
            email: emails,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
      .then(() => toast('Completed Application.'));
  };

  const reviewStay = (stay) => {
    const newStay = Stay.copyOf(stay, (u) => {
      u.status = STAYSTATUS.REVIEWED;
      u.ready_for_final_reconcile = true;
    });
    setInitialStay(newStay);
    saveStay(newStay)
      .then(() => {
        const newApplication = Application.copyOf(application, (u) => {
          u.status = APPLICATIONSTATUS.REVIEWED;
        });
        setApplication(newApplication);
        saveApplication(newApplication);
      })
      .then(() => {
        var note = '';
        if (initialStay.guest_stayed_at_hotel) {
          note =
            humanName(profile, true) +
            ' reviewed the Initial Stay (' +
            ((initialStay.actual_check_in
              ? format(makeTimezoneAwareDate(initialStay.actual_check_in), 'MM/dd/yyyy')
              : '') +
              ' - ') +
            (initialStay.actual_check_out
              ? format(makeTimezoneAwareDate(initialStay.actual_check_out), 'MM/dd/yyyy')
              : '') +
            ').';
        } else {
          note =
            humanName(profile, true) +
            ' reviewed the Initial Stay (' +
            ((initialStay.requested_check_in
              ? format(makeTimezoneAwareDate(initialStay.requested_check_in), 'MM/dd/yyyy')
              : '') +
              ' - ') +
            (initialStay.requested_check_out
              ? format(makeTimezoneAwareDate(initialStay.requested_check_out), 'MM/dd/yyyy')
              : '') +
            ').';
        }
        createNote(note, NOTEACTION.REVIEWED, application, profile);
      })
      .then(() => toast('Reviewed Application.'));
  };

  const updateExceptionNarrative = (e) => {
    const newApplication = Application.copyOf(deserializeModel(Application, application), (u) => {
      u.exception_narrative = e.target.value;
    });
    setApplication(newApplication);
  };

  const deleteApplicationAction = (e) => {
    e.preventDefault();
    if (
      confirm('Are you sure you want to delete your application? This action cannot be un-done.')
    ) {
      deleteApplication()
        .then(() => {
          setMessage('Your application has been deleted.');
          if (props.fromGroupView) {
            props.removeApplicationFromList(application?.id);
          } else {
            router.push('/');
          }
        })
        .catch((e) => {
          setMessage(
            'There was an error deleting your application. Please try again later, or contact support.'
          );
        });
    }
  };

  const saveApplicationDetails = () => {
    const originalValue = sourceApplication?.exception_narrative || htmlEntities('<empty>');
    const newValue = application?.exception_narrative || htmlEntities('<empty>');
    setSourceApplication(application);
    saveApplication(application)
      .then(() => {
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile, true) +
              ' changed <span class="field">Incomplete Required Fields Explanation</span> from ' +
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
        toast('Saved Incomplete Required Fields Explanation.');
      });
  };

  const [shouldShowTermsDetails, setShouldShowTermsDetails] = useState(false);

  const toggleShouldShowTermsDetails = (e) => {
    e.preventDefault();
    setShouldShowTermsDetails(!shouldShowTermsDetails);
  };

  const termsSubmittedClasses = classNames('terms', {
    hidden: !shouldShowTermsDetails,
  });

  const toggleRegressStayDialog = (stayId) => {
    setRegressionStayId(stayId);
    if (initialStay.id == stayId) {
      setRegressionStayStatus(
        Object.keys(stayStatusOptions(initialStay.status, canBeSubmittedAsException))[0]
      );
      setRegressToExceptionOverride(true);
      setCurrentRegressionStayStatus(initialStay.status);
    } else if (stayId) {
      setRegressToExceptionOverride(false);
      const es = extendedStays.find((item) => item.id == stayId);
      const regressStatus = Object.keys(stayStatusOptions(es?.status, false)).map(
        (key) => stayStatusOptions(es?.status, false)[key]
      );
      setRegressionStayStatus(regressStatus[0]);
      setCurrentRegressionStayStatus(es.status);
    }
    setShowRegressStayDialog((prev) => !prev);
  };

  const changeStayStatus = (e) => {
    setRegressionStayStatus(e.target.value);
  };

  const updateStayAndApplicationStatus = () => {
    if (initialStay.id == regressionStayId) {
      const originalStatus = initialStay.status;
      // Do it for the initial stay.
      const newStay = Stay.copyOf(initialStay, (u) => {
        u.status = regressionStayStatus;
      });
      setInitialStay(newStay);
      saveStay(newStay).then((s) => {
        const newApplication = Application.copyOf(application, (u) => {
          u.status = regressionStayStatus;
        });
        setApplication(newApplication);
        saveApplication(newApplication)
          .then((a) => {
            const check_in_date = newStay?.actual_check_in
              ? newStay?.actual_check_in
              : newStay?.requested_check_in;
            const check_out_date = newStay?.actual_check_out
              ? newStay?.actual_check_out
              : newStay?.requested_check_out;
            createNote(
              humanName(profile, true) +
                ' regressed the Initial Stay (' +
                (check_in_date ? format(makeTimezoneAwareDate(check_in_date), 'MM/dd/yyyy') : '') +
                ' - ' +
                (check_out_date
                  ? format(makeTimezoneAwareDate(check_out_date), 'MM/dd/yyyy')
                  : '') +
                `) from <span class="status ${originalStatus.toLowerCase()}">` +
                originalStatus.toLowerCase() +
                '</span> to ' +
                `<span class="status ${regressionStayStatus.toLowerCase()}">` +
                regressionStayStatus.toLowerCase() +
                '</span>' +
                '.',
              NOTEACTION.REGRESS,
              application,
              profile
            );
            setShowRegressStayDialog(false);
          })
          .then(() => {
            toast('Regressed stay.');
          });
      });
    } else {
      // Find and update the other stay.
      const es = extendedStays.find((item) => item.id == regressionStayId);
      if (es) {
        const originalStatus = es.status;
        const newStay = Stay.copyOf(es, (u) => {
          u.status = regressionStayStatus;
        });
        setExtendedStays(
          extendedStays.map((item) => {
            return item.id == newStay.id ? newStay : item;
          })
        );
        saveStay(newStay).then((s) => {
          const newApplication = Application.copyOf(application, (u) => {
            u.status = regressionStayStatus;
          });
          setApplication(newApplication);
          saveApplication(newApplication)
            .then((a) => {
              const check_in_date = newStay?.actual_check_in
                ? newStay?.actual_check_in
                : newStay?.requested_check_in;
              const check_out_date = newStay?.actual_check_out
                ? newStay?.actual_check_out
                : newStay?.requested_check_out;
              createNote(
                humanName(profile, true) +
                  ' regressed the Extended Stay (' +
                  (check_in_date
                    ? format(makeTimezoneAwareDate(check_in_date), 'MM/dd/yyyy')
                    : '') +
                  ' - ' +
                  (check_out_date
                    ? format(makeTimezoneAwareDate(check_out_date), 'MM/dd/yyyy')
                    : '') +
                  `) from <span class="status ${originalStatus.toLowerCase()}">` +
                  originalStatus.toLowerCase() +
                  '</span> to ' +
                  `<span class="status ${regressionStayStatus.toLowerCase()}">` +
                  regressionStayStatus.toLowerCase() +
                  '</span>' +
                  '.',
                NOTEACTION.REGRESS_EXTENDED_STAY,
                application,
                profile
              );
              setShowRegressStayDialog(false);
            })
            .then(() => {
              toast('Regressed stay.');
            });
        });
      }
    }
  };

  const addNewExtendedStay = (e) => {
    e.preventDefault();
    API.graphql(
      graphqlOperation(createStay, {
        input: {
          applicationID: application?.id,
          status: STAYSTATUS.DRAFT,
          type: STAYTYPE.EXTENDED,
        },
      })
    ).then((result) => {
      const extendedStay = deserializeModel(Stay, result.data.createStay);
      setExtendedStays((prev) => [...prev, extendedStay]);
      setSourceExtendedStays((prev) => [...prev, extendedStay]);
      createNote(
        humanName(profile, true) + ' created an Extended Stay.',
        NOTEACTION.REQUEST,
        application,
        profile
      );
    });
  };

  const canAddNewExtendedStay = () => {
    return !isApplicationEditable(application, true);
  };

  const shouldShowAddNewExtendedStayButton = () => {
    const stays = extendedStays.concat(initialStay);
    const statuses = stays.map((item) => item?.status);
    const statusesPriorToApproved = [
      STAYSTATUS.DRAFT,
      STAYSTATUS.REQUESTED,
      STAYSTATUS.RETURNED,
      STAYSTATUS.EXCEPTION,
      STAYSTATUS.DECLINED,
    ];

    return !statusesPriorToApproved.some((r) => statuses.includes(r));
  };

  const subColumnClass = classNames('sub-column', {
    loading: props.shouldShowLoadingIndicator,
  });

  return (
    <Fragment>
      {showRegressStayDialog && (
        <RegressStayDialog
          close={toggleRegressStayDialog}
          presentStayStatus={currentRegressionStayStatus}
          currentStayStatus={regressionStayStatus}
          changeStayStatus={changeStayStatus}
          saveStayStatus={updateStayAndApplicationStatus}
          isException={canBeSubmittedAsException && regressToExceptionOverride}
          isExtendedStay={initialStay.id == regressionStayId}
        />
      )}
      <ApplicationFormPage4Sidebar
        application={application}
        shouldShowLoadingIndicator={props.shouldShowLoadingIndicator}
      />

      <div className={subColumnClass}>
        <div className={`app-pane`}>
          <StayReview
            stay={initialStay}
            serviceMember={serviceMember}
            missingServiceMemberFields={missingServiceMemberFields()}
            missingPatientFields={missingPatientFields()}
            missingLiaisonFields={missingLiaisonFields()}
            missingLodgingFields={missingLodgingFields()}
            updateServiceMemberLodgingExplanation={updateServiceMemberLodgingExplanation}
            updateServiceMemberUnidentifiedExplanation={updateServiceMemberUnidentifiedExplanation}
            updateAndSaveLiaisonAgreement={updateAndSaveLiaisonAgreement}
            updateAndSaveServiceMemberAgreement={updateAndSaveServiceMemberAgreement}
            updateExceptionNarrative={updateExceptionNarrative}
            saveApplication={saveApplicationDetails}
            saveServiceMemberDetails={saveServiceMemberDetails}
            saveServiceMemberUnidentifiedExplanation={saveServiceMemberUnidentifiedExplanation}
            submitStayAsException={submitStayAsException}
            submitStay={submitStay}
            saveStay={saveStay}
            updateStay={updateStay}
            returnStay={returnStay}
            application={application}
            updateAndSaveStay={updateAndSaveStay}
            declineStay={declineStay}
            approveStay={approveStay}
            completeStay={completeStay}
            deleteApplication={deleteApplicationAction}
            toggleRegressStayDialog={() => toggleRegressStayDialog(initialStay.id)}
            reviewStay={reviewStay}
            lodgingExplanationDescription={lodgingExplanationDescription}
            primaryGuest={primaryGuest}
            additionalGuests={additionalGuests}
            treatmentFacility={serviceMember?.TreatmentFacility}
            shouldShowErrorMessagesFromSubmitValidation={
              props.shouldShowErrorMessagesFromSubmitValidation
            }
          />
        </div>

        {extendedStays &&
          extendedStays
            .sort((a, b) => {
              return new Date(a.createdAt) - new Date(b.createdAt);
            })
            .map((es) => {
              return (
                <ExtendedStay
                  stay={es}
                  key={es.id}
                  toggleRegressStayDialog={() => toggleRegressStayDialog(es.id)}
                  primaryStay={initialStay}
                />
              );
            })}

        {shouldShowAddNewExtendedStayButton() && (
          <Fragment>
            <button onClick={addNewExtendedStay} disabled={canAddNewExtendedStay()}>
              Request Extended Stay
            </button>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

ApplicationFormPage4.defaultProps = {
  removeApplicationFromList: () => {},
  shouldShowLoadingIndicator: false,
};
