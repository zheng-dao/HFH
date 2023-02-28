import Datefield from '@components/Inputs/Datefield';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import { useState, useEffect } from 'react';
import { STAYTYPE } from '@src/API';
import { Guest, Base, Stay, Application } from '@src/models';
import GuestInput from '@components/CommonInputs/GuestInput';
import { ROOMTYPE, ROOMFEATURES, NOTEACTION } from '@src/API';
import useApplicationContext from '@contexts/ApplicationContext';
import Textareafield from '../../Inputs/Textareafield';
import Textfield from '../../Inputs/Textfield';
import Selectfield from '../../Inputs/Selectfield';
import Checkboxes from '../../Inputs/Checkboxes';
import isApplicationEditable from '@utils/isApplicationEditable';
import classNames from 'classnames';
import isAfterThreePM from '@utils/isAfterThreePM';
import addDays from 'date-fns/addDays';
import useAuth from '@contexts/AuthContext';
import validateRequired from '@utils/validators/required';
import validateHotelDate from '@utils/validators/hotelDate';
import validateIsAwsDate from '@utils/validators/isAwsDate';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import createNote from '@utils/createNote';
import humanName from '@utils/humanName';
import { mapEnumValue } from '@utils/mapEnumValue';
import { mapFieldValue } from '@utils/mapFieldValue';
import htmlEntities from '@utils/htmlEntities';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import validatePhoneNumber from '@utils/validators/phone';

