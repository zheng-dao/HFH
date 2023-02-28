import { Fragment, useState, useEffect, useRef } from 'react';
import format from 'date-fns/format';
import LongformAgreement from '@components/CommonInputs/LongformAgreement';
import Textareafield from '@components/Inputs/Textareafield';
import classNames from 'classnames';
import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import {
  SERVICEMEMBERSTATUS,
  STAYTYPE,
  STAYSTATUS,
  ROOMTYPE,
  PAYMENTTYPETYPE,
  APPLICATIONSTATUS,
} from '@src/API';
import isApplicationEditable from '@utils/isApplicationEditable';
import SubmitButton from '../Inputs/SubmitButton';
import FindAHotel from '@components/FindAHotel';
import Textfield from '../Inputs/Textfield';
import Radios from '../Inputs/Radios';
import Datefield from '../Inputs/Datefield';
import PaymentDetails from '../PaymentDetails';
import { yesNoOptions } from '@utils/yesNoOptions';
import parseISO from 'date-fns/parseISO';
import Checkboxes from '../Inputs/Checkboxes';
import Link from 'next/link';
import Image from 'next/image';
import CheckImage from '@public/img/check.svg';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import { mapEnumValue } from '@utils/mapEnumValue';
import validateRequired from '@utils/validators/required';
import { Auth, Storage } from 'aws-amplify';
import useApplicationContext from '@contexts/ApplicationContext';
import HotelDetails from '../HotelDetails';
import GuestDetails from '../GuestDetails';
import stayStatusOptions from '@utils/stayStatusOptions';
import maskLiaisonStayStatus from '@utils/maskLiaisonStayStatus';

