import { Fragment, useEffect, useState } from 'react';
import Checkboxes from '../Inputs/Checkboxes';
import Checkboxfield from '../Inputs/Checkboxfield';
import Selectfield from '../Inputs/Selectfield';
import Textfield from '../Inputs/Textfield';
import { DataStore } from '@aws-amplify/datastore';
import { PaymentType, Card } from '@src/models';
import { PAYMENTTYPESTATUS, CARDSTATUS, PAYMENTTYPETYPE } from '@src/API';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  listPaymentTypes,
  listPaymentTypesByStatus,
  listCards,
  listCardsByStatus,
  searchPaymentTypes,
  searchCards,
} from '@src/graphql/queries';
import { createConfigurationSetting, updateConfigurationSetting } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import validateRequired from '@utils/validators/required';
import { STAYSTATUS } from '@src/API';

export default function PaymentDetails(props) {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [archivedPaymentTypes, setArchivedPaymentTypes] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardsIncludingArchiving, setCardsIncludingArchiving] = useState([]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(PaymentType, (p) => p.status('eq', PAYMENTTYPESTATUS.ACTIVE), {
        limit: 999999,
      }).then((items) => setPaymentTypes(items));
    } else {
      API.graphql(
        graphqlOperation(searchPaymentTypes, {
          filter: { status: { eq: PAYMENTTYPESTATUS.ACTIVE } },
        })
      ).then((results) => {
        if (results.data.searchPaymentTypes.items.length > 0) {
          setPaymentTypes(
            results.data.searchPaymentTypes.items
              .map((item) => deserializeModel(PaymentType, item))
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .filter((item) => !item['_deleted'])
              .map((item) => ({ value: item.id, label: item.name }))
          );
        }
      });
      API.graphql(
        graphqlOperation(searchPaymentTypes, {
          filter: { status: { eq: PAYMENTTYPESTATUS.ARCHIVED } },
        })
      ).then((results) => {
        if (results.data.searchPaymentTypes.items.length > 0) {
          setArchivedPaymentTypes(
            results.data.searchPaymentTypes.items
              .map((item) => deserializeModel(PaymentType, item))
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .filter((item) => !item['_deleted'])
              .map((item) => ({ value: item.id, label: item.name }))
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(Card, (c) => c.status('eq', CARDSTATUS.ACTIVE), {
        limit: 999999,
      }).then((items) => setCards(items));
    } else {
      API.graphql(
        graphqlOperation(searchCards, { filter: { status: { eq: CARDSTATUS.ACTIVE } } })
      ).then((results) => {
        if (results.data.searchCards.items.length > 0) {
          setCards(
            results.data.searchCards.items
              .map((item) => deserializeModel(Card, item))
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .map((item) => ({ value: item.name, label: item.name }))
          );
        }
      });
      API.graphql(
        graphqlOperation(searchCards, { filter: { status: { eq: CARDSTATUS.ARCHIVED } } })
      ).then((results) => {
        if (results.data.searchCards.items.length > 0) {
          setCardsIncludingArchiving(
            results.data.searchCards.items
              .map((item) => deserializeModel(Card, item))
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .map((item) => ({ value: item.name, label: item.name }))
          );
        }
      });
    }
  }, []);

  const updateAndSavePaymentType = (e) => {
    const specificPaymentType = paymentTypes.find((item) => item.value == e?.value);
    if (props.stay?.status !== STAYSTATUS.COMPLETED) {
      props.setPaymentUsedValid(validateRequired(e?.value));
    }
    props.updateAndSaveStay(props.stay, (u) => {
      (u.PaymentTypeID = e?.value == null ? null : e?.value),
        (u.payment_type = specificPaymentType?.label ? specificPaymentType?.label : null),
        (u.payment_points_used = ''),
        (u.certificate_number = ''),
        (u.comparable_cost = ''),
        (u.card_used_for_incidentals = false),
        (u.card = null),
        (u.charge_reconcile = false),
        (u.points_reconcile = false),
        (u.giftcard_reconcile = false),
        (u.payment_cost_of_reservation = '');
    });
  };

  const updatePointsUsed = (e) => {
    if (e.target.value === '') {
      props.updateStay(props.stay, (u) => {
        u.payment_points_used = e.target.value;
        u.points_reconcile = false;
      });
    } else {
      props.updateStay(props.stay, (u) => {
        u.payment_points_used = e.target.value;
      });
    }
  };

  const savePointsUsed = (e) => {
    props.setPaymentDetailsValid(validateRequired(props.stay.payment_points_used));
    props.saveStay(props.stay);
  };

  const updateComparableCostForPoints = (e) => {
    if (e.target.value === '') {
      props.updateStay(props.stay, (u) => {
        u.comparable_cost = e.target.value;
        u.points_reconcile = false;
      });
    } else {
      props.updateStay(props.stay, (u) => {
        u.comparable_cost = e.target.value;
      });
    }
  };

  const updateGiftCard = (e) => {
    if (e.target.value === '') {
      props.updateStay(props.stay, (u) => {
        u.certificate_number = e.target.value;
        u.giftcard_reconcile = false;
      });
    } else {
      props.updateStay(props.stay, (u) => {
        u.certificate_number = e.target.value;
      });
    }
  };

  const saveGiftCard = (e) => {
    props.setPaymentDetailsValid(validateRequired(props.stay.certificate_number));
    props.saveStay(props.stay);
  };

  const updateComparableCost = (e) => {
    if (e.target.value === '') {
      props.updateStay(props.stay, (u) => {
        u.comparable_cost = e.target.value;
        u.giftcard_reconcile = false;
      });
    } else {
      props.updateStay(props.stay, (u) => {
        u.comparable_cost = e.target.value;
      });
    }
  };

  const saveComparableCost = (e) => {
    props.setComparableCostValid(validateRequired(props.stay.comparable_cost));
    props.saveStay(props.stay);
  };

  const updateAndSaveCreditCardUsedIncidentals = (e) => {
    if (e.target.checked) {
      props.updateAndSaveStay(props.stay, (u) => {
        u.card_used_for_incidentals = e.target.checked;
      });
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.card_used_for_incidentals = e.target.checked;
        u.charge_reconcile = false;
      });
    }
  };

  const updateAndSaveCardUsed = (e) => {
    // const card = cards.find(item => item.name === e?.value);
    props.setCardValid(validateRequired(e?.value));
    if (e?.value === undefined || e?.value === '') {
      props.updateAndSaveStay(props.stay, (u) => {
        u.card = e?.value === undefined ? null : e?.value;
        u.charge_reconcile = false;
      });
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.card = e?.value === undefined ? '' : e?.value;
      });
    }
  };

  const updateTotalCost = (e) => {
    if (e.target.value === '') {
      props.updateStay(props.stay, (u) => {
        u.payment_cost_of_reservation = e.target.value;
        u.charge_reconcile = false;
      });
    } else {
      props.updateStay(props.stay, (u) => {
        u.payment_cost_of_reservation = e.target.value;
      });
    }
  };

  const saveTotalCost = (e) => {
    props.setTotalCostValid(validateRequired(props.stay.payment_cost_of_reservation));
    props.saveStay(props.stay);
  };

  let paymentUsedLabel = '';

  if (
    props.stay?.status == STAYSTATUS.REQUESTED ||
    props.stay?.status == STAYSTATUS.EXCEPTION ||
    props.stay?.status == STAYSTATUS.APPROVED
  ) {
    paymentUsedLabel = 'Payment Used';
  }

  if (props.stay?.guest_stayed_at_hotel) {
    if (
      !(props.stay?.status === STAYSTATUS.REQUESTED || props.stay?.status === STAYSTATUS.EXCEPTION)
    ) {
      paymentUsedLabel = 'Payment Used';
    }
  } else {
    if (
      props.stay?.status === STAYSTATUS.COMPLETED ||
      props.stay?.status === STAYSTATUS.REVIEWED ||
      props.stay?.status == STAYSTATUS.CLOSED
    ) {
      paymentUsedLabel = 'Payment Used (OPTIONAL)';
    }
    if (props.stay?.guest_stayed_at_hotel === false) {
      if (props.stay?.status === STAYSTATUS.APPROVED) {
        paymentUsedLabel = 'Payment Used (OPTIONAL)';
      }
    } else {
      if (props.stay?.status === STAYSTATUS.APPROVED) {
        paymentUsedLabel = 'Payment Used';
      }
    }
  }

  return (
    <Fragment>
      <h4>Payment Details</h4>
      <div className="payment-details detail-block">
        <Selectfield
          label={paymentUsedLabel}
          wrapperClass="payment-used"
          options={
            paymentTypes.find((item) => item.value === props.stay?.PaymentTypeID)
              ? paymentTypes
              : archivedPaymentTypes.find((item) => item.value === props.stay?.PaymentTypeID)
              ? [
                  ...paymentTypes,
                  archivedPaymentTypes.find((item) => item.value === props.stay?.PaymentTypeID),
                ]
              : paymentTypes
          }
          inputValue={props.stay?.PaymentTypeID}
          inputOnChange={updateAndSavePaymentType}
          isValid={props.paymentUsedIsValid}
          errorMessage={props.paymentUsedMessage}
          inputDisabled={props.inputDisabled}
          // inputDisabled={props.inputDisabled || archivedPaymentTypes.findIndex((item) => item.value === props.stay?.PaymentTypeID) !== -1}
          useReactSelect
          useRegularSelect={false}
          blankValue=""
          placeholder="Select Payment Used..."
        />

        {props.stay?.payment_method?.type == PAYMENTTYPETYPE.USERGENERATED && (
          <Fragment>
            <Textfield
              label={props.stay?.payment_method?.name + ' Details'}
              wrapperClass="gift-card"
              inputValue={props.stay?.certificate_number}
              inputOnChange={updateGiftCard}
              inputOnBlur={saveGiftCard}
              isValid={props.paymentDetailsIsValid}
              errorMessage={props.paymentDetailsMessage}
              inputDisabled={props.inputDisabled}
            />
            <Textfield
              label="Comparable Cost"
              wrapperClass="comparable-cost"
              inputClass="cost"
              inputValue={props.stay?.comparable_cost}
              inputOnChange={updateComparableCost}
              inputOnBlur={saveComparableCost}
              isValid={props.comparableCostIsValid}
              errorMessage={props.comparableCostMessage}
              inputDisabled={props.inputDisabled}
            />
          </Fragment>
        )}

        {props.stay?.payment_type == 'Points' && (
          <Fragment>
            <Textfield
              label="Points Used"
              wrapperClass="points-used"
              inputValue={props.stay?.payment_points_used}
              inputOnChange={updatePointsUsed}
              inputOnBlur={savePointsUsed}
              isValid={props.paymentDetailsIsValid}
              errorMessage={props.paymentDetailsMessage}
              inputDisabled={props.inputDisabled}
            />
            <Textfield
              label="Comparable Cost"
              wrapperClass="comparable-cost"
              inputClass="cost"
              inputValue={props.stay?.comparable_cost}
              inputOnChange={updateComparableCostForPoints}
              inputOnBlur={saveComparableCost}
              isValid={props.comparableCostIsValid}
              errorMessage={props.comparableCostMessage}
              inputDisabled={props.inputDisabled}
            />
          </Fragment>
        )}

        {props.stay?.payment_method && props.stay?.payment_method?.name != 'Credit Card' && (
          <Fragment>
            <fieldset className="checkboxes single credit-card-used">
              <Checkboxfield
                label="Fisher House used a credit card for incidental charges."
                inputChecked={props.stay?.card_used_for_incidentals}
                inputOnChange={updateAndSaveCreditCardUsedIncidentals}
                inputDisabled={props.inputDisabled}
              />
            </fieldset>
          </Fragment>
        )}
      </div>

      {(props.stay?.payment_method?.name == 'Credit Card' ||
        props.stay?.card_used_for_incidentals) && (
        <Fragment>
          <h4>Credit Card</h4>
          <div className="credit-card-details detail-block">
            <Selectfield
              label="Card"
              wrapperClass="credit-card"
              options={
                cards.find((item) => item.value === props.stay?.card)
                  ? cards
                  : cardsIncludingArchiving.find((item) => item.value === props.stay?.card)
                  ? [
                      ...cards,
                      cardsIncludingArchiving.find((item) => item.value === props.stay?.card),
                    ]
                  : cards
              }
              inputValue={props.stay?.card}
              inputOnChange={updateAndSaveCardUsed}
              isValid={props.cardIsValid}
              errorMessage={props.cardMessage}
              inputDisabled={props.inputDisabled}
              useReactSelect
              useRegularSelect={false}
              blankValue=""
              placeholder="Select Card..."
            />

            <Textfield
              label="Total Charge"
              wrapperClass="total-charge"
              inputClass="cost"
              inputValue={props.stay?.payment_cost_of_reservation}
              inputOnChange={updateTotalCost}
              inputOnBlur={saveTotalCost}
              isValid={props.totalCostIsValid}
              errorMessage={props.totalCostMessage}
              inputDisabled={props.inputDisabled}
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

PaymentDetails.defaultProps = {
  stay: {},
  updateAndSaveStay: () => {},
  updateStay: () => {},
  saveStay: () => {},
  paymentUsedIsValid: true,
  paymentUsedMessage: '',
  setPaymentUsedValid: () => {},
  cardIsValid: true,
  cardMessage: '',
  setCardValid: () => {},
  totalCostIsValid: true,
  totalCostMessage: '',
  setTotalCostValid: () => {},
  paymentDetailsIsValid: true,
  paymentDetailsMessage: '',
  setPaymentDetailsValid: () => {},
  comparableCostIsValid: true,
  comparableCostMessage: '',
  setComparableCostValid: () => {},
  inputDisabled: false,
};
