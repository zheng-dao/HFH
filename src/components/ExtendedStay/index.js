import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import Datefield from '@components/Inputs/Datefield';
import Textareafield from '@components/Inputs/Textareafield';
import Textfield from '@components/Inputs/Textfield';
import Radios from '../Inputs/Radios';
import { yesNoOptions } from '@utils/yesNoOptions';
import useAuth from '@contexts/AuthContext';
import {
  STAYSTATUS,
  ROOMTYPE,
  PAYMENTTYPETYPE,
  NOTEACTION,
  APPLICATIONSTATUS,
  USERSTATUS,
} from '@src/API';
import { Stay } from '@src/models';
import useDialog from '@contexts/DialogContext';
import FindAHotel from '@components/FindAHotel';
import PaymentDetails from '@components/PaymentDetails';
import useApplicationContext from '@contexts/ApplicationContext';
import toast from 'react-hot-toast';
import validateRequired from '@utils/validators/required';
import validateHotelDate from '@utils/validators/hotelDate';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import { usersByStatus } from '@src/graphql/queries';
import Checkboxes from '../Inputs/Checkboxes';
import Link from 'next/link';
import Image from 'next/image';
import CheckImage from '@public/img/check.svg';
import isApplicationEditable from '@utils/isApplicationEditable';
import createNote from '@utils/createNote';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';
import { makeTimezoneAwareDate } from '@utils/makeTimezoneAwareDate';
import HotelDetails from '../HotelDetails';
import stayStatusOptions from '@utils/stayStatusOptions';
import maskLiaisonStayStatus from '@utils/maskLiaisonStayStatus';