export default function ApplicationFormPage3(props) {
  const {
    application,
    setApplication,
    primaryGuest,
    sourcePrimaryGuest,
    additionalGuests,
    sourceAdditionalGuests,
    initialStay,
    sourceInitialStay,
    setInitialStay,
    setSourceInitialStay,
    setPrimaryGuest,
    setSourcePrimaryGuest,
    addAdditionalGuest,
    setSourceAdditionalGuests,
    deleteGuest,
    setAdditionalGuests,
    saveStay,
    saveGuest,
    missingAdditionalGuestFields,
    missingPrimaryGuestFields,
  } = useApplicationContext();

  const { profile, isAdministrator } = useAuth();

  const [checkinDateValid, setCheckinDateValid] = useState(false);
  const [checkoutDateValid, setCheckoutDateValid] = useState(false);
  const [narrativeValid, setNarrativeValid] = useState(false);
  const [roomTypeValid, setRoomTypeValid] = useState(false);
  const [roomDescriptionValid, setRoomDescriptionValid] = useState(false);
  const [timeForRerender, setTimeForRerender] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeForRerender(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (props?.shouldShowErrorMessagesFromSubmitValidation) {
      const checkinValid = validateRequired(initialStay?.requested_check_in);
      if (checkinValid.valid) {
        setCheckinDateValid(validateHotelDate(initialStay?.requested_check_in));
      } else {
        setCheckinDateValid(checkinValid);
      }
      const checkoutValid = validateRequired(initialStay?.requested_check_out);
      if (checkoutValid.valid) {
        setCheckoutDateValid(validateHotelDate(initialStay?.requested_check_out));
      } else {
        setCheckoutDateValid(checkoutValid);
      }
      setNarrativeValid(validateRequired(initialStay?.narrative));
      setRoomTypeValid(validateRequired(initialStay?.room_type_requests));
      if (initialStay?.room_type_requests == ROOMTYPE.OTHER) {
        setRoomDescriptionValid(validateRequired(initialStay?.room_description));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.shouldShowErrorMessagesFromSubmitValidation]);

  const updateCheckInDate = (e) => {
    const formattedDate = e.target.value;
    const isValid = validateHotelDate(formattedDate);
    if (!isValid.valid) {
      setCheckinDateValid(isValid);
      return;
    } else {
      if (formattedDate) {
        if (
          parseISO(formattedDate).getTime() >= parseISO(initialStay.requested_check_out).getTime()
        ) {
          setCheckinDateValid({
            valid: false,
            message: 'Please enter a check-in date that is before the check-out date.',
          });
        } else {
          setCheckinDateValid(isValid);
        }
      }
    }

    try {
      const newStay = Stay.copyOf(initialStay, (updated) => {
        updated.requested_check_in = formattedDate !== '' ? formattedDate : null;
      });
      setInitialStay(newStay);
      const originalValue = sourceInitialStay?.requested_check_in || htmlEntities('<empty>');
      const newValue = newStay?.requested_check_in || htmlEntities('<empty>');
      setSourceInitialStay(newStay);
      saveStay(newStay)
        .then((st) => {
          props.updateApplicationForGroup({
            ...application,
            InitialStay: {
              items: [st],
            },
          });
          setApplication(
            deserializeModel(Application, {
              ...application,
              InitialStay: {
                items: [st],
              },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                " changed <span class='field'>Stay's Check-in Date</span> from " +
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
          toast('Saved Check In.');
        });
    } catch (e) {
      console.log('Invalid date trying to be saved.', e);
    }
  };

  const updateCheckOutDate = (e) => {
    const formattedDate = e.target.value;
    const isValid = validateHotelDate(formattedDate);
    if (!isValid.valid) {
      setCheckoutDateValid(isValid);
      return;
    } else {
      if (
        parseISO(initialStay?.requested_check_in).getTime() >= parseISO(formattedDate).getTime()
      ) {
        setCheckoutDateValid({
          valid: false,
          message: 'Please enter a check-in date that is before the check-out date.',
        });
      } else {
        setCheckoutDateValid(isValid);
      }
    }
    try {
      const newStay = Stay.copyOf(initialStay, (updated) => {
        updated.requested_check_out = formattedDate !== '' ? formattedDate : null;;
      });
      setInitialStay(newStay);
      const originalValue = sourceInitialStay?.requested_check_out || htmlEntities('<empty>');
      const newValue = newStay?.requested_check_out || htmlEntities('<empty>');
      setSourceInitialStay(newStay);
      saveStay(newStay)
        .then((st) => {
          props.updateApplicationForGroup({
            ...application,
            InitialStay: {
              items: [st],
            },
          });
          setApplication(
            deserializeModel(Application, {
              ...application,
              InitialStay: {
                items: [st],
              },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                " changed <span class='field'>Stay's Check-out Date</span> from " +
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
          toast('Saved Check Out.');
        });
    } catch (e) {
      console.log('Invalid date trying ot be saved.', e);
    }
  };

  const updateNarrative = (e) => {
    setInitialStay(
      Stay.copyOf(initialStay, (updated) => {
        updated.narrative = e.target.value || null;
      })
    );
  };

  const updateRoomDescription = (e) => {
    setInitialStay(
      Stay.copyOf(initialStay, (updated) => {
        updated.room_description = e.target.value || null;
      })
    );
  };

  const checkinDateOnBlur = (e) => {
    const isValid = validateHotelDate(new Date(e.target.value));
    let formattedDate = null;
    try {
      formattedDate = e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null;
    } catch (e) {
      formattedDate = null;
    }
    const checkinValid = validateRequired(formattedDate);
    if (!checkinValid.valid) {
      setCheckinDateValid(checkinValid);
    } else {
      if (!isValid.valid) {
        setCheckinDateValid(isValid);
        return;
      } else {
        if (
          new Date(e.target.value).getTime() >= parseISO(initialStay.requested_check_out).getTime()
        ) {
          setCheckinDateValid({
            valid: false,
            message: 'Please enter a check-in date that is before the check-out date.',
          });
        } else {
          setCheckinDateValid(isValid);
        }
      }
    }

    try {
      const newStay = Stay.copyOf(initialStay, (updated) => {
        updated.requested_check_in = formattedDate;
      });
      setInitialStay(newStay);
      const originalValue = sourceInitialStay?.requested_check_in || htmlEntities('<empty>');
      const newValue = newStay?.requested_check_in || htmlEntities('<empty>');
      setSourceInitialStay(newStay);
      saveStay(newStay)
        .then((st) => {
          props.updateApplicationForGroup({
            ...application,
            InitialStay: {
              items: [st],
            },
          });
          setApplication(
            deserializeModel(Application, {
              ...application,
              InitialStay: {
                items: [st],
              },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                " changed <span class='field'>Stay's Check-in Date</span> from " +
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
          toast('Saved Check In.');
        });
    } catch (e) {
      console.log('Invalid date trying to be saved.', e);
    }
  };

  const checkoutDateOnBlur = (e) => {
    const isValid = validateHotelDate(new Date(e.target.value));
    let formattedDate = null;
    try {
      formattedDate = e.target.value ? format(new Date(e.target.value), 'yyyy-MM-dd') : null;
    } catch (e) {
      formattedDate = null;
    }
    const checkoutValid = validateRequired(formattedDate);
    if (!checkoutValid.valid) {
      setCheckoutDateValid(checkoutValid);
    } else {
      if (!isValid.valid) {
        setCheckoutDateValid(isValid);
      } else {
        if (
          new Date(e.target.value).getTime() <= parseISO(initialStay.requested_check_in).getTime()
        ) {
          setCheckoutDateValid({
            valid: false,
            message: 'Please enter a check-out date that is after the check-in date.',
          });
        } else {
          setCheckoutDateValid(isValid);
        }
      }
    }

    try {
      const newStay = Stay.copyOf(initialStay, (updated) => {
        updated.requested_check_out = formattedDate;
      });
      setInitialStay(newStay);
      const originalValue = sourceInitialStay?.requested_check_out || htmlEntities('<empty>');
      const newValue = newStay?.requested_check_out || htmlEntities('<empty>');
      setSourceInitialStay(newStay);
      saveStay(newStay)
        .then((st) => {
          props.updateApplicationForGroup({
            ...application,
            InitialStay: {
              items: [st],
            },
          });
          setApplication(
            deserializeModel(Application, {
              ...application,
              InitialStay: {
                items: [st],
              },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                " changed <span class='field'>Stay's Check-out Date</span> from " +
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
          toast('Saved Check Out.');
        });
    } catch (e) {
      console.log('Invalid date trying ot be saved.', e);
    }
  };

  const saveRoomDescription = (e) => {
    setRoomDescriptionValid(validateRequired(e.target.value));
    const newStay = Stay.copyOf(initialStay, (updated) => {
      updated.room_description = e.target.value || null;
    });
    setInitialStay(newStay);
    const originalValue = sourceInitialStay?.room_description || htmlEntities('<empty>');
    const newValue = newStay?.room_description || htmlEntities('<empty>');
    setSourceInitialStay(newStay);
    saveStay(newStay)
      .then((st) => {
        props.updateApplicationForGroup({
          ...application,
          InitialStay: {
            items: [st],
          },
        });
        setApplication(
          deserializeModel(Application, {
            ...application,
            InitialStay: {
              items: [st],
            },
          })
        );
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
              " changed <span class='field'>Stay's Room Description</span> from " +
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
        toast('Saved Room Description.');
      });
  };

  const saveRoomTypeRequest = (e) => {
    const isValid = validateRequired(e?.value);
    setRoomTypeValid(isValid);
    const newStay = Stay.copyOf(initialStay, (updated) => {
      updated.room_type_requests = e?.value === undefined || e?.value == '' ? null : e?.value;
      updated.room_description = null;
    });
    setInitialStay(newStay);
    const originalValue =
      mapEnumValue(sourceInitialStay?.room_type_requests) || htmlEntities('<no selection>');
    const newValue = mapEnumValue(newStay?.room_type_requests) || htmlEntities('<no selection>');
    setSourceInitialStay(newStay);
    saveStay(newStay)
      .then((st) => {
        props.updateApplicationForGroup({
          ...application,
          InitialStay: {
            items: [st],
          },
        });
        setApplication(
          deserializeModel(Application, {
            ...application,
            InitialStay: {
              items: [st],
            },
          })
        );
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
              " changed <span class='field'>Stay's Requested Room Type</span> from " +
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
        toast('Saved Room Type Request.');
      });
  };

  const saveRoomFeatureRequest = (e) => {
    if (e.target.checked) {
      const features =
        initialStay?.room_feature_requests == null
          ? [e.target.value || null]
          : [...initialStay.room_feature_requests, e.target.value || null];
      const newStay = Stay.copyOf(initialStay, (updated) => {
        updated.room_feature_requests = features;
      });
      setInitialStay(newStay);
      saveStay(newStay)
        .then((st) => {
          props.updateApplicationForGroup({
            ...application,
            InitialStay: {
              items: [st],
            },
          });
          setApplication(
            deserializeModel(Application, {
              ...application,
              InitialStay: {
                items: [st],
              },
            })
          );
          if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
            createNote(
              humanName(profile) +
                ' added <span class="field">Room Feature Request</span>: ' +
                mapEnumValue(e.target.value) +
                '.',
              NOTEACTION.CHANGE_DATA,
              application,
              profile
            );
          }
        })
        .then(() => {
          toast('Saved Room Feature Request.');
        });
    } else {
      const room_feature_requests = [
        ...initialStay.room_feature_requests.filter((item) => item != e.target.value),
      ];
      const newStay = Stay.copyOf(initialStay, (updated) => {
        updated.room_feature_requests = room_feature_requests;
      });
      setInitialStay(newStay);
      saveStay(newStay)
        .then((st) => {
          props.updateApplicationForGroup({
            ...application,
            InitialStay: {
              items: [st],
            },
          });
          setApplication(
            deserializeModel(Application, {
              ...application,
              InitialStay: {
                items: [st],
              },
            })
          );
          if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
            createNote(
              humanName(profile) +
                ' removed <span class="field">Room Feature Request</span>: ' +
                mapEnumValue(e.target.value) +
                '.',
              NOTEACTION.CHANGE_DATA,
              application,
              profile
            );
          }
        })
        .then(() => {
          toast('Saved Room Feature Request.');
        });
    }
  };

  const saveNarrative = (e) => {
    const isValid = validateRequired(e.target.value);
    setNarrativeValid(isValid);
    const originalValue = sourceInitialStay?.narrative || htmlEntities('<empty>');
    const newValue = initialStay?.narrative || htmlEntities('<empty>');
    setSourceInitialStay(initialStay);
    saveStay(initialStay)
      .then((st) => {
        props.updateApplicationForGroup({
          ...application,
          InitialStay: {
            items: [st],
          },
        });
        setApplication(
          deserializeModel(Application, {
            ...application,
            InitialStay: {
              items: [st],
            },
          })
        );
        if (
          originalValue != newValue &&
          shouldCreateNoteAboutAdminChange(application, isAdministrator())
        ) {
          createNote(
            humanName(profile) +
              " changed <span class='field'>Stay's Narrative</span> from " +
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
        toast('Saved Narrative.');
      });
  };

  const updateSpecialRequests = (e) => {
    setInitialStay(
      Stay.copyOf(initialStay, (updated) => {
        updated.special_requests = e.target.value || null;
      })
    );
  };

  const saveSpecialRequests = (e) => {
    const isValid = true;
    const originalValue = sourceInitialStay?.special_requests || htmlEntities('<empty>');
    const newValue = initialStay?.special_requests || htmlEntities('<empty>');
    setSourceInitialStay(initialStay);
    saveStay(initialStay)
      .then((st) => {
        props.updateApplicationForGroup({
          ...application,
          InitialStay: {
            items: [st],
          },
        });
        setApplication(
          deserializeModel(Application, {
            ...application,
            InitialStay: {
              items: [st],
            },
          })
        );
        if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
          createNote(
            humanName(profile) +
              " changed <span class='field'>Stay's Special Requests</span> from " +
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
        toast('Saved Special Requests.');
      });
  };

  const addGuest = (e) => {
    e.preventDefault();
    addAdditionalGuest();
    if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
      createNote(
        humanName(profile) + ' added an <span class="field">Additional Guest</span>.',
        NOTEACTION.CHANGE_DATA,
        application,
        profile
      );
    }
  };

  const removeGuest = (id) => {
    const index = additionalGuests.findIndex((guest) => guest.id === id);
    deleteGuest(additionalGuests[index])
      .then(() => {
        setAdditionalGuests([
          ...additionalGuests.filter((item) => {
            return item.id !== id;
          }),
        ]);
      })
      .then(() => {
        if (shouldCreateNoteAboutAdminChange(application, isAdministrator())) {
          createNote(
            humanName(profile) + ' removed an <span class="field">Additional Guest</span>.',
            NOTEACTION.CHANGE_DATA,
            application,
            profile
          );
        }
      });
  };

  const updateGuestField = (e, id) => {
    let val = null;
    let field = null;
    if (typeof e?.target == 'undefined') {
      if (typeof e == 'undefined') {
        val = null;
      } else {
        val = e;
      }
      field = 'telephone';
      const is_valid = validatePhoneNumber(val);
      if (!is_valid.valid) {
        // setPrimaryGuest(sourcePrimaryGuest);
        setPrimaryGuest(
          Guest.copyOf(primaryGuest, (updated) => {
            updated[field] = val;
          })
        );
        return;
      }
    } else if (e.target.type == 'checkbox') {
      val = e.target.checked;
      field = e.target.dataset.field;
    } else {
      val = e.target.value;
      field = e.target.dataset.field;
    }
    if (typeof id === 'undefined') {
      setPrimaryGuest(
        Guest.copyOf(primaryGuest, (updated) => {
          updated[field] = val;
        })
      );
    } else {
      const index = additionalGuests.findIndex((guest) => guest.id === id);
      additionalGuests[index] = Guest.copyOf(
        deserializeModel(Guest, additionalGuests[index]),
        (updated) => {
          updated[field] = val;
        }
      );
      setAdditionalGuests([...additionalGuests]);
    }
  };

  const saveGuestField = (e, id) => {
    let val = null;
    let field = null;
    if (typeof e?.target == 'undefined') {
      if (typeof e == 'undefined') {
        val = null;
      } else {
        val = e;
      }
      field = 'telephone';
    } else if (e.target.type == 'checkbox') {
      val = e.target.checked;
      field = e.target.dataset.field;
    } else {
      val = e.target.value;
      field = e.target.dataset.field;
    }
    if (typeof id === 'undefined') {
      if (field === 'telephone') {
        const is_valid = validatePhoneNumber(val);
        if (!is_valid.valid) {
          return;
        }
      }
      
      const originalValue = sourcePrimaryGuest[field] || htmlEntities('<empty>');
      const newValue = primaryGuest[field] || htmlEntities('<empty>');
      setSourcePrimaryGuest(primaryGuest);
      saveGuest(primaryGuest)
        .then((pg) => {
          setApplication(
            deserializeModel(Application, {
              ...application,
              PrimaryGuest: { items: [pg] },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                ' changed ' +
                "<span class='field'>Primary Guest " +
                mapFieldValue(field) +
                '</span>' +
                ' from ' +
                (mapFieldValue(field) === 'Telephone'
                  ? originalValue.includes('+1')
                    ? formatPhoneNumber(originalValue)
                    : formatPhoneNumberIntl(originalValue) || htmlEntities('<empty>')
                  : originalValue) +
                ' to ' +
                (mapFieldValue(field) === 'Telephone'
                  ? newValue.includes('+1')
                    ? formatPhoneNumber(newValue)
                    : formatPhoneNumberIntl(newValue) || htmlEntities('<empty>')
                  : newValue) +
                '.',
              NOTEACTION.CHANGE_DATA,
              application,
              profile
            );
          }
        })
        .then(() => toast('Saved Guest Information'));
    } else {
      const index = additionalGuests.findIndex((guest) => guest.id === id);

      let addGuests = JSON.parse(JSON.stringify(additionalGuests));
      addGuests = addGuests.map((guest) => {
        if (guest.hasOwnProperty('Application')) {
          delete guest['Application'];
          return guest;
        }
        return guest;
      });

      const originalValue = sourceAdditionalGuests[index]
        ? sourceAdditionalGuests[index][field] || htmlEntities('<empty>')
        : htmlEntities('<empty>');
      const newValue = addGuests[index][field] || htmlEntities('<empty>');
      setSourceAdditionalGuests(addGuests);
      saveGuest(addGuests[index])
        .then((ng) => {
          setSourceAdditionalGuests(
            addGuests.map((data, i) => {
              if (i == index) {
                return ng;
              } else {
                return data;
              }
            })
          );
          setApplication(
            deserializeModel(Application, {
              ...application,
              AdditionalGuests: {
                items: addGuests.map((data, i) => {
                  if (i == index) {
                    return ng;
                  } else {
                    return data;
                  }
                }),
              },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                ' changed ' +
                "<span class='field'>Additional Guest " +
                mapFieldValue(field) +
                '</span>' +
                ' from ' +
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
        .then(() => toast('Saved additional guest information.'));
    }
  };

  const updateAndSaveGuestAgeField = (e, id) => {
    if (typeof id === 'undefined') {
      // Unsupported.
    } else {
      const index = additionalGuests.findIndex((guest) => guest.id === id);
      const newGuest = JSON.parse(
        JSON.stringify(
          Guest.copyOf(deserializeModel(Guest, additionalGuests[index]), (updated) => {
            updated.under_age_three = e.target.checked;
          })
        )
      );
      additionalGuests[index] = newGuest;
      setAdditionalGuests([...additionalGuests]);
      const originalValue =
        sourceAdditionalGuests[index].under_age_three == null
          ? htmlEntities('<no selection>')
          : sourceAdditionalGuests[index].under_age_three
          ? 'Yes'
          : htmlEntities('<no selection>');
      const newValue = e.target.checked ? 'Yes' : htmlEntities('<no selection>');
      setSourceAdditionalGuests(additionalGuests);
      if (newGuest.hasOwnProperty('Application')) {
        delete newGuest['Application'];
      }
      saveGuest(newGuest)
        .then(() => {
          setApplication(
            deserializeModel(Application, {
              ...application,
              AdditionalGuests: {
                items: additionalGuests,
              },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                ' changed <span class="field">Additional Guest Under Age 3</span> from ' +
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
        .then(() => toast('Saved additional guest information.'));
    }
  };

  const updateAndSaveGuestStateField = (e, id) => {
    if (typeof id === 'undefined') {
      const newGuest = Guest.copyOf(primaryGuest, (updated) => {
        updated.state = e.target.value;
      });
      setPrimaryGuest(newGuest);
      const originalValue = sourcePrimaryGuest.state || htmlEntities('<no selection>');
      const newValue = newGuest.state || htmlEntities('<no selection>');
      setSourcePrimaryGuest(newGuest);
      saveGuest(newGuest)
        .then((pg) => {
          setApplication(
            deserializeModel(Application, {
              ...application,
              PrimaryGuest: { items: [pg] },
            })
          );
          if (
            originalValue != newValue &&
            shouldCreateNoteAboutAdminChange(application, isAdministrator())
          ) {
            createNote(
              humanName(profile) +
                ' changed <span class="field">Primary Guest State</span> from ' +
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
        .then(() => toast('Saved Guest Information'));
    } else {
      // Unsupported.
    }
  };

  const addAdditionalGuestDisabled = isApplicationEditable(application)
    ? missingAdditionalGuestFields().length > 0 || missingPrimaryGuestFields().length > 0
    : true;

  const addGuestClasses = classNames('add', {
    disabled: addAdditionalGuestDisabled,
  });

  const minStartDate = isAfterThreePM(new Date()) ? format(addDays(new Date(), 1), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  return (
    <div>
      <h3>Requested Dates</h3>

      <div className="requested stay-dates">
        <Datefield
          label="Check-in"
          onChange={updateCheckInDate}
          selectsStart
          selected={
            initialStay?.requested_check_in
          }
          startDate={
            initialStay?.requested_check_in
          }
          endDate={
            initialStay?.requested_check_out
          }
          minDate={isAdministrator() ? '' : minStartDate}
          maxDate={
            initialStay?.requested_check_out
              ? initialStay?.requested_check_out
              : '9999-12-31'
          }
          inputDisabled={!isApplicationEditable(application)}
          onBlur={checkinDateOnBlur}
          isValid={checkinDateValid.valid}
          errorMessage={checkinDateValid.message}
        />

        <Datefield
          label="Check-out"
          onChange={updateCheckOutDate}
          selectsEnd
          selected={
            initialStay?.requested_check_out
          }
          startDate={
            initialStay?.requested_check_in
          }
          endDate={
            initialStay?.requested_check_out
          }
          minDate={initialStay?.requested_check_in}
          maxDate={'9999-12-31'}
          inputDisabled={!isApplicationEditable(application)}
          onBlur={checkoutDateOnBlur}
          isValid={checkoutDateValid.valid}
          errorMessage={checkoutDateValid.message}
        />
      </div>

      <div className="inner-pane">
        <h4>Preferred Room Type</h4>
        <Selectfield
          label="Select Room Type"
          options={ROOMTYPE}
          inputValue={initialStay?.room_type_requests}
          inputOnChange={saveRoomTypeRequest}
          inputDisabled={!isApplicationEditable(application)}
          placeholder="Select Room Type..."
          isValid={roomTypeValid.valid}
          errorMessage={roomTypeValid.message}
          useReactSelect
          useRegularSelect={false}
          blankValue=""
        />

        {initialStay?.room_type_requests == ROOMTYPE.OTHER && (
          <Textfield
            label="Room Description"
            inputValue={initialStay?.room_description}
            inputOnChange={updateRoomDescription}
            inputOnBlur={saveRoomDescription}
            inputDisabled={!isApplicationEditable(application)}
            isValid={roomDescriptionValid.valid}
            errorMessage={roomDescriptionValid.message}
          />
        )}

        <Checkboxes
          title="Preferred Room Features (Optional)"
          options={ROOMFEATURES}
          selected={initialStay?.room_feature_requests}
          onChange={saveRoomFeatureRequest}
          inputDisabled={!isApplicationEditable(application)}
        />
      </div>

      <div className="inner-pane">
        <Textareafield
          label="Narrative"
          intro="Please explain the circumstances validating the need for lodging. Examples include, the Fisher House is currently full or distance is greater than 50 miles to the hospital."
          inputValue={initialStay?.narrative}
          inputOnChange={updateNarrative}
          inputOnBlur={saveNarrative}
          inputRequired={true}
          inputDisabled={!isApplicationEditable(application)}
          isValid={narrativeValid.valid}
          errorMessage={narrativeValid.message}
        />

        <Textareafield
          label="Special Requests (Optional)"
          intro="Please list any special requests. Examples include, service dog, accessible room, hearing impaired."
          inputValue={initialStay?.special_requests}
          inputOnChange={updateSpecialRequests}
          inputOnBlur={saveSpecialRequests}
          inputDisabled={!isApplicationEditable(application)}
        />
      </div>

      {primaryGuest && (
        <GuestInput
          key={primaryGuest?.id}
          id={primaryGuest?.id}
          guest={primaryGuest}
          saveGuest={(e) => saveGuestField(e)}
          saveStateField={(e) => updateAndSaveGuestStateField(e)}
          title="Primary Guest"
          removable={false}
          updateGuest={updateGuestField}
          inputDisabled={!isApplicationEditable(application)}
          shouldShowErrorMessagesFromSubmitValidation={
            props?.shouldShowErrorMessagesFromSubmitValidation
          }
        />
      )}

      <h4>Additional Guests</h4>

      {additionalGuests &&
        additionalGuests
          .sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          })
          .map((guest) => {
            return (
              <GuestInput
                key={guest.id}
                id={guest.id}
                guest={guest}
                saveGuest={(e) => saveGuestField(e, guest.id)}
                removeCall={removeGuest}
                wrapperClassName="additional-guest"
                removable={true}
                shouldPromptForAge={true}
                saveAgeField={(e) => updateAndSaveGuestAgeField(e, guest.id)}
                updateGuest={(e) => updateGuestField(e, guest.id)}
                inputDisabled={!isApplicationEditable(application)}
                shouldShowErrorMessagesFromSubmitValidation={
                  props?.shouldShowErrorMessagesFromSubmitValidation
                }
              />
            );
          })}

      <button
        className={addGuestClasses}
        onClick={addGuest}
        disabled={addAdditionalGuestDisabled}
        type="button"
      >
        Add Guest
      </button>
    </div>
  );
}

ApplicationFormPage3.defaultProps = {
  application: {},
  updateApplication: () => {},
};
