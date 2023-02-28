import Datefield from '@components/Inputs/Datefield';
import Checkboxes from '../../Inputs/Checkboxes';
import Selectfield from '../../Inputs/Selectfield';
import Textareafield from '../../Inputs/Textareafield';
import Textfield from '@components/Inputs/Textfield';
import GuestInput from '@components/CommonInputs/GuestInput';
import { ROOMTYPE, ROOMFEATURES, STAYTYPE } from '@src/API';
import { DataStore } from '@aws-amplify/datastore';
import { Stay, Application } from '@src/models';
import { useState, useEffect } from 'react';
import format from 'date-fns/format';
import GroupChangeDialog from '../../GroupChangeDialog';
import useGroupDialog from '@contexts/GroupDialogContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getApplication } from '@src/customQueries/getApplicationWithDependencies';
import { createStay, updateStay } from '@src/graphql/mutations';
import useDialog from '@contexts/DialogContext';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import parseISO from 'date-fns/parseISO';
import useButtonWait from '@contexts/ButtonWaitContext';
import validateEmail from '@utils/validators/email';
import validatePhoneNumber from '@utils/validators/phone';
import validateHotelDate from '@utils/validators/hotelDate';
import isAfterThreePM from '@utils/isAfterThreePM';
import useAuth from '@contexts/AuthContext';
import addDays from 'date-fns/addDays';
import isGroupEditable from '@utils/isGroupEditable';