export default function ExtendedStay(props) {
  const { profile, isAdministrator, isLiaison } = useAuth();
  const {
    extendedStays,
    setExtendedStays,
    sourceExtendedStays,
    setSourceExtendedStays,
    application,
    saveStay,
    deleteStay,
    serviceMember,
  } = useApplicationContext();
  const { setMessage } = useDialog();
  const [isOpen, setIsOpen] = useState(true);
  const [checkinDateValid, setCheckinDateValid] = useState(false);
  const [checkoutDateValid, setCheckoutDateValid] = useState(false);
  const [narrativeValid, setNarrativeValid] = useState(false);
  const [reasonForReturnValid, setReasonForReturnValid] = useState(false);
  const [reasonForDeclineValid, setReasonForDeclineValid] = useState(false);
  const [roomTypeActualValid, setRoomTypeActualValid] = useState(false);
  const [roomTypeDescriptionValid, setRoomTypeDescriptionValid] = useState(false);
  const [hotelPropertyIsValid, setHotelPropertyIsValid] = useState(false);
  const [confirmationNumberValid, setConfirmationNumberValid] = useState(false);
  const [paymentUsedValid, setPaymentUsedValid] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [totalCostValid, setTotalCostValid] = useState(false);
  const [paymentDetailsValid, setPaymentDetailsValid] = useState(false);
  const [comparableCostValid, setComparableCostValid] = useState(false);
  const [isStayAtHotelValid, setIsStayAtHotelValid] = useState(false);
  const [isReasonForChangeValid, setIsReasonForChangeValid] = useState(false);
  const [isActualCheckInDateValid, setIsActualCheckInDateValid] = useState(false);
  const [isActualCheckOutDateValid, setIsActualCheckOutDateValid] = useState(false);
  const [shouldShowReasonForReturn, setShouldShowReasonForReturn] = useState(false);
  const [shouldShowReasonForDecline, setShouldShowReasonForDecline] = useState(false);
  const [shouldShowAddMoreFiles, setShouldShowAddMoreFiles] = useState(false);
  const [itemsToReconcile, setItemsToReconcile] = useState([]);
  const [reconcileCheckedOptions, setReconcileCheckedOptions] = useState([]);

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
  }, [getAdmins, getLiaisons]);

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

  const readyForMarkAsReview = () => {
    let isReady = true;
    itemsToReconcile.forEach((item) => {
      if (!reconcileCheckedOptions.includes(item.key)) {
        isReady = false;
      }
    });
    if (props.stay.hotel_files == null || props.stay.hotel_files.length < 1) {
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
      if (props.stay?.payment_type == 'Credit Card') {
        if (
          props.stay?.card &&
          props.stay?.card !== '' &&
          props.stay?.payment_cost_of_reservation &&
          props.stay?.payment_cost_of_reservation !== ''
        ) {
          items.push({ key: 'charge_reconcile', value: 'Charge Reconciled' });
        }
      } else {
      }
    }
    setItemsToReconcile(items);
  }, [
    props.stay,
    props.stay?.hotel_files,
    props.stay?.payment_type,
    props.stay?.card_used_for_incidentals,
    props.stay?.payment_method?.type,
    props.stay?.payment_method?.name,
  ]);

  const stayHeadingClasses = classNames('stay-heading', {
    collapsed: !isOpen,
  });

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

  const stayContentClass = classNames('stay-contents', {
    hidden: !isOpen,
  });

  const updateCheckInDate = (e) => {
    const newStay = Stay.copyOf(props.stay, (updated) => {
      updated.requested_check_in = e.target.value !== '' ? e.target.value : null;
    });
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
    saveStay(newStay).then(() => toast('Saved Extended Stay Check In Date.'));
  };

  const saveCheckInDate = (e) => {
    const isValid = validateRequired(e.target.value);
    if (isValid.valid) {
      setCheckinDateValid(validateHotelDate(e.target.value));
    } else {
      setCheckinDateValid(isValid);
    }
  };

  const updateCheckoutDate = (e) => {
    const newStay = Stay.copyOf(props.stay, (updated) => {
      updated.requested_check_out = e.target.value !== '' ? e.target.value : null;
    });
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
    saveStay(newStay).then(() => toast('Saved Extended Stay Check Out Date.'));
  };

  const saveCheckOutDate = (e) => {
    const isValid = validateRequired(e.target.value);
    if (isValid.valid) {
      setCheckoutDateValid(validateHotelDate(e.target.value));
    } else {
      setCheckoutDateValid(isValid);
    }
  };

  const updateNarrative = (e) => {
    const newStay = Stay.copyOf(props.stay, (updated) => {
      updated.narrative = e.target.value;
    });
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
  };

  const saveNarrative = (e) => {
    const isValid = validateRequired(props.stay.narrative);
    setNarrativeValid(isValid);
    saveStay(props.stay).then(() => toast('Saved Extended Stay Narrative.'));
  };

  const updateReasonForReturn = (e) => {
    const newStay = Stay.copyOf(props.stay, (updated) => {
      updated.reason_return = e.target.value;
    });
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
  };

  const saveReasonForReturn = (e) => {
    const isValid = validateRequired(props.stay.reason_return);
    setReasonForReturnValid(isValid);
    saveStay(props.stay).then(() => toast('Saved Reason for Return.'));
  };

  const updateReasonForDecline = (e) => {
    const newStay = Stay.copyOf(props.stay, (updated) => {
      updated.reason_decline = e.target.value;
    });
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
  };

  const saveReasonForDecline = (e) => {
    const isValid = validateRequired(props.stay.reason_decline);
    setReasonForDeclineValid(isValid);
    saveStay(props.stay).then(() => toast('Saved Reason for Decline.'));
  };

  const updateConfirmationNumber = (e) => {
    const newStay = Stay.copyOf(props.stay, (updated) => {
      updated.confirmation_number = e.target.value;
    });
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
  };

  const saveConfirmationNumber = (e) => {
    const isValid = validateRequired(props.stay.confirmation_number);
    setConfirmationNumberValid(isValid);
    saveStay(props.stay).then(() => toast('Saved Confirmation Number.'));
  };

  const updateStay = (stay, updateFunction) => {
    const newStay = Stay.copyOf(props.stay, updateFunction);
    const index = extendedStays.findIndex((item) => item.id == props.stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
  };

  const updateAndSaveStay = (stay, updateFunction) => {
    const newStay = Stay.copyOf(stay, updateFunction);
    const index = extendedStays.findIndex((item) => item.id == stay.id);
    setExtendedStays([
      ...extendedStays.slice(0, index),
      newStay,
      ...extendedStays.slice(index + 1),
    ]);
    saveStay(newStay)
      .then((s) => {
        const index = extendedStays.findIndex((item) => item.id == s.id);
        setExtendedStays([...extendedStays.slice(0, index), s, ...extendedStays.slice(index + 1)]);
      })
      .then(() => toast('Saved Extended Stay'));
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
    updateAndSaveStay(props.stay, (u) => {
      u.guest_stayed_at_hotel = e.target.value == 'true';
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

  const updateAndSaveActualCheckInDate = (e) => {
    if (e.target.value !== '') {
      setIsActualCheckInDateValid(validateRequired(e.target.value));
    }
    updateAndSaveStay(props.stay, (u) => {
      u.actual_check_in = e.target.value !== '' ? e.target.value : null;;
    });
  };

  const updateAndSaveActualCheckOutDate = (e) => {
    if (e.target.value !== '') {
      setIsActualCheckOutDateValid(validateRequired(e.target.value));
    }
    updateAndSaveStay(props.stay, (u) => {
      u.actual_check_out = e.target.value !== '' ? e.target.value : null;;
    });
  };

  const updateAndSaveReconcileStatus = (e) => {
    updateAndSaveStay(props.stay, (u) => {
      u[e.target.value] = e.target.checked;
    });
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
          updateAndSaveStay(props.stay, (u) => {
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
      updateAndSaveStay(props.stay, (u) => {
        u.hotel_files = newHotelFiles;
      });
      Storage.remove(key, { level: 'protected', identityId: user })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const areFieldsEditable = (adminCanEdit) => {
    if (
      adminCanEdit &&
      isAdministrator() &&
      application?.applicationAssignedToId == profile?.id &&
      profile?.id != null
    ) {
      return true;
    } else if (props.stay?.status == STAYSTATUS.DECLINED) {
      return false;
    } else {
      return (
        (adminCanEdit &&
          application?.applicationAssignedToId == profile?.id &&
          profile?.id != null) ||
        ((props.stay?.status == STAYSTATUS.DRAFT || props.stay?.status == STAYSTATUS.RETURNED) &&
          application?.applicationUserId == profile?.id &&
          profile?.id != null)
      );
    }
  };

  const validateRequestFields = () => {
    const checkinValid = validateRequired(props.stay.requested_check_in);
    if (checkinValid.valid) {
      setCheckinDateValid(validateHotelDate(props.stay.requested_check_in));
    } else {
      setCheckinDateValid(checkinValid);
    }
    const checkoutValid = validateRequired(props.stay.requested_check_out);
    if (checkoutValid.valid) {
      setCheckoutDateValid(props.stay.requested_check_out);
    } else {
      setCheckoutDateValid(checkoutValid);
    }
    const narrativeIsValid = validateRequired(props.stay.narrative);
    setNarrativeValid(narrativeIsValid);
    return checkinValid.valid && checkoutValid.valid && narrativeIsValid.valid;
  };

  const validateApprovalFields = () => {
    const checkinValid = validateRequired(props.stay.requested_check_in);
    if (checkinValid.valid) {
      setCheckinDateValid(validateHotelDate(props.stay.requested_check_in));
    } else {
      setCheckinDateValid(checkinValid);
    }
    const checkoutValid = validateRequired(props.stay.requested_check_out);
    if (checkoutValid.valid) {
      setCheckoutDateValid(props.stay.requested_check_out);
    } else {
      setCheckoutDateValid(checkoutValid);
    }
    const hotelSelectionValid = validateRequired(props.stay.HotelPropertyID);
    setHotelPropertyIsValid(hotelSelectionValid);
    const roomTypeValid = validateRequired(props.stay.room_type_actual);
    setRoomTypeActualValid(roomTypeValid);
    const roomDescriptionValid =
      props.stay.room_type_actual == ROOMTYPE.OTHER
        ? validateRequired(props.stay.room_description_actual)
        : { valid: true, message: '' };
    setRoomTypeDescriptionValid(roomDescriptionValid);

    return (
      validatePaymentFields() &&
      checkinValid.valid &&
      checkoutValid.valid &&
      hotelSelectionValid.valid &&
      roomTypeValid.valid &&
      roomDescriptionValid.valid
    );
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
          comparableCostIsValid.valid &&
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
      if (props.stay?.card_used_for_incidentals) {
        const cardIsValid = validateRequired(props.stay.card);
        setCardValid(cardIsValid);
        const totalCostIsValid = validateRequired(props.stay.payment_cost_of_reservation);
        setTotalCostValid(totalCostIsValid);
        extraOptionsValid =
          cardIsValid.valid &&
          totalCostIsValid.valid &&
          paymentDetailsIsValid.valid &&
          comparableCostIsValid.valid &&
          comparableCostIsValid.valid;
      } else {
        extraOptionsValid =
          paymentDetailsIsValid.valid && comparableCostIsValid.valid && comparableCostIsValid.valid;
      }
    }
    return extraOptionsValid && isConfirmationNumberValid.valid && isPaymentUsedValid.valid;
  };

  const validateCompleteFields = () => {
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

  const deleteExtendedStay = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this extended stay?')) {
      var note =
        humanName(profile) +
        ' deleted an Extended Stay (' +
        (props.stay.actual_check_in
          ? format(makeTimezoneAwareDate(props.stay.actual_check_in), 'MM/dd/yyyy')
          : props.stay.requested_check_in
            ? format(makeTimezoneAwareDate(props.stay.requested_check_in), 'MM/dd/yyyy')
            : '') +
        ' - ' +
        (props.stay.actual_check_out
          ? format(makeTimezoneAwareDate(props.stay.actual_check_out), 'MM/dd/yyyy')
          : props.stay.requested_check_out
            ? format(makeTimezoneAwareDate(props.stay.requested_check_out), 'MM/dd/yyyy')
            : '') +
        ').';
      createNote(note, NOTEACTION.CLOSE, application, profile);
      deleteStay(props.stay);
      setExtendedStays((prev) => prev.filter((item) => item.id !== props.stay.id));
    }
  };

  const requestExtendedStay = (e) => {
    e.preventDefault();
    if (!validateRequestFields()) {
      setMessage(
        'The stay is missing information for it to be requested. Please review the information and try again.'
      );
    } else {
      const newStay = Stay.copyOf(props.stay, (updated) => {
        updated.status = STAYSTATUS.REQUESTED;
      });
      const index = extendedStays.findIndex((item) => item.id == props.stay.id);
      setExtendedStays([
        ...extendedStays.slice(0, index),
        newStay,
        ...extendedStays.slice(index + 1),
      ]);
      saveStay(newStay)
        .then(async () => {
          createNote(
            humanName(profile, true) +
            ' requested an Extended Stay (' +
            format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy') +
            ' - ' +
            format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy') +
            ').',
            NOTEACTION.REQUEST_EXTENDED_STAY,
            application,
            profile
          );

          let to = '';
          const dates =
            (newStay?.requested_check_in
              ? format(makeTimezoneAwareDate(newStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (newStay?.requested_check_out
              ? format(makeTimezoneAwareDate(newStay?.requested_check_out), 'MM/dd/yyyy')
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
              initial: false,
              dates: dates,
              link: window.location.href,
              email: emails,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          });
        })
        .then(() => toast('Requested extended stay.'));
    }
  };

  const returnStay = (e) => {
    e.preventDefault();
    if (!shouldShowReasonForReturn) {
      setShouldShowReasonForReturn(true);
    } else {
      const isValid = validateRequired(props.stay.reason_return);
      setReasonForReturnValid(isValid);
      if (!isValid.valid) {
        setMessage(
          'The stay is missing information for it to be returned. Please review the information and try again.'
        );
      } else {
        const newStay = Stay.copyOf(props.stay, (updated) => {
          updated.status = STAYSTATUS.RETURNED;
        });
        const index = extendedStays.findIndex((item) => item.id == props.stay.id);
        setExtendedStays([
          ...extendedStays.slice(0, index),
          newStay,
          ...extendedStays.slice(index + 1),
        ]);
        setShouldShowReasonForReturn(false);
        saveStay(newStay)
          .then(async () => {
            createNote(
              humanName(profile) +
              ' returned the Extended Stay (' +
              format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy') +
              ' - ' +
              format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy') +
              ').',
              NOTEACTION.RETURN,
              application,
              profile
            );

            let to = '';
            const dates =
              (newStay?.requested_check_in
                ? format(makeTimezoneAwareDate(newStay?.requested_check_in), 'MM/dd/yyyy')
                : '') +
              ' - ' +
              (newStay?.requested_check_out
                ? format(makeTimezoneAwareDate(newStay?.requested_check_out), 'MM/dd/yyyy')
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
                initial: false,
                dates: dates,
                reason: newStay.reason_return,
                link: window.location.href,
                email: emails,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });
          })
          .then(() => toast('Returned extended stay.'));
      }
    }
  };

  const declineStay = async (e) => {
    e.preventDefault();
    if (!shouldShowReasonForDecline) {
      setShouldShowReasonForDecline(true);
    } else {
      const isValid = validateRequired(props.stay.reason_decline);
      setReasonForDeclineValid(isValid);
      if (!isValid.valid) {
        setMessage(
          'The stay is missing information for it to be declined. Please review the information and try again.'
        );
      } else {
        const newStay = Stay.copyOf(props.stay, (updated) => {
          updated.status = STAYSTATUS.DECLINED;
        });
        const index = extendedStays.findIndex((item) => item.id == props.stay.id);
        setExtendedStays([
          ...extendedStays.slice(0, index),
          newStay,
          ...extendedStays.slice(index + 1),
        ]);
        setShouldShowReasonForDecline(false);
        saveStay(newStay)
          .then(async () => {
            createNote(
              humanName(profile) +
              ' declined the Extended Stay (' +
              format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy') +
              ' - ' +
              format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy') +
              ').',
              NOTEACTION.DECLINE,
              application,
              profile
            );
            let to = '';
            const dates =
              (newStay?.requested_check_in
                ? format(makeTimezoneAwareDate(newStay?.requested_check_in), 'MM/dd/yyyy')
                : '') +
              ' - ' +
              (newStay?.requested_check_out
                ? format(makeTimezoneAwareDate(newStay?.requested_check_out), 'MM/dd/yyyy')
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
                initial: false,
                dates: dates,
                reason: newStay.reason_decline,
                link: window.location.href,
                email: emails,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });
          })
          .then(() => toast('Declined extended stay.'));
      }
    }
  };

  const cancelDeclineStay = (e) => {
    e.preventDefault();
    setShouldShowReasonForDecline(false);
  };

  const cancelReturnStay = (e) => {
    e.preventDefault();
    setShouldShowReasonForReturn(false);
  };

  const approveStay = (e) => {
    e.preventDefault();
    if (!validateApprovalFields()) {
      setMessage(
        'The stay is missing information for it to be approved. Please review the information and try again.'
      );
    } else {
      const newStay = Stay.copyOf(props.stay, (updated) => {
        updated.status = STAYSTATUS.APPROVED;
      });
      const index = extendedStays.findIndex((item) => item.id == props.stay.id);
      setExtendedStays([
        ...extendedStays.slice(0, index),
        newStay,
        ...extendedStays.slice(index + 1),
      ]);
      setShouldShowReasonForDecline(false);
      saveStay(newStay)
        .then(async () => {
          createNote(
            humanName(profile, true) +
            ' approved the Extended Stay (' +
            format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy') +
            ' - ' +
            format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy') +
            ').',
            NOTEACTION.APPROVE_EXTENDED_STAY,
            application,
            profile
          );

          let to = '';
          const dates =
            (newStay?.requested_check_in
              ? format(makeTimezoneAwareDate(newStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (newStay?.requested_check_out
              ? format(makeTimezoneAwareDate(newStay?.requested_check_out), 'MM/dd/yyyy')
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
              initial: false,
              dates: dates,
              link: window.location.href,
              email: emails,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          });
        })
        .then(() => toast('Approved extended stay.'));
    }
  };

  const uploadDocumentUserButton = classNames('upload', 'button', {
    disabled: props.stay?.status == STAYSTATUS.CLOSED || !areFieldsEditable(true),
  });

  const uploadDocumentNativeButtonClass = classNames({
    hidden: props.stay?.hotel_files && props.stay.hotel_files.length > 0,
  });

  const completeStay = (e) => {
    e.preventDefault();
    if (!validateCompleteFields()) {
      setMessage(
        'The stay is missing information for it to be completed. Please review the information and try again.'
      );
    } else {
      const newStay = Stay.copyOf(props.stay, (updated) => {
        updated.status = STAYSTATUS.COMPLETED;
      });
      const index = extendedStays.findIndex((item) => item.id == props.stay.id);
      setExtendedStays([
        ...extendedStays.slice(0, index),
        newStay,
        ...extendedStays.slice(index + 1),
      ]);
      setShouldShowReasonForDecline(false);
      saveStay(newStay)
        .then(async () => {
          let to = '';
          const dates =
            (newStay?.requested_check_in
              ? format(makeTimezoneAwareDate(newStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (newStay?.requested_check_out
              ? format(makeTimezoneAwareDate(newStay?.requested_check_out), 'MM/dd/yyyy')
              : '');
          const requested_dates =
            (newStay?.requested_check_in
              ? format(makeTimezoneAwareDate(newStay?.requested_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (newStay?.requested_check_out
              ? format(makeTimezoneAwareDate(newStay?.requested_check_out), 'MM/dd/yyyy')
              : '');
          const actual_dates =
            (newStay?.actual_check_in
              ? format(makeTimezoneAwareDate(newStay?.actual_check_in), 'MM/dd/yyyy')
              : '') +
            ' - ' +
            (newStay?.actual_check_out
              ? format(makeTimezoneAwareDate(newStay?.actual_check_out), 'MM/dd/yyyy')
              : '');
          const completion_type = newStay.guest_stayed_at_hotel
            ? newStay?.actual_check_in !== newStay?.requested_check_in ||
              newStay?.actual_check_out !== newStay?.requested_check_out
              ? 'modified'
              : 'stayed'
            : 'noshow';
          const reason =
            completion_type === 'modified' || completion_type === 'noshow'
              ? newStay.reason_guest_did_not_stay
                ? '<em>' + newStay.reason_guest_did_not_stay + '</em>'
                : ''
              : '';

          var note = '';
          if (completion_type === 'modified') {
            note =
              humanName(profile, true) +
              ' completed the Extended Stay with changes (Requested: ' +
              format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy') +
              ' - ' +
              format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy') +
              ', Actual: ' +
              format(makeTimezoneAwareDate(newStay.actual_check_in), 'MM/dd/yyyy') +
              ' - ' +
              format(makeTimezoneAwareDate(newStay.actual_check_out), 'MM/dd/yyyy') +
              '). Reason: <em>' +
              newStay.reason_guest_did_not_stay +
              '</em>';
          } else if (completion_type === 'stayed') {
            note =
              humanName(profile, true) +
              ' completed the Extended Stay without changes (' +
              format(makeTimezoneAwareDate(newStay.actual_check_in), 'MM/dd/yyyy') +
              ' - ' +
              format(makeTimezoneAwareDate(newStay.actual_check_out), 'MM/dd/yyyy') +
              ').';
          } else {
            note =
              humanName(profile, true) +
              ' completed the Extended Stay. The guest(s) did not stay (Requested: ' +
              format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy') +
              ' - ' +
              format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy') +
              ', Actual: None). Reason: <em>' +
              newStay.reason_guest_did_not_stay +
              '</em>';
          }

          createNote(note, NOTEACTION.COMPLETE_EXTENDED_STAY, application, profile);

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
              initial: false,
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
        .then(() => toast('Completed extended stay.'));
    }
  };

  const reviewStay = (e) => {
    e.preventDefault();
    if (!validateCompleteFields()) {
      setMessage(
        'The application is missing information for it to be reviewed. Please review the information and try again.'
      );
    } else {
      // props.reviewStay(props.stay);
      const newStay = Stay.copyOf(props.stay, (u) => {
        u.status = STAYSTATUS.REVIEWED;
        u.ready_for_final_reconcile = true;
      });
      const index = extendedStays.findIndex((item) => item.id == props.stay.id);
      setExtendedStays([
        ...extendedStays.slice(0, index),
        newStay,
        ...extendedStays.slice(index + 1),
      ]);

      saveStay(newStay)
        // .then(() => {
        //   const newApplication = Application.copyOf(application, (u) => {
        //     u.status = APPLICATIONSTATUS.REVIEWED;
        //   });
        //   setApplication(newApplication);
        //   saveApplication(newApplication);
        // })
        .then(() => {
          var note = '';
          if (newStay.guest_stayed_at_hotel) {
            note =
              humanName(profile, true) +
              ' reviewed the Extended Stay (' +
              ((newStay.actual_check_in
                ? format(makeTimezoneAwareDate(newStay.actual_check_in), 'MM/dd/yyyy')
                : '') +
                ' - ') +
              (newStay.actual_check_out
                ? format(makeTimezoneAwareDate(newStay.actual_check_out), 'MM/dd/yyyy')
                : '') +
              ').';
          } else {
            note =
              humanName(profile, true) +
              ' reviewed the Extended Stay (' +
              ((newStay.requested_check_in
                ? format(makeTimezoneAwareDate(newStay.requested_check_in), 'MM/dd/yyyy')
                : '') +
                ' - ') +
              (newStay.requested_check_out
                ? format(makeTimezoneAwareDate(newStay.requested_check_out), 'MM/dd/yyyy')
                : '') +
              ').';
          }
          createNote(note, NOTEACTION.REVIEWED, application, profile);
        })
        .then(() => toast('Reviewed extended stay.'));
    }
  };

  const shouldShowReasonForChangeBox =
    (!props.stay?.guest_stayed_at_hotel && props.stay?.guest_stayed_at_hotel != null) ||
    (props.stay?.actual_check_in &&
      props.stay?.actual_check_in != props.stay?.requested_check_in) ||
    (props.stay?.actual_check_out &&
      props.stay?.actual_check_out != props.stay?.requested_check_out);

  const reasonForChangeIntroText =
    !props.stay?.guest_stayed_at_hotel && props.stay?.guest_stayed_at_hotel != null
      ? "Why didn't the guest(s) stay at the hotel?"
      : "Why didn't the guest(s) stay at the hotel for the requested dates?";

  const updateReasonGuestDidNotStay = (e) => {
    updateStay(props.stay, (u) => {
      u.reason_guest_did_not_stay = e.target.value;
    });
  };

  const saveReasonGuestDidNotStay = (e) => {
    setIsReasonForChangeValid(validateRequired(e.target.value));
    saveStay(props.stay);
  };

  const onStatusClick = (e) => {
    e.stopPropagation();
    if (isAdministrator() && canRegressStay()) {
      props.toggleRegressStayDialog();
    }
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
      <div className="app-pane">
        <h3 className={stayHeadingClasses} onClick={() => setIsOpen((prev) => !prev)}>
          Extended Stay
          <span className={stayStatusClass} onClick={onStatusClick}>
            {isAdministrator()
              ? props.stay?.status ?? 'Draft'
              : maskLiaisonStayStatus(props.stay?.status ?? 'DRAFT')}
          </span>
        </h3>
        <form className={stayContentClass}>
          {props.stay?.status == STAYSTATUS.RETURNED && props.stay?.reason_return && (
            <Fragment>
              <h4>Reason for Return</h4>
              <div className="detail-block">
                <p>{props.stay?.reason_return}</p>
              </div>
            </Fragment>
          )}
          {props.stay?.status == STAYSTATUS.DECLINED && props.stay?.reason_decline && (
            <Fragment>
              <h4>Reason for Decline</h4>
              <div className="detail-block">
                <p>{props.stay?.reason_decline}</p>
              </div>
            </Fragment>
          )}

          {(areFieldsEditable(false) ||
            props.stay?.status == STAYSTATUS.DRAFT ||
            props.stay?.status == STAYSTATUS.RETURNED) && (
              <Fragment>
                <div className="stay-dates">
                  <Datefield
                    label="Check-in"
                    onChange={updateCheckInDate}
                    selectsStart
                    selected={
                      props.stay?.requested_check_in
                    }
                    startDate={
                      props.stay?.requested_check_in
                    }
                    endDate={
                      props.stay?.requested_check_out
                    }
                    maxDate={
                      props.stay?.requested_check_out ? props.stay?.requested_check_out : '9999-12-31'
                    }
                    inputDisabled={!areFieldsEditable(true)}
                    onBlur={saveCheckInDate}
                    isValid={checkinDateValid.valid}
                    errorMessage={checkinDateValid.message}
                  />

                  <Datefield
                    label="Check-out"
                    onChange={updateCheckoutDate}
                    selectsEnd
                    selected={
                      props.stay?.requested_check_out
                    }
                    startDate={
                      props.stay?.requested_check_in
                    }
                    endDate={
                      props.stay?.requested_check_out
                    }
                    minDate={
                      props.stay?.requested_check_in
                    }
                    maxDate={'9999-12-31'}
                    inputDisabled={!areFieldsEditable(true)}
                    onBlur={saveCheckOutDate}
                    isValid={checkoutDateValid.valid}
                    errorMessage={checkoutDateValid.message}
                  />
                </div>
              </Fragment>
            )}

          {!areFieldsEditable(false) &&
            props.stay?.status != STAYSTATUS.DRAFT &&
            props.stay?.status != STAYSTATUS.RETURNED && (
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

          {(areFieldsEditable(false) ||
            props.stay?.status == STAYSTATUS.DRAFT ||
            props.stay?.status == STAYSTATUS.RETURNED) && (
              <Textareafield
                label="Narrative"
                intro="Please explain the circumstances validating the extended stay."
                inputValue={props.stay?.narrative}
                inputOnChange={updateNarrative}
                inputOnBlur={saveNarrative}
                inputRequired={true}
                inputDisabled={!areFieldsEditable(true)}
                isValid={narrativeValid.valid}
                errorMessage={narrativeValid.message}
              />
            )}
          {!areFieldsEditable(false) &&
            props.stay?.status != STAYSTATUS.DRAFT &&
            props.stay?.status != STAYSTATUS.RETURNED && (
              <Fragment>
                <h4>Narrative</h4>
                <div className="detail-block">
                  <p>{props.stay?.narrative}</p>
                </div>
              </Fragment>
            )}

          {isAdministrator() && props.stay?.status == STAYSTATUS.REQUESTED && props.primaryStay && (
            <Fragment>
              <h4>Lodging Preferences</h4>
              <div className="preferred detail-block">
                <p>
                  <strong>Preferred Room Type: </strong>
                  {props.primaryStay?.room_type_requests &&
                    props.primaryStay?.room_type_requests.length > 0
                    ? mapEnumValue(props.primaryStay?.room_type_requests)
                    : 'No Preference'}
                </p>
                {props.primaryStay?.room_type_requests == ROOMTYPE.OTHER && (
                  <p>
                    <strong>Preferred Room Description: </strong>
                    {props.primaryStay?.room_description}
                  </p>
                )}
                <h5>Preferred Room Features: </h5>
                {props.primaryStay?.room_feature_requests &&
                  props.primaryStay?.room_feature_requests.length > 0 && (
                    <ul className="preferred room-features">
                      {props.primaryStay.room_feature_requests.map((item, index) => (
                        <Fragment key={item}>
                          <li key={index}>{mapEnumValue(item)}</li>&nbsp;
                        </Fragment>
                      ))}
                    </ul>
                  )}
                {props.primaryStay?.special_requests && (
                  <Fragment>
                    <p>
                      <strong>Special Requests: </strong>
                      {props.primaryStay?.special_requests}
                    </p>
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}

          {props.stay?.status == STAYSTATUS.REQUESTED && isAdministrator() && (
            <Fragment>
              <FindAHotel
                stay={props.stay}
                saveStay={saveStay}
                updateStay={updateStay}
                updateAndSaveStay={updateAndSaveStay}
                roomTypeIsValid={roomTypeActualValid.valid}
                roomTypeMessage={roomTypeActualValid.message}
                setRoomTypeActualValid={setRoomTypeActualValid}
                roomTypeDescriptionIsValid={roomTypeDescriptionValid.valid}
                roomTypeDescriptionMessage={roomTypeDescriptionValid.message}
                setRoomTypeDescriptionValid={setRoomTypeDescriptionValid}
                hotelPropertyIsValid={hotelPropertyIsValid.valid}
                hotelPropertyMessage={hotelPropertyIsValid.message}
                setHotelPropertyIsValid={setHotelPropertyIsValid}
                inputDisabled={!areFieldsEditable(true)}
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
                  inputDisabled={!areFieldsEditable(true)}
                />
              </div>

              <PaymentDetails
                stay={props.stay}
                updateAndSaveStay={updateAndSaveStay}
                updateStay={updateStay}
                saveStay={saveStay}
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
                inputDisabled={!areFieldsEditable(true)}
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
                  {props.stay?.reason_guest_did_not_stay && (
                    <p>
                      <strong>Reason for Change: </strong>
                      {props.stay?.reason_guest_did_not_stay}
                    </p>
                  )}
                </HotelDetails>

                {isAdministrator() && (
                  <PaymentDetails
                    stay={props.stay}
                    updateAndSaveStay={updateAndSaveStay}
                    updateStay={updateStay}
                    saveStay={saveStay}
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
                        ? !areFieldsEditable(true) ||
                        !(
                          props.stay?.status == STAYSTATUS.APPROVED ||
                          props.stay?.status == STAYSTATUS.COMPLETED
                        )
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
                    {areFieldsEditable(true) && (
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
                                      !isApplicationEditable(application)
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
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
                          props.stay?.status == STAYSTATUS.CLOSED || !areFieldsEditable(true)
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
                  inputDisabled={!isApplicationEditable(application, true)}
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
                          props.stay?.actual_check_in
                        }
                        startDate={
                          props.stay?.actual_check_in
                        }
                        endDate={
                          props.stay?.actual_check_out
                        }
                        maxDate={
                          props.stay?.actual_check_out ? props.stay?.actual_check_out : '9999-12-31'
                        }
                        onChange={updateAndSaveActualCheckInDate}
                        isValid={isActualCheckInDateValid.valid}
                        errorMessage={isActualCheckInDateValid.message}
                        inputDisabled={!isApplicationEditable(application, true)}
                      />
                      <Datefield
                        label="Check-Out"
                        selectsEnd
                        selected={
                          props.stay?.actual_check_out
                        }
                        startDate={
                          props.stay?.actual_check_in
                        }
                        endDate={
                          props.stay?.actual_check_out
                        }
                        minDate={
                          props.stay?.actual_check_in
                        }
                        maxDate={'9999-12-31'}
                        onChange={updateAndSaveActualCheckOutDate}
                        isValid={isActualCheckOutDateValid.valid}
                        errorMessage={isActualCheckOutDateValid.message}
                        inputDisabled={!isApplicationEditable(application, true)}
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
                      inputDisabled={!isApplicationEditable(application, true)}
                    />
                  </div>
                )}
              </div>
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
                inputDisabled={!areFieldsEditable(true)}
              />
              {readyForMarkAsReview() && (
                <Fragment>
                  <div className="stay-controls">
                    <button
                      type="button"
                      className="reviewed"
                      onClick={reviewStay}
                      disabled={!areFieldsEditable(true)}
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

          {shouldShowReasonForReturn && (
            <Fragment>
              <h4>Reason for Return</h4>
              <div className="detail-block returned-note">
                <Textareafield
                  intro="Let the Liaison know why this stay is being returned."
                  textareaClass="small no-label"
                  inputRequired
                  inputValue={props.stay?.reason_return}
                  inputOnChange={updateReasonForReturn}
                  inputOnBlur={saveReasonForReturn}
                  isValid={reasonForReturnValid.valid}
                  errorMessage={reasonForReturnValid.message}
                  inputDisabled={!areFieldsEditable(true)}
                />
              </div>
            </Fragment>
          )}

          {shouldShowReasonForDecline && (
            <Fragment>
              <h4>Reason for Decline</h4>
              <div className="detail-block returned-note">
                <Textareafield
                  intro="Let the Liaison know why this stay is being declined."
                  textareaClass="small no-label"
                  inputRequired
                  inputValue={props.stay?.reason_decline}
                  inputOnChange={updateReasonForDecline}
                  inputOnBlur={saveReasonForDecline}
                  isValid={reasonForDeclineValid.valid}
                  errorMessage={reasonForDeclineValid.message}
                  inputDisabled={!areFieldsEditable(true)}
                />
              </div>
            </Fragment>
          )}

          <div className="stay-controls">
            {(props.stay?.status == STAYSTATUS.DRAFT ||
              props.stay?.status == STAYSTATUS.RETURNED) && (
                <Fragment>
                  <button
                    type="button"
                    className="delete"
                    onClick={deleteExtendedStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="request"
                    onClick={requestExtendedStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Request
                  </button>
                </Fragment>
              )}

            {props.stay?.status == STAYSTATUS.REQUESTED &&
              !shouldShowReasonForReturn &&
              !shouldShowReasonForDecline &&
              isAdministrator() && (
                <Fragment>
                  <button
                    type="button"
                    className="approve"
                    onClick={approveStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="return"
                    onClick={returnStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Return
                  </button>
                  <button
                    type="button"
                    className="decline"
                    onClick={declineStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Decline
                  </button>
                </Fragment>
              )}

            {props.stay?.status == STAYSTATUS.REQUESTED &&
              shouldShowReasonForReturn &&
              isAdministrator() && (
                <Fragment>
                  <button
                    type="button"
                    className="return"
                    onClick={returnStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Return
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={cancelReturnStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Cancel
                  </button>
                </Fragment>
              )}

            {props.stay?.status == STAYSTATUS.REQUESTED &&
              shouldShowReasonForDecline &&
              isAdministrator() && (
                <Fragment>
                  <button
                    type="button"
                    className="decline"
                    onClick={declineStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={cancelDeclineStay}
                    disabled={!areFieldsEditable(true)}
                  >
                    Cancel
                  </button>
                </Fragment>
              )}

            {props.stay?.status == STAYSTATUS.APPROVED && (
              <Fragment>
                <button
                  type="button"
                  className="complete"
                  onClick={completeStay}
                  disabled={!isApplicationEditable(application, true)}
                >
                  Complete
                </button>
              </Fragment>
            )}
          </div>
        </form>
      </div>
    </Fragment>
  );
}

ExtendedStay.defaultProps = {
  toggleRegressStayDialog: () => { },
  primaryStay: null,
};
