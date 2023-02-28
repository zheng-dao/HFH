/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from 'react';
import { fetchByPath, validateField } from './utils';
import { Stay } from '../models';
import { getOverrideProps } from '@aws-amplify/ui-react/internal';
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SelectField,
  SwitchField,
  Text,
  TextField,
  useTheme,
} from '@aws-amplify/ui-react';
import { DataStore } from 'aws-amplify';
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
}) {
  const { tokens } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      (currentFieldValue !== undefined || currentFieldValue !== null || currentFieldValue !== '') &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  return (
    <React.Fragment>
      {isEditing && children}
      {!isEditing ? (
        <>
          <Text>{label}</Text>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            color={tokens.colors.brand.primary[80]}
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? 'Save' : 'Add'}
          </Button>
        </Flex>
      )}
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={'7rem'}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: 'pointer',
                  alignItems: 'center',
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor: index === selectedBadgeIndex ? '#B8CEF9' : '',
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {value.toString()}
                <Icon
                  style={{
                    cursor: 'pointer',
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: 'M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z',
                      stroke: 'black',
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
}
export default function StayUpdateForm(props) {
  const {
    id,
    stay,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    type: undefined,
    state: undefined,
    reservation_number: undefined,
    payment_type: undefined,
    payment_points_used: undefined,
    payment_cost_of_reservation: undefined,
    checkout_points_used: undefined,
    checkout_cost_of_reservation: undefined,
    requested_check_in: undefined,
    requested_check_out: undefined,
    status: undefined,
    actual_check_in: undefined,
    actual_check_out: undefined,
    guest_stayed_at_hotel: false,
    reason_guest_did_not_stay: undefined,
    payment_incidental_cost: undefined,
    charge_type: undefined,
    card: undefined,
    note: undefined,
    reconciled: false,
    ready_for_final_reconcile: false,
    comment: undefined,
    comparable_cost: undefined,
    certificate_number: undefined,
    confirmation_number: undefined,
    card_used_for_incidentals: false,
    room_type_requests: undefined,
    room_feature_requests: [],
    room_type_actual: undefined,
    room_feature_actual: [],
    room_description: undefined,
    reason_decline: undefined,
    reason_return: undefined,
    charge_reconcile: false,
    hotel_reconcile: false,
    points_reconcile: false,
    giftcard_reconcile: false,
    batch_no: undefined,
    city: undefined,
    narrative: undefined,
    special_requests: undefined,
  };
  const [type, setType] = React.useState(initialValues.type);
  const [state, setState] = React.useState(initialValues.state);
  const [reservation_number, setReservation_number] = React.useState(
    initialValues.reservation_number
  );
  const [payment_type, setPayment_type] = React.useState(initialValues.payment_type);
  const [payment_points_used, setPayment_points_used] = React.useState(
    initialValues.payment_points_used
  );
  const [payment_cost_of_reservation, setPayment_cost_of_reservation] = React.useState(
    initialValues.payment_cost_of_reservation
  );
  const [checkout_points_used, setCheckout_points_used] = React.useState(
    initialValues.checkout_points_used
  );
  const [checkout_cost_of_reservation, setCheckout_cost_of_reservation] = React.useState(
    initialValues.checkout_cost_of_reservation
  );
  const [requested_check_in, setRequested_check_in] = React.useState(
    initialValues.requested_check_in
  );
  const [requested_check_out, setRequested_check_out] = React.useState(
    initialValues.requested_check_out
  );
  const [status, setStatus] = React.useState(initialValues.status);
  const [actual_check_in, setActual_check_in] = React.useState(initialValues.actual_check_in);
  const [actual_check_out, setActual_check_out] = React.useState(initialValues.actual_check_out);
  const [guest_stayed_at_hotel, setGuest_stayed_at_hotel] = React.useState(
    initialValues.guest_stayed_at_hotel
  );
  const [reason_guest_did_not_stay, setReason_guest_did_not_stay] = React.useState(
    initialValues.reason_guest_did_not_stay
  );
  const [payment_incidental_cost, setPayment_incidental_cost] = React.useState(
    initialValues.payment_incidental_cost
  );
  const [charge_type, setCharge_type] = React.useState(initialValues.charge_type);
  const [card, setCard] = React.useState(initialValues.card);
  const [note, setNote] = React.useState(initialValues.note);
  const [reconciled, setReconciled] = React.useState(initialValues.reconciled);
  const [ready_for_final_reconcile, setReady_for_final_reconcile] = React.useState(
    initialValues.ready_for_final_reconcile
  );
  const [comment, setComment] = React.useState(initialValues.comment);
  const [comparable_cost, setComparable_cost] = React.useState(initialValues.comparable_cost);
  const [certificate_number, setCertificate_number] = React.useState(
    initialValues.certificate_number
  );
  const [confirmation_number, setConfirmation_number] = React.useState(
    initialValues.confirmation_number
  );
  const [card_used_for_incidentals, setCard_used_for_incidentals] = React.useState(
    initialValues.card_used_for_incidentals
  );
  const [room_type_requests, setRoom_type_requests] = React.useState(
    initialValues.room_type_requests
  );
  const [room_feature_requests, setRoom_feature_requests] = React.useState(
    initialValues.room_feature_requests
  );
  const [room_type_actual, setRoom_type_actual] = React.useState(initialValues.room_type_actual);
  const [room_feature_actual, setRoom_feature_actual] = React.useState(
    initialValues.room_feature_actual
  );
  const [room_description, setRoom_description] = React.useState(initialValues.room_description);
  const [reason_decline, setReason_decline] = React.useState(initialValues.reason_decline);
  const [reason_return, setReason_return] = React.useState(initialValues.reason_return);
  const [charge_reconcile, setCharge_reconcile] = React.useState(initialValues.charge_reconcile);
  const [hotel_reconcile, setHotel_reconcile] = React.useState(initialValues.hotel_reconcile);
  const [points_reconcile, setPoints_reconcile] = React.useState(initialValues.points_reconcile);
  const [giftcard_reconcile, setGiftcard_reconcile] = React.useState(
    initialValues.giftcard_reconcile
  );
  const [batch_no, setBatch_no] = React.useState(initialValues.batch_no);
  const [city, setCity] = React.useState(initialValues.city);
  const [narrative, setNarrative] = React.useState(initialValues.narrative);
  const [special_requests, setSpecial_requests] = React.useState(initialValues.special_requests);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = { ...initialValues, ...stayRecord };
    setType(cleanValues.type);
    setState(cleanValues.state);
    setReservation_number(cleanValues.reservation_number);
    setPayment_type(cleanValues.payment_type);
    setPayment_points_used(cleanValues.payment_points_used);
    setPayment_cost_of_reservation(cleanValues.payment_cost_of_reservation);
    setCheckout_points_used(cleanValues.checkout_points_used);
    setCheckout_cost_of_reservation(cleanValues.checkout_cost_of_reservation);
    setRequested_check_in(cleanValues.requested_check_in);
    setRequested_check_out(cleanValues.requested_check_out);
    setStatus(cleanValues.status);
    setActual_check_in(cleanValues.actual_check_in);
    setActual_check_out(cleanValues.actual_check_out);
    setGuest_stayed_at_hotel(cleanValues.guest_stayed_at_hotel);
    setReason_guest_did_not_stay(cleanValues.reason_guest_did_not_stay);
    setPayment_incidental_cost(cleanValues.payment_incidental_cost);
    setCharge_type(cleanValues.charge_type);
    setCard(cleanValues.card);
    setNote(cleanValues.note);
    setReconciled(cleanValues.reconciled);
    setReady_for_final_reconcile(cleanValues.ready_for_final_reconcile);
    setComment(cleanValues.comment);
    setComparable_cost(cleanValues.comparable_cost);
    setCertificate_number(cleanValues.certificate_number);
    setConfirmation_number(cleanValues.confirmation_number);
    setCard_used_for_incidentals(cleanValues.card_used_for_incidentals);
    setRoom_type_requests(cleanValues.room_type_requests);
    setRoom_feature_requests(cleanValues.room_feature_requests ?? []);
    setCurrentRoom_feature_requestsValue(undefined);
    setRoom_type_actual(cleanValues.room_type_actual);
    setRoom_feature_actual(cleanValues.room_feature_actual ?? []);
    setCurrentRoom_feature_actualValue(undefined);
    setRoom_description(cleanValues.room_description);
    setReason_decline(cleanValues.reason_decline);
    setReason_return(cleanValues.reason_return);
    setCharge_reconcile(cleanValues.charge_reconcile);
    setHotel_reconcile(cleanValues.hotel_reconcile);
    setPoints_reconcile(cleanValues.points_reconcile);
    setGiftcard_reconcile(cleanValues.giftcard_reconcile);
    setBatch_no(cleanValues.batch_no);
    setCity(cleanValues.city);
    setNarrative(cleanValues.narrative);
    setSpecial_requests(cleanValues.special_requests);
    setErrors({});
  };
  const [stayRecord, setStayRecord] = React.useState(stay);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(Stay, id) : stay;
      setStayRecord(record);
    };
    queryData();
  }, [id, stay]);
  React.useEffect(resetStateValues, [stayRecord]);
  const [currentRoom_feature_requestsValue, setCurrentRoom_feature_requestsValue] =
    React.useState(undefined);
  const room_feature_requestsRef = React.createRef();
  const [currentRoom_feature_actualValue, setCurrentRoom_feature_actualValue] =
    React.useState(undefined);
  const room_feature_actualRef = React.createRef();
  const validations = {
    type: [],
    state: [],
    reservation_number: [],
    payment_type: [],
    payment_points_used: [],
    payment_cost_of_reservation: [],
    checkout_points_used: [],
    checkout_cost_of_reservation: [],
    requested_check_in: [],
    requested_check_out: [],
    status: [],
    actual_check_in: [],
    actual_check_out: [],
    guest_stayed_at_hotel: [],
    reason_guest_did_not_stay: [],
    payment_incidental_cost: [],
    charge_type: [],
    card: [],
    note: [],
    reconciled: [],
    ready_for_final_reconcile: [],
    comment: [],
    comparable_cost: [],
    certificate_number: [],
    confirmation_number: [],
    card_used_for_incidentals: [],
    room_type_requests: [],
    room_feature_requests: [],
    room_type_actual: [],
    room_feature_actual: [],
    room_description: [],
    reason_decline: [],
    reason_return: [],
    charge_reconcile: [],
    hotel_reconcile: [],
    points_reconcile: [],
    giftcard_reconcile: [],
    batch_no: [],
    city: [],
    narrative: [],
    special_requests: [],
  };
  const runValidationTasks = async (fieldName, value) => {
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          type,
          state,
          reservation_number,
          payment_type,
          payment_points_used,
          payment_cost_of_reservation,
          checkout_points_used,
          checkout_cost_of_reservation,
          requested_check_in,
          requested_check_out,
          status,
          actual_check_in,
          actual_check_out,
          guest_stayed_at_hotel,
          reason_guest_did_not_stay,
          payment_incidental_cost,
          charge_type,
          card,
          note,
          reconciled,
          ready_for_final_reconcile,
          comment,
          comparable_cost,
          certificate_number,
          confirmation_number,
          card_used_for_incidentals,
          room_type_requests,
          room_feature_requests,
          room_type_actual,
          room_feature_actual,
          room_description,
          reason_decline,
          reason_return,
          charge_reconcile,
          hotel_reconcile,
          points_reconcile,
          giftcard_reconcile,
          batch_no,
          city,
          narrative,
          special_requests,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) => runValidationTasks(fieldName, item))
              );
              return promises;
            }
            promises.push(runValidationTasks(fieldName, modelFields[fieldName]));
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          await DataStore.save(
            Stay.copyOf(stayRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, 'StayUpdateForm')}
    >
      <SelectField
        label="Type"
        placeholder="Please select an option"
        isDisabled={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type: value,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks('type', value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks('type', type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, 'type')}
      >
        <option
          children="Initial"
          value="INITIAL"
          {...getOverrideProps(overrides, 'typeoption0')}
        ></option>
        <option
          children="Extended"
          value="EXTENDED"
          {...getOverrideProps(overrides, 'typeoption1')}
        ></option>
      </SelectField>
      <TextField
        label="State"
        isRequired={false}
        isReadOnly={false}
        defaultValue={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state: value,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks('state', value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks('state', state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, 'state')}
      ></TextField>
      <TextField
        label="Reservation number"
        isRequired={false}
        isReadOnly={false}
        defaultValue={reservation_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number: value,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.reservation_number ?? value;
          }
          if (errors.reservation_number?.hasError) {
            runValidationTasks('reservation_number', value);
          }
          setReservation_number(value);
        }}
        onBlur={() => runValidationTasks('reservation_number', reservation_number)}
        errorMessage={errors.reservation_number?.errorMessage}
        hasError={errors.reservation_number?.hasError}
        {...getOverrideProps(overrides, 'reservation_number')}
      ></TextField>
      <TextField
        label="Payment type"
        isRequired={false}
        isReadOnly={false}
        defaultValue={payment_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type: value,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.payment_type ?? value;
          }
          if (errors.payment_type?.hasError) {
            runValidationTasks('payment_type', value);
          }
          setPayment_type(value);
        }}
        onBlur={() => runValidationTasks('payment_type', payment_type)}
        errorMessage={errors.payment_type?.errorMessage}
        hasError={errors.payment_type?.hasError}
        {...getOverrideProps(overrides, 'payment_type')}
      ></TextField>
      <TextField
        label="Payment points used"
        isRequired={false}
        isReadOnly={false}
        defaultValue={payment_points_used}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used: value,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.payment_points_used ?? value;
          }
          if (errors.payment_points_used?.hasError) {
            runValidationTasks('payment_points_used', value);
          }
          setPayment_points_used(value);
        }}
        onBlur={() => runValidationTasks('payment_points_used', payment_points_used)}
        errorMessage={errors.payment_points_used?.errorMessage}
        hasError={errors.payment_points_used?.hasError}
        {...getOverrideProps(overrides, 'payment_points_used')}
      ></TextField>
      <TextField
        label="Payment cost of reservation"
        isRequired={false}
        isReadOnly={false}
        defaultValue={payment_cost_of_reservation}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation: value,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.payment_cost_of_reservation ?? value;
          }
          if (errors.payment_cost_of_reservation?.hasError) {
            runValidationTasks('payment_cost_of_reservation', value);
          }
          setPayment_cost_of_reservation(value);
        }}
        onBlur={() =>
          runValidationTasks('payment_cost_of_reservation', payment_cost_of_reservation)
        }
        errorMessage={errors.payment_cost_of_reservation?.errorMessage}
        hasError={errors.payment_cost_of_reservation?.hasError}
        {...getOverrideProps(overrides, 'payment_cost_of_reservation')}
      ></TextField>
      <TextField
        label="Checkout points used"
        isRequired={false}
        isReadOnly={false}
        defaultValue={checkout_points_used}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used: value,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.checkout_points_used ?? value;
          }
          if (errors.checkout_points_used?.hasError) {
            runValidationTasks('checkout_points_used', value);
          }
          setCheckout_points_used(value);
        }}
        onBlur={() => runValidationTasks('checkout_points_used', checkout_points_used)}
        errorMessage={errors.checkout_points_used?.errorMessage}
        hasError={errors.checkout_points_used?.hasError}
        {...getOverrideProps(overrides, 'checkout_points_used')}
      ></TextField>
      <TextField
        label="Checkout cost of reservation"
        isRequired={false}
        isReadOnly={false}
        defaultValue={checkout_cost_of_reservation}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation: value,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.checkout_cost_of_reservation ?? value;
          }
          if (errors.checkout_cost_of_reservation?.hasError) {
            runValidationTasks('checkout_cost_of_reservation', value);
          }
          setCheckout_cost_of_reservation(value);
        }}
        onBlur={() =>
          runValidationTasks('checkout_cost_of_reservation', checkout_cost_of_reservation)
        }
        errorMessage={errors.checkout_cost_of_reservation?.errorMessage}
        hasError={errors.checkout_cost_of_reservation?.hasError}
        {...getOverrideProps(overrides, 'checkout_cost_of_reservation')}
      ></TextField>
      <TextField
        label="Requested check in"
        isRequired={false}
        isReadOnly={false}
        type="date"
        defaultValue={requested_check_in}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in: value,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.requested_check_in ?? value;
          }
          if (errors.requested_check_in?.hasError) {
            runValidationTasks('requested_check_in', value);
          }
          setRequested_check_in(value);
        }}
        onBlur={() => runValidationTasks('requested_check_in', requested_check_in)}
        errorMessage={errors.requested_check_in?.errorMessage}
        hasError={errors.requested_check_in?.hasError}
        {...getOverrideProps(overrides, 'requested_check_in')}
      ></TextField>
      <TextField
        label="Requested check out"
        isRequired={false}
        isReadOnly={false}
        type="date"
        defaultValue={requested_check_out}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out: value,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.requested_check_out ?? value;
          }
          if (errors.requested_check_out?.hasError) {
            runValidationTasks('requested_check_out', value);
          }
          setRequested_check_out(value);
        }}
        onBlur={() => runValidationTasks('requested_check_out', requested_check_out)}
        errorMessage={errors.requested_check_out?.errorMessage}
        hasError={errors.requested_check_out?.hasError}
        {...getOverrideProps(overrides, 'requested_check_out')}
      ></TextField>
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status: value,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks('status', value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks('status', status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, 'status')}
      >
        <option
          children="Draft"
          value="DRAFT"
          {...getOverrideProps(overrides, 'statusoption0')}
        ></option>
        <option
          children="Returned"
          value="RETURNED"
          {...getOverrideProps(overrides, 'statusoption1')}
        ></option>
        <option
          children="Requested"
          value="REQUESTED"
          {...getOverrideProps(overrides, 'statusoption2')}
        ></option>
        <option
          children="Exception"
          value="EXCEPTION"
          {...getOverrideProps(overrides, 'statusoption3')}
        ></option>
        <option
          children="Approved"
          value="APPROVED"
          {...getOverrideProps(overrides, 'statusoption4')}
        ></option>
        <option
          children="Declined"
          value="DECLINED"
          {...getOverrideProps(overrides, 'statusoption5')}
        ></option>
        <option
          children="Completed"
          value="COMPLETED"
          {...getOverrideProps(overrides, 'statusoption6')}
        ></option>
      </SelectField>
      <TextField
        label="Actual check in"
        isRequired={false}
        isReadOnly={false}
        type="date"
        defaultValue={actual_check_in}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in: value,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.actual_check_in ?? value;
          }
          if (errors.actual_check_in?.hasError) {
            runValidationTasks('actual_check_in', value);
          }
          setActual_check_in(value);
        }}
        onBlur={() => runValidationTasks('actual_check_in', actual_check_in)}
        errorMessage={errors.actual_check_in?.errorMessage}
        hasError={errors.actual_check_in?.hasError}
        {...getOverrideProps(overrides, 'actual_check_in')}
      ></TextField>
      <TextField
        label="Actual check out"
        isRequired={false}
        isReadOnly={false}
        type="date"
        defaultValue={actual_check_out}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out: value,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.actual_check_out ?? value;
          }
          if (errors.actual_check_out?.hasError) {
            runValidationTasks('actual_check_out', value);
          }
          setActual_check_out(value);
        }}
        onBlur={() => runValidationTasks('actual_check_out', actual_check_out)}
        errorMessage={errors.actual_check_out?.errorMessage}
        hasError={errors.actual_check_out?.hasError}
        {...getOverrideProps(overrides, 'actual_check_out')}
      ></TextField>
      <SwitchField
        label="Guest stayed at hotel"
        defaultChecked={false}
        isDisabled={false}
        isChecked={guest_stayed_at_hotel}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel: value,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.guest_stayed_at_hotel ?? value;
          }
          if (errors.guest_stayed_at_hotel?.hasError) {
            runValidationTasks('guest_stayed_at_hotel', value);
          }
          setGuest_stayed_at_hotel(value);
        }}
        onBlur={() => runValidationTasks('guest_stayed_at_hotel', guest_stayed_at_hotel)}
        errorMessage={errors.guest_stayed_at_hotel?.errorMessage}
        hasError={errors.guest_stayed_at_hotel?.hasError}
        {...getOverrideProps(overrides, 'guest_stayed_at_hotel')}
      ></SwitchField>
      <TextField
        label="Reason guest did not stay"
        isRequired={false}
        isReadOnly={false}
        defaultValue={reason_guest_did_not_stay}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay: value,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.reason_guest_did_not_stay ?? value;
          }
          if (errors.reason_guest_did_not_stay?.hasError) {
            runValidationTasks('reason_guest_did_not_stay', value);
          }
          setReason_guest_did_not_stay(value);
        }}
        onBlur={() => runValidationTasks('reason_guest_did_not_stay', reason_guest_did_not_stay)}
        errorMessage={errors.reason_guest_did_not_stay?.errorMessage}
        hasError={errors.reason_guest_did_not_stay?.hasError}
        {...getOverrideProps(overrides, 'reason_guest_did_not_stay')}
      ></TextField>
      <TextField
        label="Payment incidental cost"
        isRequired={false}
        isReadOnly={false}
        defaultValue={payment_incidental_cost}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost: value,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.payment_incidental_cost ?? value;
          }
          if (errors.payment_incidental_cost?.hasError) {
            runValidationTasks('payment_incidental_cost', value);
          }
          setPayment_incidental_cost(value);
        }}
        onBlur={() => runValidationTasks('payment_incidental_cost', payment_incidental_cost)}
        errorMessage={errors.payment_incidental_cost?.errorMessage}
        hasError={errors.payment_incidental_cost?.hasError}
        {...getOverrideProps(overrides, 'payment_incidental_cost')}
      ></TextField>
      <TextField
        label="Charge type"
        isRequired={false}
        isReadOnly={false}
        defaultValue={charge_type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type: value,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.charge_type ?? value;
          }
          if (errors.charge_type?.hasError) {
            runValidationTasks('charge_type', value);
          }
          setCharge_type(value);
        }}
        onBlur={() => runValidationTasks('charge_type', charge_type)}
        errorMessage={errors.charge_type?.errorMessage}
        hasError={errors.charge_type?.hasError}
        {...getOverrideProps(overrides, 'charge_type')}
      ></TextField>
      <TextField
        label="Card"
        isRequired={false}
        isReadOnly={false}
        defaultValue={card}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card: value,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.card ?? value;
          }
          if (errors.card?.hasError) {
            runValidationTasks('card', value);
          }
          setCard(value);
        }}
        onBlur={() => runValidationTasks('card', card)}
        errorMessage={errors.card?.errorMessage}
        hasError={errors.card?.hasError}
        {...getOverrideProps(overrides, 'card')}
      ></TextField>
      <TextField
        label="Note"
        isRequired={false}
        isReadOnly={false}
        defaultValue={note}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note: value,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.note ?? value;
          }
          if (errors.note?.hasError) {
            runValidationTasks('note', value);
          }
          setNote(value);
        }}
        onBlur={() => runValidationTasks('note', note)}
        errorMessage={errors.note?.errorMessage}
        hasError={errors.note?.hasError}
        {...getOverrideProps(overrides, 'note')}
      ></TextField>
      <SwitchField
        label="Reconciled"
        defaultChecked={false}
        isDisabled={false}
        isChecked={reconciled}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled: value,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.reconciled ?? value;
          }
          if (errors.reconciled?.hasError) {
            runValidationTasks('reconciled', value);
          }
          setReconciled(value);
        }}
        onBlur={() => runValidationTasks('reconciled', reconciled)}
        errorMessage={errors.reconciled?.errorMessage}
        hasError={errors.reconciled?.hasError}
        {...getOverrideProps(overrides, 'reconciled')}
      ></SwitchField>
      <SwitchField
        label="Ready for final reconcile"
        defaultChecked={false}
        isDisabled={false}
        isChecked={ready_for_final_reconcile}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile: value,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.ready_for_final_reconcile ?? value;
          }
          if (errors.ready_for_final_reconcile?.hasError) {
            runValidationTasks('ready_for_final_reconcile', value);
          }
          setReady_for_final_reconcile(value);
        }}
        onBlur={() => runValidationTasks('ready_for_final_reconcile', ready_for_final_reconcile)}
        errorMessage={errors.ready_for_final_reconcile?.errorMessage}
        hasError={errors.ready_for_final_reconcile?.hasError}
        {...getOverrideProps(overrides, 'ready_for_final_reconcile')}
      ></SwitchField>
      <TextField
        label="Comment"
        isRequired={false}
        isReadOnly={false}
        defaultValue={comment}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment: value,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.comment ?? value;
          }
          if (errors.comment?.hasError) {
            runValidationTasks('comment', value);
          }
          setComment(value);
        }}
        onBlur={() => runValidationTasks('comment', comment)}
        errorMessage={errors.comment?.errorMessage}
        hasError={errors.comment?.hasError}
        {...getOverrideProps(overrides, 'comment')}
      ></TextField>
      <TextField
        label="Comparable cost"
        isRequired={false}
        isReadOnly={false}
        defaultValue={comparable_cost}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost: value,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.comparable_cost ?? value;
          }
          if (errors.comparable_cost?.hasError) {
            runValidationTasks('comparable_cost', value);
          }
          setComparable_cost(value);
        }}
        onBlur={() => runValidationTasks('comparable_cost', comparable_cost)}
        errorMessage={errors.comparable_cost?.errorMessage}
        hasError={errors.comparable_cost?.hasError}
        {...getOverrideProps(overrides, 'comparable_cost')}
      ></TextField>
      <TextField
        label="Certificate number"
        isRequired={false}
        isReadOnly={false}
        defaultValue={certificate_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number: value,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.certificate_number ?? value;
          }
          if (errors.certificate_number?.hasError) {
            runValidationTasks('certificate_number', value);
          }
          setCertificate_number(value);
        }}
        onBlur={() => runValidationTasks('certificate_number', certificate_number)}
        errorMessage={errors.certificate_number?.errorMessage}
        hasError={errors.certificate_number?.hasError}
        {...getOverrideProps(overrides, 'certificate_number')}
      ></TextField>
      <TextField
        label="Confirmation number"
        isRequired={false}
        isReadOnly={false}
        defaultValue={confirmation_number}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number: value,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.confirmation_number ?? value;
          }
          if (errors.confirmation_number?.hasError) {
            runValidationTasks('confirmation_number', value);
          }
          setConfirmation_number(value);
        }}
        onBlur={() => runValidationTasks('confirmation_number', confirmation_number)}
        errorMessage={errors.confirmation_number?.errorMessage}
        hasError={errors.confirmation_number?.hasError}
        {...getOverrideProps(overrides, 'confirmation_number')}
      ></TextField>
      <SwitchField
        label="Card used for incidentals"
        defaultChecked={false}
        isDisabled={false}
        isChecked={card_used_for_incidentals}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals: value,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.card_used_for_incidentals ?? value;
          }
          if (errors.card_used_for_incidentals?.hasError) {
            runValidationTasks('card_used_for_incidentals', value);
          }
          setCard_used_for_incidentals(value);
        }}
        onBlur={() => runValidationTasks('card_used_for_incidentals', card_used_for_incidentals)}
        errorMessage={errors.card_used_for_incidentals?.errorMessage}
        hasError={errors.card_used_for_incidentals?.hasError}
        {...getOverrideProps(overrides, 'card_used_for_incidentals')}
      ></SwitchField>
      <SelectField
        label="Room type requests"
        placeholder="Please select an option"
        isDisabled={false}
        value={room_type_requests}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests: value,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.room_type_requests ?? value;
          }
          if (errors.room_type_requests?.hasError) {
            runValidationTasks('room_type_requests', value);
          }
          setRoom_type_requests(value);
        }}
        onBlur={() => runValidationTasks('room_type_requests', room_type_requests)}
        errorMessage={errors.room_type_requests?.errorMessage}
        hasError={errors.room_type_requests?.hasError}
        {...getOverrideProps(overrides, 'room_type_requests')}
      >
        <option
          children="King1"
          value="KING1"
          {...getOverrideProps(overrides, 'room_type_requestsoption0')}
        ></option>
        <option
          children="Queen2"
          value="QUEEN2"
          {...getOverrideProps(overrides, 'room_type_requestsoption1')}
        ></option>
        <option
          children="Double2"
          value="DOUBLE2"
          {...getOverrideProps(overrides, 'room_type_requestsoption2')}
        ></option>
        <option
          children="Other"
          value="OTHER"
          {...getOverrideProps(overrides, 'room_type_requestsoption3')}
        ></option>
      </SelectField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests: values,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            values = result?.room_feature_requests ?? values;
          }
          setRoom_feature_requests(values);
          setCurrentRoom_feature_requestsValue(undefined);
        }}
        currentFieldValue={currentRoom_feature_requestsValue}
        label={'Room feature requests'}
        items={room_feature_requests}
        hasError={errors.room_feature_requests?.hasError}
        setFieldValue={setCurrentRoom_feature_requestsValue}
        inputFieldRef={room_feature_requestsRef}
        defaultFieldValue={undefined}
      >
        <SelectField
          label="Room feature requests"
          placeholder="Please select an option"
          isDisabled={false}
          value={currentRoom_feature_requestsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.room_feature_requests?.hasError) {
              runValidationTasks('room_feature_requests', value);
            }
            setCurrentRoom_feature_requestsValue(value);
          }}
          onBlur={() =>
            runValidationTasks('room_feature_requests', currentRoom_feature_requestsValue)
          }
          errorMessage={errors.room_feature_requests?.errorMessage}
          hasError={errors.room_feature_requests?.hasError}
          ref={room_feature_requestsRef}
          {...getOverrideProps(overrides, 'room_feature_requests')}
        >
          <option
            children="Hearingaccessible"
            value="HEARINGACCESSIBLE"
            {...getOverrideProps(overrides, 'room_feature_requestsoption0')}
          ></option>
          <option
            children="Rollinshower"
            value="ROLLINSHOWER"
            {...getOverrideProps(overrides, 'room_feature_requestsoption1')}
          ></option>
          <option
            children="Nearanelevator"
            value="NEARANELEVATOR"
            {...getOverrideProps(overrides, 'room_feature_requestsoption2')}
          ></option>
          <option
            children="Mobilityaccessible"
            value="MOBILITYACCESSIBLE"
            {...getOverrideProps(overrides, 'room_feature_requestsoption3')}
          ></option>
          <option
            children="Lowerfloor"
            value="LOWERFLOOR"
            {...getOverrideProps(overrides, 'room_feature_requestsoption4')}
          ></option>
        </SelectField>
      </ArrayField>
      <SelectField
        label="Room type actual"
        placeholder="Please select an option"
        isDisabled={false}
        value={room_type_actual}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual: value,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.room_type_actual ?? value;
          }
          if (errors.room_type_actual?.hasError) {
            runValidationTasks('room_type_actual', value);
          }
          setRoom_type_actual(value);
        }}
        onBlur={() => runValidationTasks('room_type_actual', room_type_actual)}
        errorMessage={errors.room_type_actual?.errorMessage}
        hasError={errors.room_type_actual?.hasError}
        {...getOverrideProps(overrides, 'room_type_actual')}
      >
        <option
          children="King1"
          value="KING1"
          {...getOverrideProps(overrides, 'room_type_actualoption0')}
        ></option>
        <option
          children="Queen2"
          value="QUEEN2"
          {...getOverrideProps(overrides, 'room_type_actualoption1')}
        ></option>
        <option
          children="Double2"
          value="DOUBLE2"
          {...getOverrideProps(overrides, 'room_type_actualoption2')}
        ></option>
        <option
          children="Other"
          value="OTHER"
          {...getOverrideProps(overrides, 'room_type_actualoption3')}
        ></option>
      </SelectField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual: values,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            values = result?.room_feature_actual ?? values;
          }
          setRoom_feature_actual(values);
          setCurrentRoom_feature_actualValue(undefined);
        }}
        currentFieldValue={currentRoom_feature_actualValue}
        label={'Room feature actual'}
        items={room_feature_actual}
        hasError={errors.room_feature_actual?.hasError}
        setFieldValue={setCurrentRoom_feature_actualValue}
        inputFieldRef={room_feature_actualRef}
        defaultFieldValue={undefined}
      >
        <SelectField
          label="Room feature actual"
          placeholder="Please select an option"
          isDisabled={false}
          value={currentRoom_feature_actualValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.room_feature_actual?.hasError) {
              runValidationTasks('room_feature_actual', value);
            }
            setCurrentRoom_feature_actualValue(value);
          }}
          onBlur={() => runValidationTasks('room_feature_actual', currentRoom_feature_actualValue)}
          errorMessage={errors.room_feature_actual?.errorMessage}
          hasError={errors.room_feature_actual?.hasError}
          ref={room_feature_actualRef}
          {...getOverrideProps(overrides, 'room_feature_actual')}
        >
          <option
            children="Hearingaccessible"
            value="HEARINGACCESSIBLE"
            {...getOverrideProps(overrides, 'room_feature_actualoption0')}
          ></option>
          <option
            children="Rollinshower"
            value="ROLLINSHOWER"
            {...getOverrideProps(overrides, 'room_feature_actualoption1')}
          ></option>
          <option
            children="Nearanelevator"
            value="NEARANELEVATOR"
            {...getOverrideProps(overrides, 'room_feature_actualoption2')}
          ></option>
          <option
            children="Mobilityaccessible"
            value="MOBILITYACCESSIBLE"
            {...getOverrideProps(overrides, 'room_feature_actualoption3')}
          ></option>
          <option
            children="Lowerfloor"
            value="LOWERFLOOR"
            {...getOverrideProps(overrides, 'room_feature_actualoption4')}
          ></option>
        </SelectField>
      </ArrayField>
      <TextField
        label="Room description"
        isRequired={false}
        isReadOnly={false}
        defaultValue={room_description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description: value,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.room_description ?? value;
          }
          if (errors.room_description?.hasError) {
            runValidationTasks('room_description', value);
          }
          setRoom_description(value);
        }}
        onBlur={() => runValidationTasks('room_description', room_description)}
        errorMessage={errors.room_description?.errorMessage}
        hasError={errors.room_description?.hasError}
        {...getOverrideProps(overrides, 'room_description')}
      ></TextField>
      <TextField
        label="Reason decline"
        isRequired={false}
        isReadOnly={false}
        defaultValue={reason_decline}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline: value,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.reason_decline ?? value;
          }
          if (errors.reason_decline?.hasError) {
            runValidationTasks('reason_decline', value);
          }
          setReason_decline(value);
        }}
        onBlur={() => runValidationTasks('reason_decline', reason_decline)}
        errorMessage={errors.reason_decline?.errorMessage}
        hasError={errors.reason_decline?.hasError}
        {...getOverrideProps(overrides, 'reason_decline')}
      ></TextField>
      <TextField
        label="Reason return"
        isRequired={false}
        isReadOnly={false}
        defaultValue={reason_return}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return: value,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.reason_return ?? value;
          }
          if (errors.reason_return?.hasError) {
            runValidationTasks('reason_return', value);
          }
          setReason_return(value);
        }}
        onBlur={() => runValidationTasks('reason_return', reason_return)}
        errorMessage={errors.reason_return?.errorMessage}
        hasError={errors.reason_return?.hasError}
        {...getOverrideProps(overrides, 'reason_return')}
      ></TextField>
      <SwitchField
        label="Charge reconcile"
        defaultChecked={false}
        isDisabled={false}
        isChecked={charge_reconcile}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile: value,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.charge_reconcile ?? value;
          }
          if (errors.charge_reconcile?.hasError) {
            runValidationTasks('charge_reconcile', value);
          }
          setCharge_reconcile(value);
        }}
        onBlur={() => runValidationTasks('charge_reconcile', charge_reconcile)}
        errorMessage={errors.charge_reconcile?.errorMessage}
        hasError={errors.charge_reconcile?.hasError}
        {...getOverrideProps(overrides, 'charge_reconcile')}
      ></SwitchField>
      <SwitchField
        label="Hotel reconcile"
        defaultChecked={false}
        isDisabled={false}
        isChecked={hotel_reconcile}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile: value,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.hotel_reconcile ?? value;
          }
          if (errors.hotel_reconcile?.hasError) {
            runValidationTasks('hotel_reconcile', value);
          }
          setHotel_reconcile(value);
        }}
        onBlur={() => runValidationTasks('hotel_reconcile', hotel_reconcile)}
        errorMessage={errors.hotel_reconcile?.errorMessage}
        hasError={errors.hotel_reconcile?.hasError}
        {...getOverrideProps(overrides, 'hotel_reconcile')}
      ></SwitchField>
      <SwitchField
        label="Points reconcile"
        defaultChecked={false}
        isDisabled={false}
        isChecked={points_reconcile}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile: value,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.points_reconcile ?? value;
          }
          if (errors.points_reconcile?.hasError) {
            runValidationTasks('points_reconcile', value);
          }
          setPoints_reconcile(value);
        }}
        onBlur={() => runValidationTasks('points_reconcile', points_reconcile)}
        errorMessage={errors.points_reconcile?.errorMessage}
        hasError={errors.points_reconcile?.hasError}
        {...getOverrideProps(overrides, 'points_reconcile')}
      ></SwitchField>
      <SwitchField
        label="Giftcard reconcile"
        defaultChecked={false}
        isDisabled={false}
        isChecked={giftcard_reconcile}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile: value,
              batch_no,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.giftcard_reconcile ?? value;
          }
          if (errors.giftcard_reconcile?.hasError) {
            runValidationTasks('giftcard_reconcile', value);
          }
          setGiftcard_reconcile(value);
        }}
        onBlur={() => runValidationTasks('giftcard_reconcile', giftcard_reconcile)}
        errorMessage={errors.giftcard_reconcile?.errorMessage}
        hasError={errors.giftcard_reconcile?.hasError}
        {...getOverrideProps(overrides, 'giftcard_reconcile')}
      ></SwitchField>
      <TextField
        label="Batch no"
        isRequired={false}
        isReadOnly={false}
        defaultValue={batch_no}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no: value,
              city,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.batch_no ?? value;
          }
          if (errors.batch_no?.hasError) {
            runValidationTasks('batch_no', value);
          }
          setBatch_no(value);
        }}
        onBlur={() => runValidationTasks('batch_no', batch_no)}
        errorMessage={errors.batch_no?.errorMessage}
        hasError={errors.batch_no?.hasError}
        {...getOverrideProps(overrides, 'batch_no')}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        defaultValue={city}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city: value,
              narrative,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks('city', value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks('city', city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, 'city')}
      ></TextField>
      <TextField
        label="Narrative"
        isRequired={false}
        isReadOnly={false}
        defaultValue={narrative}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative: value,
              special_requests,
            };
            const result = onChange(modelFields);
            value = result?.narrative ?? value;
          }
          if (errors.narrative?.hasError) {
            runValidationTasks('narrative', value);
          }
          setNarrative(value);
        }}
        onBlur={() => runValidationTasks('narrative', narrative)}
        errorMessage={errors.narrative?.errorMessage}
        hasError={errors.narrative?.hasError}
        {...getOverrideProps(overrides, 'narrative')}
      ></TextField>
      <TextField
        label="Special requests"
        isRequired={false}
        isReadOnly={false}
        defaultValue={special_requests}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              type,
              state,
              reservation_number,
              payment_type,
              payment_points_used,
              payment_cost_of_reservation,
              checkout_points_used,
              checkout_cost_of_reservation,
              requested_check_in,
              requested_check_out,
              status,
              actual_check_in,
              actual_check_out,
              guest_stayed_at_hotel,
              reason_guest_did_not_stay,
              payment_incidental_cost,
              charge_type,
              card,
              note,
              reconciled,
              ready_for_final_reconcile,
              comment,
              comparable_cost,
              certificate_number,
              confirmation_number,
              card_used_for_incidentals,
              room_type_requests,
              room_feature_requests,
              room_type_actual,
              room_feature_actual,
              room_description,
              reason_decline,
              reason_return,
              charge_reconcile,
              hotel_reconcile,
              points_reconcile,
              giftcard_reconcile,
              batch_no,
              city,
              narrative,
              special_requests: value,
            };
            const result = onChange(modelFields);
            value = result?.special_requests ?? value;
          }
          if (errors.special_requests?.hasError) {
            runValidationTasks('special_requests', value);
          }
          setSpecial_requests(value);
        }}
        onBlur={() => runValidationTasks('special_requests', special_requests)}
        errorMessage={errors.special_requests?.errorMessage}
        hasError={errors.special_requests?.hasError}
        {...getOverrideProps(overrides, 'special_requests')}
      ></TextField>
      <Flex justifyContent="space-between" {...getOverrideProps(overrides, 'CTAFlex')}>
        <Button
          children="Reset"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, 'ResetButton')}
        ></Button>
        <Flex gap="15px" {...getOverrideProps(overrides, 'RightAlignCTASubFlex')}>
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, 'CancelButton')}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, 'SubmitButton')}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