export default function GroupFormPage3(props) {
  const { isAdministrator } = useAuth();
  const [checkin, setCheckin] = useState('');
  const [checkinOriginal, setCheckinOriginal] = useState('');
  const [checkinCount, setCheckinCount] = useState(-1);
  const [checkout, setCheckout] = useState('');
  const [checkoutOriginal, setCheckoutOriginal] = useState('');
  const [checkoutCount, setCheckoutCount] = useState(-1);
  const [roomType, setRoomType] = useState('');
  const [roomTypeOriginal, setRoomTypeOriginal] = useState('');
  const [roomTypeCount, setRoomTypeCount] = useState(-1);
  const [roomDescription, setRoomDescription] = useState('');
  const [roomDescriptionOriginal, setRoomDescriptionOriginal] = useState('');
  const [roomDescriptionCount, setRoomDescriptionCount] = useState(-1);
  const [roomFeatures, setRoomFeatures] = useState([]);
  const [roomFeaturesOriginal, setRoomFeaturesOriginal] = useState([]);
  const [roomFeaturesCount, setRoomFeaturesCount] = useState(-1);
  const [narrative, setNarrative] = useState('');
  const [narrativeOriginal, setNarrativeOriginal] = useState('');
  const [narrativeCount, setNarrativeCount] = useState(-1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [specialRequestsOriginal, setSpecialRequestsOriginal] = useState('');
  const [specialRequestsCount, setSpecialRequestsCount] = useState(-1);

  const { setMessage } = useDialog();

  const { isWaiting, setIsWaiting } = useButtonWait();

  const { setShouldShowGroupChange, setApplyChangesFunction, setCancelFunction } = useGroupDialog();

  const [checkinDateValid, setCheckinDateValid] = useState(false);
  const [checkoutDateValid, setCheckoutDateValid] = useState(false);

  // Determine if all values are the same and if so, set that accordingly.
  useEffect(() => {
    const reduceAndSetUniqueStayValue = (
      field_name,
      set_function,
      set_original_function,
      set_count_function
    ) => {
      const available = props.applications.map((item) =>
        item?.InitialStay.items[0] ? item?.InitialStay.items[0][field_name] : ''
      );
      let unique = [];
      if (typeof available[0] == 'object' && available[0] != null) {
        unique = Array.from(new Set(available.map(JSON.stringify)), JSON.parse);
        // unique = unique.filter(item => !(Array.isArray(item) && item.length === 0));
        unique = unique.map(item => {
          if (item !== null) {
            return item.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
          } else {
            return item;
          }
        });
        unique = Array.from(new Set(unique.map(JSON.stringify)), JSON.parse)
      } else {
        unique = [...new Set(available)].filter(item => item !== '');
      }
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

    reduceAndSetUniqueStayValue(
      'requested_check_in',
      setCheckin,
      setCheckinOriginal,
      setCheckinCount
    );
    reduceAndSetUniqueStayValue(
      'requested_check_out',
      setCheckout,
      setCheckoutOriginal,
      setCheckoutCount
    );
    reduceAndSetUniqueStayValue(
      'room_type_requests',
      setRoomType,
      setRoomTypeOriginal,
      setRoomTypeCount
    );
    reduceAndSetUniqueStayValue(
      'room_description',
      setRoomDescription,
      setRoomDescriptionOriginal,
      setRoomDescriptionCount
    );
    reduceAndSetUniqueStayValue(
      'room_feature_requests',
      setRoomFeatures,
      setRoomFeaturesOriginal,
      setRoomFeaturesCount
    );
    reduceAndSetUniqueStayValue('narrative', setNarrative, setNarrativeOriginal, setNarrativeCount);
    reduceAndSetUniqueStayValue(
      'special_requests',
      setSpecialRequests,
      setSpecialRequestsOriginal,
      setSpecialRequestsCount
    );
  }, [props.applications]);

  const parseCheckboxInput = (e) => {
    let features = [];
    const currentRoomFeatures = roomFeatures ? roomFeatures : [];
    if (currentRoomFeatures.includes(e.target.value)) {
      features = [...currentRoomFeatures.filter((item) => item != e.target.value)];
    } else {
      features = [...currentRoomFeatures, e.target.value];
    }

    setRoomFeatures(features);
    handleBlur('room_feature_requests', features, roomFeaturesOriginal);
  };

  const handleBlur = (field, value, original_value) => {
    if (value != original_value) {
      if (field == 'email' && !validateEmail(value).valid) {
        return;
      } else if (field == 'telephone' && !validatePhoneNumber(value).valid) {
        return;
      } else if (field === 'requested_check_in') {
        if (value) {
          const isValid = validateHotelDate(value);
          setCheckinDateValid(isValid);
          if (!isValid.valid) return;
        } else {
          if (original_value === null) {
            return;
          }
          value = null;
        }
      } else if (field === 'requested_check_out') {
        if (value) {
          const isValid = validateHotelDate(value);
          setCheckoutDateValid(isValid);
          if (!isValid.valid) return;
        } else {
          if (original_value === null) {
            return;
          }
          value = null;
        }
      } else if (field === 'room_description') {
        if (value) {

        } else {
          if (original_value === null) {
            return;
          }
        }
      }
      switch (field) {
        case 'requested_check_in':
          setCancelFunction(() => () => setCheckin(checkinOriginal));
          break;

        case 'requested_check_out':
          setCancelFunction(() => () => setCheckout(checkoutOriginal));
          break;

        case 'room_type_requests':
          setCancelFunction(() => () => setRoomType(roomTypeOriginal));
          break;

        case 'room_description':
          setCancelFunction(() => () => setRoomDescription(roomDescriptionOriginal));
          break;

        case 'room_feature_requests':
          setCancelFunction(() => () => setRoomFeatures(roomFeaturesOriginal));
          break;

        case 'narrative':
          setCancelFunction(() => () => setNarrative(narrativeOriginal));
          break;

        case 'special_requests':
          setCancelFunction(() => () => setSpecialRequests(specialRequestsOriginal));

        default:
          break;
      }
      setApplyChangesFunction(() => () => {
        let newApplications = [];
        props.applications.forEach((app) => {
          if (shouldUseDatastore()) {
            console.log('Group actions via Datastore are not supported.');
          } else {
            let newInput = {
              id: app.InitialStay.items[0].id,
            };
            newInput[field] = value;
            setIsWaiting(true);
            API.graphql(graphqlOperation(updateStay, { input: newInput }))
              .then(() => {
                API.graphql(graphqlOperation(getApplication, { id: app.id }))
                  .then((newApp) => {
                    newApplications.push(deserializeModel(Application, newApp));
                    switch (field) {
                      case 'requested_check_in':
                        setCheckinOriginal(value);
                        break;

                      case 'requested_check_out':
                        setCheckoutOriginal(value);
                        break;

                      case 'room_type_requests':
                        setRoomTypeOriginal(value);
                        break;

                      case 'room_description':
                        setRoomDescriptionOriginal(value);
                        break;

                      case 'room_feature_requests':
                        setRoomFeatures(value);
                        setRoomFeaturesOriginal(value);
                        break;

                      case 'narrative':
                        setNarrativeOriginal(value);
                        break;

                      case 'special_requests':
                        setSpecialRequestsOriginal(value);

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
                      'There was an error saving the Applicant. Please reload the page and try again.'
                    );
                  });
              })
              .catch((err) => {
                setIsWaiting(false);
                setShouldShowGroupChange(false);
                console.log('Caught error', err);
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

  const minStartDate = isAfterThreePM(new Date()) ? addDays(new Date(), 1) : new Date();

  return (
    <div>
      <h3>Requested Dates</h3>
      <div className="requested stay-dates">
        <Datefield
          label="Check-in"
          labelCount={checkinCount}
          selected={checkin}
          startDate={checkin}
          endDate={checkout}
          minDate={isAdministrator() ? '' : minStartDate}
          maxDate={checkout ? checkout : '9999-12-31'}
          onChange={(e) => {
            setCheckin(e.target.value);
            handleBlur('requested_check_in', e.target.value, checkinOriginal);
          }}
          isValid={checkinDateValid.valid}
          errorMessage={checkinDateValid.message}
          inputDisabled={!isGroupEditable(props.applications)}
        />
        <Datefield
          label="Check-out"
          labelCount={checkoutCount}
          selected={checkout}
          startDate={checkin}
          endDate={checkout}
          minDate={checkin}
          maxDate={'9999-12-31'}
          onChange={(e) => {
            setCheckout(e.target.value);
            handleBlur('requested_check_out', e.target.value, checkoutOriginal);
          }}
          isValid={checkoutDateValid.valid}
          errorMessage={checkoutDateValid.message}
          inputDisabled={!isGroupEditable(props.applications)}
        />
      </div>
      <div className="inner-pane">
        <h4>Preferred Room Type</h4>
        <Selectfield
          label="Select Room Type"
          labelCount={roomTypeCount}
          options={ROOMTYPE}
          inputValue={roomType}
          inputOnChange={(e) => {
            setRoomType(e?.value);
            handleBlur('room_type_requests', e?.value, roomTypeOriginal);
          }}
          placeholder="Select Room Type..."
          useReactSelect
          useRegularSelect={false}
          blankValue=""
          inputDisabled={!isGroupEditable(props.applications)}
        />

        {roomType == ROOMTYPE.OTHER && (
          <Textfield
            label="Room Description"
            labelCount={roomDescriptionCount}
            inputValue={roomDescription}
            inputOnChange={(e) => setRoomDescription(e.target.value)}
            inputOnBlur={(e) =>
              handleBlur('room_description', e.target.value, roomDescriptionOriginal)
            }
            inputDisabled={!isGroupEditable(props.applications)}
          />
        )}

        <Checkboxes
          title="Preferred Room Features"
          titleCount={roomFeaturesCount}
          options={ROOMFEATURES}
          onChange={parseCheckboxInput}
          selected={roomFeatures}
          inputDisabled={!isGroupEditable(props.applications)}
        />
        <p className="ui-caption">
          Please note that some room types and features may not always be available. If there are
          mixed values across all applications, you may need to click the checkbox more than once to
          set the value that you want.
        </p>
      </div>
      <div className="inner-pane">
        <Textareafield
          label="Narrative"
          labelCount={narrativeCount}
          intro="Please explain the circumstances validating the need for lodging. Examples include, the Fisher House is currently full or distance is greater than 50 miles to the hospital."
          inputValue={narrative}
          inputOnChange={(e) => setNarrative(e.target.value)}
          inputOnBlur={() => handleBlur('narrative', narrative, narrativeOriginal)}
          inputDisabled={!isGroupEditable(props.applications)}
        />

        <Textareafield
          label="Special Requests"
          labelCount={specialRequestsCount}
          intro="Please list any special requests. Examples include, service dog, accessible room, hearing impaired."
          inputValue={specialRequests}
          inputOnChange={(e) => setSpecialRequests(e.target.value)}
          inputOnBlur={() =>
            handleBlur('special_requests', specialRequests, specialRequestsOriginal)
          }
          inputDisabled={!isGroupEditable(props.applications)}
        />
      </div>
    </div>
  );
}