export default function StayReview(props) {
  const { application } = useApplicationContext();
  const { isLiaison, isAdministrator, profile } = useAuth();
  const { setMessage } = useDialog();
  const [shouldShowTermsDetails, setShouldShowTermsDetails] = useState(false);
  const [shouldShowReasonForExceptionBox, setShouldShowReasonForExceptionBox] = useState(false);
  const [shouldShowReasonForDeclineBox, setShouldShowReasonForDeclineBox] = useState(false);
  const [shouldShowAddMoreFiles, setShouldShowAddMoreFiles] = useState(false);
  const [shouldShowMilitaryTravelOrderDetails, setShouldShowMilitaryTravelOrderDetails] =
    useState(false);
  const [
    shouldShowUnidentifiedServiceMemberDetails,
    setShouldShowUnidentifiedServiceMemberDetails,
  ] = useState(false);
  const [shouldShowIncompleteRequiredFieldsDetails, setShouldShowIncompleteRequiredFieldsDetails] =
    useState(false);
  const [reconcileCheckedOptions, setReconcileCheckedOptions] = useState([]);
  const [itemsToReconcile, setItemsToReconcile] = useState([]);
  const [readyForClose, setReadyForClose] = useState(false);
  const [roomTypeActualValid, setRoomTypeActualValid] = useState(false);
  const [roomTypeDescriptionValid, setRoomTypeDescriptionValid] = useState(false);
  const [hotelPropertyIsValid, setHotelPropertyIsValid] = useState(false);
  const [reasonForDeclineValid, setReasonForDeclineValid] = useState(false);
  const [isStayAtHotelValid, setIsStayAtHotelValid] = useState(false);
  const [isReasonForChangeValid, setIsReasonForChangeValid] = useState(false);
  const [isActualCheckInDateValid, setIsActualCheckInDateValid] = useState(false);
  const [isActualCheckOutDateValid, setIsActualCheckOutDateValid] = useState(false);
  const [confirmationNumberValid, setConfirmationNumberValid] = useState(false);
  const [paymentUsedValid, setPaymentUsedValid] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [totalCostValid, setTotalCostValid] = useState(false);
  const [paymentDetailsValid, setPaymentDetailsValid] = useState(false);
  const [comparableCostValid, setComparableCostValid] = useState(false);
  const [lodgingExplanationValid, setLodgingExplanationValid] = useState(false);
  const [unidentifiedSMValid, setUnidentifiedSMValid] = useState(false);
  const [exceptionNarrativeValid, setExceptionNarrativeValid] = useState(false);
  const [returnStayExplanationValid, setReturnStayExplanationValid] = useState(false);
  const [actual_check_in, setActualCheckIn] = useState(props.stay?.actual_check_in);
  const [actual_check_out, setActualCheckOut] = useState(props.stay?.actual_check_out);
  const addFileUpload = useRef(null);

  const allowedFileTypes = [
    'application/pdf',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'image/png',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/rtf',
    'text/rtf',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const { updateAndSaveStay, stay } = props;

  useEffect(() => {
    let reconcileSelections = [];
    if (props.stay?.hotel_reconcile) {
      reconcileSelections.push('hotel_reconcile');
    }
    if (props.stay?.points_reconcile) {
      reconcileSelections.push('points_reconcile');
    }
    if (props.stay?.charge_reconcile) {
      reconcileSelections.push('charge_reconcile');
    }
    if (props.stay?.giftcard_reconcile) {
      reconcileSelections.push('giftcard_reconcile');
    }
    setReconcileCheckedOptions(reconcileSelections);
  }, [
    props.stay?.hotel_reconcile,
    props.stay?.points_reconcile,
    props.stay?.giftcard_reconcile,
    props.stay?.charge_reconcile,
  ]);

  useEffect(() => {
    if (props?.shouldShowErrorMessagesFromSubmitValidation) {
      setLodgingExplanationValid(validateRequired(props.serviceMember?.lodging_explanation));
      setExceptionNarrativeValid(validateRequired(props.application?.exception_narrative));
      setUnidentifiedSMValid(validateRequired(props.serviceMember?.unidentified_explanation));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.shouldShowErrorMessagesFromSubmitValidation]);

  const readyForMarkAsReview = () => {
    let isReady = true;
    itemsToReconcile.forEach((item) => {
      if (!reconcileCheckedOptions.includes(item.key)) {
        isReady = false;
      }
    });
    if (props.stay?.hotel_files == null || props.stay?.hotel_files.length < 1) {
      isReady = false;
    }
    return isReady;
  };

  useEffect(() => {
    let items = [];
    if (props.stay?.hotel_files && props.stay?.hotel_files.length >= 1) {
      items.push({ key: 'hotel_reconcile', value: 'Hotel Folio Reconciled' });
    }
    if (props.stay?.payment_method?.type == PAYMENTTYPETYPE.USERGENERATED) {
      if (
        props.stay?.certificate_number &&
        props.stay?.certificate_number !== '' &&
        props.stay?.comparable_cost &&
        props.stay?.comparable_cost !== ''
      ) {
        items.push({
          key: 'giftcard_reconcile',
          value: props.stay?.payment_method?.name + ' Reconciled',
        });
      }
      if (props.stay?.card_used_for_incidentals) {
        if (
          props.stay?.card &&
          props.stay?.card !== '' &&
          props.stay?.payment_cost_of_reservation &&
          props.stay?.payment_cost_of_reservation !== ''
        ) {
          items.push({ key: 'charge_reconcile', value: 'Charge Reconciled' });
        }
      }
    }
    if (props.stay?.payment_type == 'Points') {
      if (
        props.stay?.payment_points_used &&
        props.stay?.payment_points_used !== '' &&
        props.stay?.comparable_cost &&
        props.stay?.comparable_cost !== ''
      ) {
        items.push({ key: 'points_reconcile', value: 'Points Reconciled' });
      }
      if (props.stay?.card_used_for_incidentals) {
        if (
          props.stay?.card &&
          props.stay?.card !== '' &&
          props.stay?.payment_cost_of_reservation &&
          props.stay?.payment_cost_of_reservation !== ''
        ) {
          items.push({ key: 'charge_reconcile', value: 'Charge Reconciled' });
        }
      }
    }
    if (props.stay?.payment_type == 'Credit Card') {
      if (
        props.stay?.card &&
        props.stay?.card !== '' &&
        props.stay?.payment_cost_of_reservation &&
        props.stay?.payment_cost_of_reservation !== ''
      ) {
        items.push({ key: 'charge_reconcile', value: 'Charge Reconciled' });
      }
    }
    setItemsToReconcile(items);
    setActualCheckIn(props.stay?.actual_check_in);
    setActualCheckOut(props.stay?.actual_check_out);
  }, [
    props.stay,
    props.stay?.hotel_files,
    props.stay?.payment_type,
    props.stay?.card_used_for_incidentals,
    props.stay?.payment_method?.type,
    props.stay?.payment_method?.name,
  ]);

  const isUnidentifiedServiceMember =
    !props.serviceMember?.first_name || !props.serviceMember?.last_name;

  const missingRequiredFields =
    props.missingLiaisonFields.length > 0 ||
    (props.missingServiceMemberFields.length > 0 && !isUnidentifiedServiceMember) ||
    props.missingPatientFields.length > 0 ||
    props.missingLodgingFields.length > 0;

  const canBeSubmittedAsException =
    missingRequiredFields ||
    props.serviceMember?.current_status != SERVICEMEMBERSTATUS.VETERAN ||
    (props.serviceMember?.current_status == SERVICEMEMBERSTATUS.VETERAN &&
      props.serviceMember?.on_military_travel_orders);
  /*&& validateRequired(valueOrEmptyString(application?.exception_narrative)).valid*/

  const stayTitle = props.stay?.type == STAYTYPE.INITIAL ? 'Initial Stay ' : 'Extended Stay';

  const toggleShouldShowTermsDetails = (e) => {
    e.preventDefault();
    setShouldShowTermsDetails(!shouldShowTermsDetails);
  };

  const submitReturnButton = (e) => {
    e.preventDefault();
    if (!shouldShowReasonForExceptionBox) {
      setShouldShowReasonForExceptionBox(true);
    } else {
      const isValid = validateRequired(props.stay.reason_return);
      setReturnStayExplanationValid(isValid);
      if (!isValid.valid) {
        setMessage(
          'The application is missing information for it to be returned. Please review the information and try again.'
        );
      } else {
        props.returnStay(props.stay);
      }
    }
  };

  const updateReturnReasonValue = (e) => {
    props.updateStay(props.stay, (u) => {
      u.reason_return = e.target.value;
    });
  };

  const saveReturnReasonValue = (e) => {
    setReturnStayExplanationValid(validateRequired(props.stay.reason_return));
    props.saveStay(props.stay);
  };

  const updateDeclineReasonValue = (e) => {
    props.updateStay(props.stay, (u) => {
      u.reason_decline = e.target.value;
    });
  };

  const saveDeclineReasonValue = (e) => {
    setReasonForDeclineValid(validateRequired(e.target.value));
    props.saveStay(props.stay);
  };

  const updateConfirmationNumber = (e) => {
    props.updateStay(props.stay, (u) => {
      u.confirmation_number = e.target.value;
    });
  };

  const saveConfirmationNumber = (e) => {
    setConfirmationNumberValid(validateRequired(props.stay.confirmation_number));
    props.saveStay(props.stay);
  };

  const updateAndSaveGuestStayedAtHotel = (e) => {
    if (e.target.value === 'false') {
      setPaymentDetailsValid({ valid: true, message: '' });
      setPaymentUsedValid({ valid: true, message: '' });
      setCardValid({ valid: true, message: '' });
      setTotalCostValid({ valid: true, message: '' });
      setComparableCostValid({ valid: true, message: '' });
    }
    setIsStayAtHotelValid(validateRequired(e.target.value));
    setIsActualCheckInDateValid(validateRequired('Confirmed'));
    setIsActualCheckOutDateValid(validateRequired('Confirmed'));
    props.updateAndSaveStay(props.stay, (u) => {
      u.guest_stayed_at_hotel = e.target.value == 'true';
      u.reason_guest_did_not_stay = '';
      u.actual_check_in =
        e.target.value == 'true'
          ? props.stay.actual_check_in == null
            ? props.stay.requested_check_in
            : props.stay.actual_check_in
          : null;
      u.actual_check_out =
        e.target.value == 'true'
          ? props.stay.actual_check_out == null
            ? props.stay.requested_check_out
            : props.stay.actual_check_out
          : null;
    });
  };

  const shouldShowReasonForChangeBox =
    (!props.stay?.guest_stayed_at_hotel && props.stay?.guest_stayed_at_hotel != null) ||
    (props.stay?.actual_check_in &&
      props.stay?.actual_check_in != props.stay?.requested_check_in) ||
    (props.stay?.actual_check_out &&
      props.stay?.actual_check_out != props.stay?.requested_check_out);

  const updateReasonGuestDidNotStay = (e) => {
    props.updateStay(props.stay, (u) => {
      u.reason_guest_did_not_stay = e.target.value;
    });
  };

  const saveReasonGuestDidNotStay = (e) => {
    setIsReasonForChangeValid(validateRequired(e.target.value));
    props.saveStay(props.stay);
  };

  const saveExceptionNarrative = (e) => {
    setExceptionNarrativeValid(validateRequired(e.target.value));
    props.saveApplication();
  };

  const updateAndSaveActualCheckInDate = (e) => {
    if (e.target.value !== '') {
      setIsActualCheckInDateValid(validateRequired(e.target.value));
    }
    setActualCheckIn(e.target.value);
    props.updateAndSaveStay(props.stay, (u) => {
      u.actual_check_in = e.target.value !== '' ? e.target.value : null;
      u.reason_guest_did_not_stay = shouldShowReasonForChangeBox
        ? props.stay.reason_guest_did_not_stay
        : '';
    });
  };

  const updateAndSaveActualCheckOutDate = (e) => {
    if (e.target.value !== '') {
      setIsActualCheckOutDateValid(validateRequired(e.target.value));
    }
    props.updateAndSaveStay(props.stay, (u) => {
      u.actual_check_out = e.target.value !== '' ? e.target.value : null;
      u.reason_guest_did_not_stay = shouldShowReasonForChangeBox
        ? props.stay.reason_guest_did_not_stay
        : '';
    });
  };

  const updateAndSaveReconcileStatus = (e) => {
    props.updateAndSaveStay(props.stay, (u) => {
      u[e.target.value] = e.target.checked;
    });
  };

  const termsSubmittedClasses = classNames('terms', {
    hidden: !shouldShowTermsDetails,
  });

  const militaryTravelOrdersSubmittedClasses = classNames('hidden-content', {
    hidden:
      !shouldShowMilitaryTravelOrderDetails &&
      props.stay?.status != STAYSTATUS.DRAFT &&
      props.stay?.status != STAYSTATUS.RETURNED,
  });

  const unidentifiedServiceMembersSubmittedClasses = classNames('hidden-content', {
    hidden:
      !shouldShowUnidentifiedServiceMemberDetails &&
      props.stay?.status != STAYSTATUS.DRAFT &&
      props.stay?.status != STAYSTATUS.RETURNED,
  });

  const incompleteRequiredFieldsSubmittedClasses = classNames('hidden-content', {
    hidden:
      !shouldShowIncompleteRequiredFieldsDetails &&
      props.stay?.status != STAYSTATUS.DRAFT &&
      props.stay?.status != STAYSTATUS.RETURNED,
  });

  const toggleShouldShowMilitaryTravelOrderDetails = (e) => {
    e.preventDefault();
    setShouldShowMilitaryTravelOrderDetails((prev) => !prev);
  };

  const toggleShouldShowUnidentifiedServiceMemberDetails = (e) => {
    e.preventDefault();
    setShouldShowUnidentifiedServiceMemberDetails((prev) => !prev);
  };

  const toggleShouldShowIncompleteRequiredFieldsDetails = (e) => {
    e.preventDefault();
    setShouldShowIncompleteRequiredFieldsDetails((prev) => !prev);
  };

  const validateFormSubmission = () => {
    const hotelSelectionValid = validateRequired(props.stay.HotelPropertyID);
    setHotelPropertyIsValid(hotelSelectionValid);
    const roomTypeValid = validateRequired(props.stay.room_type_actual);
    setRoomTypeActualValid(roomTypeValid);
    const roomDescriptionValid =
      props.stay.room_type_actual == ROOMTYPE.OTHER
        ? validateRequired(props.stay.room_description_actual)
        : { valid: true, message: '' };
    setRoomTypeDescriptionValid(roomDescriptionValid);
    return hotelSelectionValid.valid && roomTypeValid.valid && roomDescriptionValid.valid;
  };

  const validatePaymentFields = () => {
    if (
      props.stay?.status === STAYSTATUS.REQUESTED ||
      props.stay?.status === STAYSTATUS.EXCEPTION
    ) {
    } else {
      if (props.stay?.status === STAYSTATUS.APPROVED) {
        if (!props.stay?.guest_stayed_at_hotel) {
          if (props.stay.PaymentTypeID) {
          } else {
            return !props.stay?.guest_stayed_at_hotel;
          }
        }
      }
    }
    const isConfirmationNumberValid = validateRequired(props.stay.confirmation_number);
    setConfirmationNumberValid(isConfirmationNumberValid);
    const isPaymentUsedValid = validateRequired(props.stay.PaymentTypeID);
    if (props.stay?.status !== STAYSTATUS.COMPLETED) {
      setPaymentUsedValid(isPaymentUsedValid);
    } else {
      if (!props.stay.PaymentTypeID) {
        return true;
      }
    }
    let extraOptionsValid = false;
    if (props.stay?.payment_method?.name == 'Credit Card') {
      const cardIsValid = validateRequired(props.stay.card);
      setCardValid(cardIsValid);
      const totalCostIsValid = validateRequired(props.stay.payment_cost_of_reservation);
      setTotalCostValid(totalCostIsValid);
      extraOptionsValid = cardIsValid.valid && totalCostIsValid.valid;
    } else if (props.stay?.payment_type == 'Points') {
      const paymentDetailsIsValid = validateRequired(props.stay.payment_points_used);
      setPaymentDetailsValid(paymentDetailsIsValid);
      const comparableCostIsValid = validateRequired(props.stay.comparable_cost);
      setComparableCostValid(comparableCostIsValid);
      if (props.stay?.card_used_for_incidentals) {
        const cardIsValid = validateRequired(props.stay.card);
        setCardValid(cardIsValid);
        const totalCostIsValid = validateRequired(props.stay.payment_cost_of_reservation);
        setTotalCostValid(totalCostIsValid);
        extraOptionsValid =
          cardIsValid.valid &&
          totalCostIsValid.valid &&
          paymentDetailsIsValid.valid &&
          isPaymentUsedValid.valid;
      } else {
        extraOptionsValid =
          paymentDetailsIsValid.valid && comparableCostIsValid.valid && isPaymentUsedValid.valid;
      }
    } else {
      const paymentDetailsIsValid = validateRequired(props.stay.certificate_number);
      setPaymentDetailsValid(paymentDetailsIsValid);
      const comparableCostIsValid = validateRequired(props.stay.comparable_cost);
      setComparableCostValid(comparableCostIsValid);
      if (props.stay?.card_used_for_incidentals == true) {
        const cardIsValid = validateRequired(props.stay.card);
        setCardValid(cardIsValid);
        const totalCostIsValid = validateRequired(props.stay.payment_cost_of_reservation);
        setTotalCostValid(totalCostIsValid);
        extraOptionsValid =
          cardIsValid.valid &&
          totalCostIsValid.valid &&
          paymentDetailsIsValid.valid &&
          comparableCostIsValid.valid;
      } else {
        extraOptionsValid =
          paymentDetailsIsValid.valid && comparableCostIsValid.valid && comparableCostIsValid.valid;
      }
    }
    return extraOptionsValid && isConfirmationNumberValid.valid && isPaymentUsedValid.valid;
  };

  const cancelReturnDecline = (e) => {
    e.preventDefault();
    setShouldShowReasonForDeclineBox(false);
    setShouldShowReasonForExceptionBox(false);
  };

  const declineStay = (e) => {
    e.preventDefault();
    if (!shouldShowReasonForDeclineBox) {
      setShouldShowReasonForDeclineBox(true);
    } else {
      const isValid = validateRequired(props.stay.reason_decline);
      setReasonForDeclineValid(isValid);
      if (isValid.valid) {
        props.declineStay(props.stay);
      } else {
        setMessage(
          'The application is missing information for it to be declined. Please review the information and try again.'
        );
      }
    }
  };

  const approveStay = (e) => {
    e.preventDefault();
    const isValidFormSubmission = validateFormSubmission();
    const isValidPaymentFields = validatePaymentFields();
    // return;
    if (!isValidFormSubmission || !isValidPaymentFields) {
      setMessage(
        'The application is missing information for it to be approved. Please review the information and try again.'
      );
    } else {
      props.approveStay(props.stay);
    }
  };

  const reasonForChangeIntroText =
    !props.stay?.guest_stayed_at_hotel && props.stay?.guest_stayed_at_hotel != null
      ? "Why didn't the guest(s) stay at the hotel?"
      : "Why didn't the guest(s) stay at the hotel for the requested dates?";

  const validateCompleteFormFields = () => {
    const stayAtHotelValid = validateRequired(
      props.stay.guest_stayed_at_hotel != null ? 'Yes' : ''
    );
    setIsStayAtHotelValid(stayAtHotelValid);
    const reasonForChangeValid = shouldShowReasonForChangeBox
      ? validateRequired(props.stay.reason_guest_did_not_stay)
      : { valid: true, message: '' };
    setIsReasonForChangeValid(reasonForChangeValid);
    const actualCheckInDateValid = props.stay.guest_stayed_at_hotel
      ? validateRequired(props.stay.actual_check_in)
      : { valid: true, message: '' };
    setIsActualCheckInDateValid(actualCheckInDateValid);
    const actualCheckOutDateValid = props.stay.guest_stayed_at_hotel
      ? validateRequired(props.stay.actual_check_out)
      : { valid: true, message: '' };
    setIsActualCheckOutDateValid(actualCheckOutDateValid);
    return (
      validatePaymentFields() &&
      stayAtHotelValid.valid &&
      reasonForChangeValid.valid &&
      actualCheckInDateValid.valid &&
      actualCheckOutDateValid.valid
    );
  };

  const completeStay = (e) => {
    e.preventDefault();
    if (!validateCompleteFormFields()) {
      setMessage(
        'The application is missing information for it to be completed. Please review the information and try again.'
      );
    } else {
      props.completeStay(props.stay);
    }
  };

  const agreedToAllTerms =
    props.application?.liaison_terms_of_use_agreement &&
    props.application?.sm_terms_of_use_agreement;

  const lodgingExplanationDescription = () => {
    return props.lodgingExplanationDescription();
  };

  const canRegressStay = () => {
    // It doesn't matter if we can regress to exception or requested here -- they are the same for our purposes.
    return Object.keys(stayStatusOptions(props.stay?.status, false)).length > 0;
  };

  const stayStatusClass = classNames(
    'app-status',
    'status-' +
    (props.stay?.status
      ? !isAdministrator()
        ? props.stay?.status === APPLICATIONSTATUS.REVIEWED ||
          props.stay?.status === APPLICATIONSTATUS.CLOSED
          ? 'completed'
          : props.stay?.status.toLowerCase()
        : props.stay?.status.toLowerCase()
      : 'draft'),
    {
      clickable: isAdministrator() && canRegressStay(),
    }
  );

  const onStatusClick = () => {
    if (isAdministrator() && canRegressStay()) {
      props.toggleRegressStayDialog();
    }
  };

  const filesClass = classNames('files', {
    hidden: !(
      (props.stay?.hotel_files && props.stay.hotel_files.length > 0) ||
      shouldShowAddMoreFiles
    ),
  });

  const addMoreFilesClass = classNames('add', 'more', {
    hidden:
      shouldShowAddMoreFiles || (props.stay?.hotel_files && props.stay.hotel_files.length > 0),
  });

  const handleAddMoreFilesClick = (e) => {
    e.preventDefault();
    setShouldShowAddMoreFiles(true);
  };

  const handleUploadFileClick = (e) => {
    e.preventDefault();
    addFileUpload.current.value = null;
    if (application?.applicationAssignedToId == profile?.id && profile?.id != null) {
      addFileUpload.current.click();
    }
  };

  const handleUploadFileAddFile = (e) => {
    if (typeof e.target.files[0] == 'undefined') {
      return;
    }
    const file = e.target.files[0];
    if (!allowedFileTypes.includes(file.type)) {
      setMessage(
        'Invalid file format. If you continue to receive this error, please convert the file to a PDF document and upload again.'
      );
    } else {
      const currentTime = Date.now();
      Storage.put(props.stay.id + '/' + currentTime + '/' + file.name, file, {
        level: 'protected',
        contentType: file.type,
        track: true,
      })
        .then(async (res) => {
          const newObject = [
            {
              key: res.key,
              user: (await Auth.currentUserCredentials()).identityId,
            },
          ];
          // Now that we have uploaded the file, we need to save it.
          props.updateAndSaveStay(props.stay, (u) => {
            u.hotel_files = props.stay.hotel_files
              ? props.stay.hotel_files.concat(newObject)
              : newObject;
          });
        })
        .catch((err) => {
          console.log('Error uploading file', err);
          setMessage('There was an error uploading the file. Please try again later.');
        });
    }
  };

  const processClickOnFile = (e, key, user) => {
    e.preventDefault();
    Storage.get(key, {
      level: 'protected',
      identityId: user,
      expires: 5 * 60, // 5 minutes
    })
      .then((link) => {
        window.open(link, '_blank');
      })
      .catch((err) => {
        console.log('Error downloading file', err);
        setMessage('There was an error downloading the file. Please try again later.');
      });
  };

  const removeFile = (e, key, user, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this file? This action cannot be un-done.')) {
      const newHotelFiles = [
        ...props.stay.hotel_files.slice(0, index),
        ...props.stay.hotel_files.slice(index + 1),
      ];
      if (newHotelFiles && newHotelFiles.length === 0) {
        props.updateAndSaveStay(props.stay, (u) => {
          u.hotel_files = newHotelFiles;
          u.hotel_reconcile = false;
        });
      } else {
        props.updateAndSaveStay(props.stay, (u) => {
          u.hotel_files = newHotelFiles;
        });
      }

      Storage.remove(key, { level: 'protected', identityId: user })
        .then((result) => {
          addFileUpload.current.value = null;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const uploadDocumentUserButton = classNames('upload', 'button', {
    disabled: props.stay?.status == STAYSTATUS.CLOSED || !isApplicationEditable(props.application),
  });

  const uploadDocumentNativeButtonClass = classNames({
    hidden: props.stay?.hotel_files && props.stay.hotel_files.length > 0,
  });

  const reviewStay = (e) => {
    e.preventDefault();
    if (!validateCompleteFormFields()) {
      setMessage(
        'The application is missing information for it to be reviewed. Please review the information and try again.'
      );
    } else {
      props.reviewStay(props.stay);
    }
  };

  const saveServiceMemberLodgingExplanation = (e) => {
    setLodgingExplanationValid(validateRequired(e.target.value));
    props.saveServiceMemberDetails(e);
  };

  const saveServiceMemberUnidentifiedExplanation = (e) => {
    setUnidentifiedSMValid(validateRequired(e.target.value));
    props.saveServiceMemberUnidentifiedExplanation(e);
  };

  const shouldNotShowOptionalForFiles = [
    STAYSTATUS.COMPLETED,
    STAYSTATUS.REVIEWED,
    STAYSTATUS.CLOSED,
  ].includes(props.stay?.status);

  const shownCheckinDate = [
    STAYSTATUS.DRAFT,
    STAYSTATUS.DECLINED,
    STAYSTATUS.REQUESTED,
    STAYSTATUS.EXCEPTION,
  ].includes(props.stay?.requested_check_in)
    ? props.stay?.requested_check_in
    : props.stay?.actual_check_in
      ? props.stay?.actual_check_in
      : props.stay?.requested_check_in;
  const shownCheckoutDate = [
    STAYSTATUS.DRAFT,
    STAYSTATUS.DECLINED,
    STAYSTATUS.REQUESTED,
    STAYSTATUS.EXCEPTION,
  ].includes(props.stay?.requested_check_out)
    ? props.stay?.requested_check_out
    : props.stay?.actual_check_out
      ? props.stay?.actual_check_out
      : props.stay?.requested_check_out;

  return (
    <Fragment>
      <form id="#" action="#">
        <h3>
          {stayTitle}
          <span className={stayStatusClass} onClick={onStatusClick}>
            {isLiaison()
              ? maskLiaisonStayStatus(props.stay?.status ?? 'DRAFT')
              : props.stay?.status ?? 'Draft'}
          </span>
        </h3>

        {props.stay?.status == STAYSTATUS.RETURNED && props.stay?.reason_return && (
          <Fragment>
            <h4>Admin&apos;s Notes on the Returned Request</h4>
            <div className="detail-block returned-note">
              <p>{props.stay?.reason_return}</p>
            </div>
          </Fragment>
        )}

        {shownCheckinDate && shownCheckoutDate && (
          <Fragment>
            <label className="disabled">Stay Dates</label>
            <div className="displaybox">
              <p className="large-value">
                {format(makeTimezoneAwareDate(shownCheckinDate), 'EEEE, MM/dd/yyyy')} -{' '}
                {format(makeTimezoneAwareDate(shownCheckoutDate), 'EEEE, MM/dd/yyyy')}
              </p>
            </div>
          </Fragment>
        )}

        {props.stay?.narrative && (
          <Fragment>
            <h4>Narrative</h4>
            <div className="detail-block">
              <p>{props.stay?.narrative}</p>
            </div>
          </Fragment>
        )}

        {lodgingExplanationDescription().length > 0 && (
          <div className="detail-block">
            <h5>
              <span dangerouslySetInnerHTML={{ __html: lodgingExplanationDescription() }} />
              {props.stay?.status != STAYSTATUS.DRAFT && props.stay?.status != STAYSTATUS.RETURNED && (
                <a
                  className="more"
                  title="Reveal Explanation"
                  onClick={toggleShouldShowMilitaryTravelOrderDetails}
                  href=""
                >
                  {shouldShowMilitaryTravelOrderDetails ? 'Collapse' : 'Details'}
                </a>
              )}
            </h5>
            <div className={militaryTravelOrdersSubmittedClasses}>
              <Textareafield
                withActualLabel={true}
                label="Explanation"
                inputValue={props.serviceMember?.lodging_explanation}
                inputOnChange={props.updateServiceMemberLodgingExplanation}
                inputOnBlur={saveServiceMemberLodgingExplanation}
                inputDisabled={!isApplicationEditable(props.application)}
                isValid={lodgingExplanationValid.valid}
                errorMessage={lodgingExplanationValid.message}
              />
            </div>
          </div>
        )}

        {isUnidentifiedServiceMember && (
          <div className="detail-block">
            <h5>
              The service member has not been identified.
              {props.stay?.status != STAYSTATUS.DRAFT && props.stay?.status != STAYSTATUS.RETURNED && (
                <a
                  className="more"
                  title="Reveal Explanation"
                  onClick={toggleShouldShowUnidentifiedServiceMemberDetails}
                  href=""
                >
                  {shouldShowUnidentifiedServiceMemberDetails ? 'Collapse' : 'Details'}
                </a>
              )}
            </h5>
            <div className={unidentifiedServiceMembersSubmittedClasses}>
              <ul className="exception-fields">
                {props.missingServiceMemberFields.map((item) => (
                  <Fragment key={item}>
                    <li key={item}>{item}</li>&nbsp;
                  </Fragment>
                ))}
              </ul>
              <Textareafield
                intro={
                  shouldShowUnidentifiedServiceMemberDetails
                    ? ''
                    : 'If the Service Member cannot be identified at this time, please explain the circumstances.'
                }
                label="Explanation"
                inputValue={props.serviceMember?.unidentified_explanation}
                inputOnChange={props.updateServiceMemberUnidentifiedExplanation}
                inputOnBlur={saveServiceMemberUnidentifiedExplanation}
                textareaClass="small"
                inputDisabled={!isApplicationEditable(props.application)}
                isValid={unidentifiedSMValid.valid}
                errorMessage={unidentifiedSMValid.message}
                withActualLabel
              />
            </div>
          </div>
        )}

        {canBeSubmittedAsException && (
          <Fragment>
            {missingRequiredFields &&
              props.stay?.status != STAYSTATUS.DRAFT &&
              props.stay?.status != STAYSTATUS.RETURNED && (
                <div className="detail-block">
                  <h5>
                    Incomplete Required Fields
                    <a
                      className="more"
                      title="Reveal Explanation"
                      onClick={toggleShouldShowIncompleteRequiredFieldsDetails}
                      href=""
                    >
                      {shouldShowIncompleteRequiredFieldsDetails ? 'Collapse' : 'Details'}
                    </a>
                  </h5>
                  <div className={incompleteRequiredFieldsSubmittedClasses}>
                    {props.missingLiaisonFields.length > 0 && (
                      <Fragment>
                        <h5>Liaison / Referrer</h5>
                        <ul className="exception-fields">
                          {props.missingLiaisonFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    {!isUnidentifiedServiceMember && props.missingServiceMemberFields.length > 0 && (
                      <Fragment>
                        <h5>Service Member</h5>
                        <ul className="exception-fields">
                          {props.missingServiceMemberFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    {props.missingPatientFields.length > 0 && (
                      <Fragment>
                        <h5>Patient</h5>
                        <ul className="exception-fields">
                          {props.missingPatientFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    {props.missingLodgingFields.length > 0 && (
                      <Fragment>
                        <h5>Lodging</h5>
                        <ul className="exception-fields">
                          {props.missingLodgingFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    <Textareafield
                      intro=""
                      withActualLabel={true}
                      label="Explanation"
                      textareaClass="small"
                      inputDisabled={!isApplicationEditable(props.application)}
                      inputValue={props.application?.exception_narrative}
                      inputOnChange={props.updateExceptionNarrative}
                      inputOnBlur={saveExceptionNarrative}
                      isValid={exceptionNarrativeValid.valid}
                      errorMessage={exceptionNarrativeValid.message}
                    />
                  </div>
                </div>
              )}
            {missingRequiredFields &&
              (props.stay?.status == STAYSTATUS.DRAFT ||
                props.stay?.status == STAYSTATUS.RETURNED) && (
                <Fragment>
                  <h4>Incomplete Required Fields</h4>
                  <div className="hidden-section detail-block">
                    {!isUnidentifiedServiceMember && (
                      <p>The following required fields were incomplete:</p>
                    )}
                    {props.missingLiaisonFields.length > 0 && (
                      <Fragment>
                        <h5>Liaison / Referrer</h5>
                        <ul className="exception-fields">
                          {props.missingLiaisonFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    {!isUnidentifiedServiceMember && props.missingServiceMemberFields.length > 0 && (
                      <Fragment>
                        <h5>Service Member</h5>
                        <ul className="exception-fields">
                          {props.missingServiceMemberFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    {props.missingPatientFields.length > 0 && (
                      <Fragment>
                        <h5>Patient</h5>
                        <ul className="exception-fields">
                          {props.missingPatientFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    {props.missingLodgingFields.length > 0 && (
                      <Fragment>
                        <h5>Lodging</h5>
                        <ul className="exception-fields">
                          {props.missingLodgingFields.map((item) => (
                            <Fragment key={item}>
                              <li key={item}>{item}</li>&nbsp;
                            </Fragment>
                          ))}
                        </ul>
                      </Fragment>
                    )}

                    <Textareafield
                      intro="In order to submit this request as an exception, please explain the reason for the missing required information."
                      withActualLabel={true}
                      label="Explanation"
                      textareaClass="small"
                      inputDisabled={!isApplicationEditable(props.application)}
                      inputValue={props.application?.exception_narrative}
                      inputOnChange={props.updateExceptionNarrative}
                      inputOnBlur={saveExceptionNarrative}
                      isValid={exceptionNarrativeValid.valid}
                      errorMessage={exceptionNarrativeValid.message}
                    />
                  </div>
                </Fragment>
              )}

            {!canBeSubmittedAsException && !missingRequiredFields && (
              <Fragment>
                <div className="detail-block">
                  <Textareafield
                    intro="In order to submit this request as an exception, please explain the reason for the missing required information."
                    withActualLabel={true}
                    label="Reason For Exception"
                    textareaClass="small"
                    inputDisabled={!isApplicationEditable(props.application)}
                    inputValue={props.application?.exception_narrative}
                    inputOnChange={props.updateExceptionNarrative}
                    inputOnBlur={saveExceptionNarrative}
                  />
                </div>
              </Fragment>
            )}
          </Fragment>
        )}

        {(props.stay?.status == STAYSTATUS.DRAFT || props.stay?.status == STAYSTATUS.RETURNED) && (
          <Fragment>
            <LongformAgreement
              key={'liaison-terms-of-use-' + props.application?.id}
              title="Liaison Terms Of Use"
              intro="By completing this form, I certify the following information to be correct and that the service member benefitting has authorized the release of information necessary for Fisher House Foundation to process this request. I accept responsibility for communicating to Fisher House/Hotels for Heroes any changes in the reservation that may be needed."
              inputValue="I AGREE"
              inputChecked={
                props.application?.liaison_terms_of_use_agreement == 'true' ||
                props.application?.liaison_terms_of_use_agreement === true
              }
              inputOnChange={props.updateAndSaveLiaisonAgreement}
              disabled={!isApplicationEditable(props.application)}
            />

            <LongformAgreement
              key={'sm-terms-of-use-' + props.application?.id}
              title="Service Member/Veteran Terms Of Use"
              intro="Hotels for Heroes covers room and tax charges, for one room per family. Guests are expected to adhere to the rules and policies of the hotel. <strong>Guests are required to provide a personal credit card at check‐in</strong>, to be kept on file to pay for any incidentals beyond room and tax."
              inputValue="I AGREE TO ADVISE FAMILY OF TERMS"
              inputChecked={
                props.application?.sm_terms_of_use_agreement == 'true' ||
                props.application?.sm_terms_of_use_agreement === true
              }
              inputOnChange={props.updateAndSaveServiceMemberAgreement}
              disabled={!isApplicationEditable(props.application)}
            />
          </Fragment>
        )}

        {props.stay?.status != STAYSTATUS.DRAFT && props.stay?.status != STAYSTATUS.RETURNED && (
          <Fragment>
            <div className="terms-and-conditions detail-block">
              <h5>
                {props.application?.liaison_terms_of_use_agreement &&
                  props.application?.sm_terms_of_use_agreement && (
                    <Fragment>Liaison agreed to Terms of Use</Fragment>
                  )}
                {(!props.application?.liaison_terms_of_use_agreement ||
                  !props.application?.sm_terms_of_use_agreement) && (
                    <Fragment>Liaison did not agree to Terms of Use -- {props.stay?.status}</Fragment>
                  )}
                <a
                  className="more"
                  title="Reveal Terms &amp; Conditions"
                  onClick={toggleShouldShowTermsDetails}
                  href=""
                >
                  {shouldShowTermsDetails ? 'Collapse' : 'Details'}
                </a>
              </h5>
              <div className={termsSubmittedClasses}>
                <LongformAgreement
                  title="Liaison Terms Of Use"
                  intro="By completing this form, I certify the following information to be correct and that the service member benefitting has authorized the release of information necessary for Fisher House Foundation to process this request. I accept responsibility for communicating to Fisher House/Hotels for Heroes any changes in the reservation that may be needed."
                  inputValue="I AGREE"
                  inputChecked={props.application?.liaison_terms_of_use_agreement}
                  disabled
                />

                <LongformAgreement
                  title="Service Member/Veteran Terms Of Use"
                  intro="Hotels for Heroes covers room and tax charges, for one room per family. Guests are expected to adhere to the rules and policies of the hotel. <strong>Guests are required to provide a personal credit card at check‐in</strong>, to be kept on file to pay for any incidentals beyond room and tax."
                  inputValue="I AGREE TO ADVISE FAMILY OF TERMS"
                  inputChecked={props.application?.sm_terms_of_use_agreement}
                  disabled
                />
              </div>
            </div>
          </Fragment>
        )}

        {isAdministrator() &&
          (props.stay?.status == STAYSTATUS.REQUESTED ||
            props.stay?.status == STAYSTATUS.EXCEPTION) && (
            <Fragment>
              <h4>Lodging Preferences</h4>
              <div className="preferred detail-block">
                <p>
                  <strong>Preferred Room Type: </strong>
                  {props.stay?.room_type_requests && props.stay?.room_type_requests.length > 0
                    ? mapEnumValue(props.stay?.room_type_requests)
                    : 'No Preference'}
                </p>
                {props.stay?.room_type_requests == ROOMTYPE.OTHER && (
                  <p>
                    <strong>Preferred Room Description: </strong>
                    {props.stay?.room_description}
                  </p>
                )}
                <h5>Preferred Room Features: </h5>
                {props.stay?.room_feature_requests && props.stay?.room_feature_requests.length > 0 && (
                  <ul className="preferred room-features">
                    {props.stay.room_feature_requests.map((item, index) => (
                      <Fragment key={item}>
                        <li key={index}>{mapEnumValue(item)}</li>&nbsp;
                      </Fragment>
                    ))}
                  </ul>
                )}
                {props.stay?.special_requests && (
                  <Fragment>
                    <p>
                      <strong>Special Requests: </strong>
                      {props.stay?.special_requests}
                    </p>
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}

        {isAdministrator() &&
          (props.stay?.status == STAYSTATUS.REQUESTED ||
            props.stay?.status == STAYSTATUS.EXCEPTION) && (
            <Fragment>
              <FindAHotel
                stay={props.stay}
                saveStay={props.saveStay}
                updateStay={props.updateStay}
                updateAndSaveStay={props.updateAndSaveStay}
                roomTypeIsValid={roomTypeActualValid.valid}
                roomTypeMessage={roomTypeActualValid.message}
                setRoomTypeActualValid={setRoomTypeActualValid}
                roomTypeDescriptionIsValid={roomTypeDescriptionValid.valid}
                roomTypeDescriptionMessage={roomTypeDescriptionValid.message}
                setRoomTypeDescriptionValid={setRoomTypeDescriptionValid}
                hotelPropertyIsValid={hotelPropertyIsValid.valid}
                hotelPropertyMessage={hotelPropertyIsValid.message}
                setHotelPropertyIsValid={setHotelPropertyIsValid}
                inputDisabled={!isApplicationEditable(props.application)}
              />

              <div className="detail-block">
                <Textfield
                  label="Confirmation Number"
                  wrapperClass=""
                  inputValue={props.stay?.confirmation_number}
                  inputOnChange={updateConfirmationNumber}
                  inputOnBlur={saveConfirmationNumber}
                  isValid={confirmationNumberValid.valid}
                  errorMessage={confirmationNumberValid.message}
                  inputDisabled={!isApplicationEditable(props.application)}
                />
              </div>
            </Fragment>
          )}
        {(props.stay?.status == STAYSTATUS.REQUESTED ||
          props.stay?.status == STAYSTATUS.EXCEPTION) && (
            <GuestDetails
              primaryGuest={props.primaryGuest}
              additionalGuests={props.additionalGuests}
              treatmentFacility={props.treatmentFacility}
            />
          )}

        {isAdministrator() &&
          (props.stay?.status == STAYSTATUS.REQUESTED ||
            props.stay?.status == STAYSTATUS.EXCEPTION) && (
            <Fragment>
              <PaymentDetails
                stay={props.stay}
                updateAndSaveStay={props.updateAndSaveStay}
                updateStay={props.updateStay}
                saveStay={props.saveStay}
                paymentUsedIsValid={paymentUsedValid.valid}
                paymentUsedMessage={paymentUsedValid.message}
                setPaymentUsedValid={setPaymentUsedValid}
                cardIsValid={cardValid.valid}
                cardMessage={cardValid.message}
                setCardValid={setCardValid}
                totalCostIsValid={totalCostValid.valid}
                totalCostMessage={totalCostValid.message}
                setTotalCostValid={setTotalCostValid}
                paymentDetailsIsValid={paymentDetailsValid.valid}
                paymentDetailsMessage={paymentDetailsValid.message}
                setPaymentDetailsValid={setPaymentDetailsValid}
                comparableCostIsValid={comparableCostValid.valid}
                comparableCostMessage={comparableCostValid.message}
                setComparableCostValid={setComparableCostValid}
                inputDisabled={!isApplicationEditable(props.application)}
              />
            </Fragment>
          )}

        {(props.stay?.status == STAYSTATUS.APPROVED ||
          props.stay?.status == STAYSTATUS.COMPLETED ||
          props.stay?.status == STAYSTATUS.REVIEWED ||
          props.stay?.status == STAYSTATUS.CLOSED) && (
            <Fragment>
              <h4>Hotel</h4>
              <HotelDetails hotelID={props.stay?.HotelPropertyID}>
                <p>
                  <strong>Actual Room Type: </strong>
                  {mapEnumValue(props.stay?.room_type_actual)}
                  {props.stay?.room_type_actual == ROOMTYPE.OTHER && (
                    <Fragment>
                      <br />
                      <strong>Actual Room Description: </strong>
                      {props.stay?.room_description_actual}
                    </Fragment>
                  )}
                </p>
                <p>
                  <strong>Confirmation Number: </strong>
                  {props.stay?.confirmation_number}
                </p>
                <p>
                  {props.stay?.guest_stayed_at_hotel == true && (
                    <Fragment>
                      <strong>The guest(s) stayed at the hotel.</strong>
                    </Fragment>
                  )}
                  {props.stay?.guest_stayed_at_hotel == false && (
                    <Fragment>
                      <strong>The guest(s) did not stay at the hotel.</strong>
                    </Fragment>
                  )}
                </p>
                <p>
                  <strong>Requested Stay Dates: </strong>
                  {format(makeTimezoneAwareDate(props.stay?.requested_check_in), 'MM/dd/yyyy')} - {format(makeTimezoneAwareDate(props.stay?.requested_check_out), 'MM/dd/yyyy')}
                </p>
                <p>
                  <strong>Actual Stay Dates: </strong>
                  {format(makeTimezoneAwareDate(props.stay?.actual_check_in), 'MM/dd/yyyy')} - {format(makeTimezoneAwareDate(props.stay?.actual_check_out), 'MM/dd/yyyy')}
                </p>
                {props.stay?.reason_guest_did_not_stay && shouldShowReasonForChangeBox && (
                  <p>
                    <strong>Reason for Change: </strong>
                    {props.stay?.reason_guest_did_not_stay}
                  </p>
                )}
              </HotelDetails>

              <GuestDetails
                primaryGuest={props.primaryGuest}
                additionalGuests={props.additionalGuests}
                treatmentFacility={props.treatmentFacility}
              />

              {isAdministrator() && (
                <PaymentDetails
                  stay={props.stay}
                  updateAndSaveStay={props.updateAndSaveStay}
                  updateStay={props.updateStay}
                  saveStay={props.saveStay}
                  paymentUsedIsValid={paymentUsedValid.valid}
                  paymentUsedMessage={paymentUsedValid.message}
                  setPaymentUsedValid={setPaymentUsedValid}
                  cardIsValid={cardValid.valid}
                  cardMessage={cardValid.message}
                  setCardValid={setCardValid}
                  totalCostIsValid={totalCostValid.valid}
                  totalCostMessage={totalCostValid.message}
                  setTotalCostValid={setTotalCostValid}
                  paymentDetailsIsValid={paymentDetailsValid.valid}
                  paymentDetailsMessage={paymentDetailsValid.message}
                  setPaymentDetailsValid={setPaymentDetailsValid}
                  comparableCostIsValid={comparableCostValid.valid}
                  comparableCostMessage={comparableCostValid.message}
                  setComparableCostValid={setComparableCostValid}
                  inputDisabled={
                    isAdministrator()
                      ? !isApplicationEditable(props.application) ||
                      props.stay?.status == STAYSTATUS.REVIEWED ||
                      props.stay?.status == STAYSTATUS.CLOSED
                      : props.stay?.applicationUserId === profile.id
                  }
                />
              )}
            </Fragment>
          )}

        {isAdministrator() &&
          props.stay?.status != STAYSTATUS.DRAFT &&
          props.stay?.status != STAYSTATUS.DECLINED &&
          props.stay?.status != STAYSTATUS.RETURNED && (
            <Fragment>
              <div className="detail-block documents">
                <h5>
                  Documents
                  {!shouldNotShowOptionalForFiles && <Fragment>&nbsp;(Optional)</Fragment>}
                  {isApplicationEditable(props.application) && (
                    <a className={addMoreFilesClass} href="#" onClick={handleAddMoreFilesClick}>
                      Add
                    </a>
                  )}
                </h5>
                <div className={filesClass}>
                  <div>
                    <ul>
                      {props.stay?.hotel_files &&
                        props.stay.hotel_files.length > 0 &&
                        props.stay.hotel_files.map((item, index) => {
                          const parts = item.key.split('/');
                          return (
                            <li key={item.key}>
                              <a
                                href="#"
                                onClick={(e) => processClickOnFile(e, item.key, item.user)}
                                title=""
                              >
                                {parts.pop()}
                                <button
                                  type="button"
                                  className="delete"
                                  disabled={
                                    props.stay?.status == STAYSTATUS.CLOSED ||
                                    props.stay?.status == STAYSTATUS.REVIEWED ||
                                    !isApplicationEditable(props.application)
                                  }
                                  onClick={(e) => {
                                    removeFile(e, item.key, item.user, index);
                                  }}
                                >
                                  Delete
                                </button>
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                    {props.stay?.hotel_files && props.stay.hotel_files.length > 0 && (
                      <a
                        className={uploadDocumentUserButton}
                        href=""
                        onClick={handleUploadFileClick}
                      >
                        Upload a Document
                      </a>
                    )}
                    <input
                      type="file"
                      className={uploadDocumentNativeButtonClass}
                      ref={addFileUpload}
                      onChange={handleUploadFileAddFile}
                      disabled={
                        props.stay?.status == STAYSTATUS.CLOSED ||
                        !isApplicationEditable(props.application)
                      }
                    />
                  </div>
                </div>
              </div>
            </Fragment>
          )}

        {props.stay?.status == STAYSTATUS.APPROVED && (
          <Fragment>
            <h4>Complete Stay</h4>
            <div className="detail-block">
              <p>Did the guest(s) stay at the hotel?</p>
              <Radios
                options={yesNoOptions}
                withFieldset
                selected={props.stay?.guest_stayed_at_hotel}
                onChange={updateAndSaveGuestStayedAtHotel}
                isValid={isStayAtHotelValid.valid}
                errorMessage={isStayAtHotelValid.message}
                inputDisabled={!isApplicationEditable(props.application, true)}
              />
              {props.stay?.guest_stayed_at_hotel && (
                <div className="actual-stay-dates">
                  <h4>Actual Stay Dates</h4>
                  <p>What were the actual dates the guest(s) stayed at the hotel?</p>
                  <div className="stay-dates">
                    <Datefield
                      label="Check-In"
                      selectsStart
                      selected={
                        actual_check_in
                      }
                      startDate={
                        actual_check_in
                      }
                      endDate={
                        actual_check_out
                      }
                      maxDate={
                        actual_check_out ? actual_check_out : '9999-12-31'
                      }
                      onChange={updateAndSaveActualCheckInDate}
                      isValid={isActualCheckInDateValid.valid}
                      errorMessage={isActualCheckInDateValid.message}
                      inputDisabled={!isApplicationEditable(props.application, true)}
                    />
                    <Datefield
                      label="Check-Out"
                      selectsEnd
                      selected={
                        actual_check_out
                      }
                      startDate={
                        actual_check_in
                      }
                      endDate={
                        actual_check_out
                      }
                      minDate={
                        actual_check_in
                      }
                      maxDate={
                        '9999-12-31'
                      }
                      onChange={updateAndSaveActualCheckOutDate}
                      isValid={isActualCheckOutDateValid.valid}
                      errorMessage={isActualCheckOutDateValid.message}
                      inputDisabled={!isApplicationEditable(props.application, true)}
                    />
                  </div>
                </div>
              )}
              {shouldShowReasonForChangeBox && (
                <div className="narrative">
                  <Textareafield
                    intro={reasonForChangeIntroText}
                    label="Reason for Change"
                    withActualLabel
                    inputValue={props.stay?.reason_guest_did_not_stay}
                    inputOnChange={updateReasonGuestDidNotStay}
                    inputOnBlur={saveReasonGuestDidNotStay}
                    isValid={isReasonForChangeValid.valid}
                    errorMessage={isReasonForChangeValid.message}
                    inputDisabled={!isApplicationEditable(props.application, true)}
                  />
                </div>
              )}
            </div>
          </Fragment>
        )}

        {props.stay?.status != STAYSTATUS.DRAFT && props.stay?.status != STAYSTATUS.RETURNED && (
          <Fragment>
            {isLiaison() &&
              (props.stay?.status == STAYSTATUS.REQUESTED ||
                props.stay?.status == STAYSTATUS.EXCEPTION) && (
                <div className="awaiting-admin-response">
                  <span className="loading">Awaiting Admin Response</span>
                </div>
              )}
          </Fragment>
        )}

        {props.stay?.status == STAYSTATUS.COMPLETED && isAdministrator() && (
          <Fragment>
            <h4>Reconcile and Close</h4>
            <Checkboxes
              withFieldset
              options={itemsToReconcile}
              onChange={updateAndSaveReconcileStatus}
              selected={reconcileCheckedOptions}
              inputDisabled={!isApplicationEditable(props.application)}
            />
            {readyForMarkAsReview() && (
              <Fragment>
                <div className="stay-controls">
                  <button
                    type="button"
                    className="reviewed"
                    onClick={reviewStay}
                    disabled={!isApplicationEditable(props.application)}
                  >
                    Mark As Reviewed
                  </button>
                </div>
              </Fragment>
            )}
          </Fragment>
        )}

        {props.stay?.status == STAYSTATUS.REVIEWED && isAdministrator() && (
          <Fragment>
            <div className="detail-block">
              <p>
                <span className="check">
                  <Image src={CheckImage} alt="Checkmark" />
                </span>
                This stay is ready to be closed.{' '}
                <Link
                  href={{
                    pathname: '/application',
                    query: { status: APPLICATIONSTATUS.REVIEWED, type: 'stays' },
                  }}
                >
                  <a>See all Reviewed Hotel Stays</a>
                </Link>
              </p>
            </div>
          </Fragment>
        )}

        {(props.stay?.status == STAYSTATUS.EXCEPTION ||
          props.stay?.status == STAYSTATUS.REQUESTED) &&
          shouldShowReasonForExceptionBox &&
          isAdministrator() && (
            <Fragment>
              <h4>Reason for Return</h4>
              <div className="detail-block returned-note">
                <Textareafield
                  intro="Let the Liaison know why this stay is being returned."
                  textareaClass="small no-label"
                  inputRequired
                  inputValue={props.stay?.reason_return}
                  inputOnChange={updateReturnReasonValue}
                  inputOnBlur={saveReturnReasonValue}
                  inputDisabled={!isApplicationEditable(props.application)}
                  isValid={returnStayExplanationValid.valid}
                  errorMessage={returnStayExplanationValid.message}
                />
              </div>
              <div className="stay-controls">
                <button
                  type="button"
                  className="cancel"
                  onClick={cancelReturnDecline}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="return final"
                  onClick={submitReturnButton}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Return
                </button>
              </div>
            </Fragment>
          )}

        {(props.stay?.status == STAYSTATUS.EXCEPTION ||
          props.stay?.status == STAYSTATUS.REQUESTED) &&
          shouldShowReasonForDeclineBox &&
          isAdministrator() && (
            <Fragment>
              <h4>Reason for Decline</h4>
              <div className="detail-block returned-note">
                <Textareafield
                  intro="Let the Liaison know why this stay is being declined."
                  textareaClass="small no-label"
                  inputRequired
                  inputValue={props.stay?.reason_decline}
                  inputOnChange={updateDeclineReasonValue}
                  inputOnBlur={saveDeclineReasonValue}
                  isValid={reasonForDeclineValid.valid}
                  errorMessage={reasonForDeclineValid.message}
                  inputDisabled={!isApplicationEditable(props.application)}
                />
              </div>
              <div className="stay-controls">
                <button
                  type="button"
                  className="cancel"
                  onClick={cancelReturnDecline}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="decline final"
                  onClick={declineStay}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Decline
                </button>
              </div>
            </Fragment>
          )}

        <div className="stay-controls">
          {(props.stay?.status == STAYSTATUS.DRAFT || props.stay?.status == STAYSTATUS.RETURNED) &&
            props.stay?.type == STAYTYPE.INITIAL && (
              <button
                type="button"
                className="delete"
                onClick={props.deleteApplication}
                disabled={!isApplicationEditable(props.application)}
              >
                Delete
              </button>
            )}
          {canBeSubmittedAsException &&
            agreedToAllTerms &&
            (props.stay?.status == STAYSTATUS.DRAFT ||
              props.stay?.status == STAYSTATUS.RETURNED) && (
              <button
                type="button"
                className="request as-exception"
                onClick={props.submitStayAsException}
                disabled={!isApplicationEditable(props.application)}
              >
                Submit as Exception
              </button>
            )}
          {!canBeSubmittedAsException &&
            agreedToAllTerms &&
            (props.stay?.status == STAYSTATUS.DRAFT ||
              props.stay?.status == STAYSTATUS.RETURNED) && (
              <button
                type="button"
                className="request"
                onClick={props.submitStay}
                disabled={!isApplicationEditable(props.application)}
              >
                Submit
              </button>
            )}

          {(props.stay?.status == STAYSTATUS.EXCEPTION ||
            props.stay?.status == STAYSTATUS.REQUESTED) &&
            !shouldShowReasonForDeclineBox &&
            !shouldShowReasonForExceptionBox &&
            isAdministrator() && (
              <Fragment>
                <button
                  type="button"
                  className="approve"
                  onClick={approveStay}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="return"
                  onClick={submitReturnButton}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Return
                </button>
                <button
                  type="button"
                  className="decline"
                  onClick={declineStay}
                  disabled={!isApplicationEditable(props.application)}
                >
                  Decline
                </button>
              </Fragment>
            )}
          {props.stay?.status == STAYSTATUS.APPROVED && (
            <Fragment>
              <button
                type="button"
                className="complete"
                onClick={completeStay}
                disabled={!isApplicationEditable(props.application, true)}
              >
                Complete
              </button>
            </Fragment>
          )}
        </div>
      </form>
    </Fragment>
  );
}
