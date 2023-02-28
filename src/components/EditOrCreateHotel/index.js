import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Selectfield from '../Inputs/Selectfield';
import Textfield from '../Inputs/Textfield';
import StateField from '@components/CommonInputs/StateField';
import { State } from '@utils/states';
import ContactInfoBlock from '../CommonInputs/ContactInfoBlock';
import { DataStore } from '@aws-amplify/datastore';
import { HotelProperty, HotelChain, HotelBrand } from '@src/models';
import { HOTELPROPERTYSTATUS, HOTELCHAINSTATUS, HOTELBRANDSTATUS } from '@src/API';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { getHotelProperty, listHotelChains, listHotelBrands } from '@src/graphql/queries';
import { updateHotelProperty, createHotelProperty } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import validateRequired from '@utils/validators/required';
import validatePhoneNumber from '@utils/validators/phone';
import validateEmail from '@utils/validators/email';
import validateNumeric from '@utils/validators/numeric';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function EditOrCreateHotel(props) {
  const [entity, setEntity] = useState({});
  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [hotelPropertyName, setHotelPropertyName] = useState('');
  const [hotelPropertyChain, setHotelPropertyChain] = useState('');
  const [hotelPropertyBrand, setHotelPropertyBrand] = useState('');
  const [hotelPropertyAddr1, setHotelPropertyAddr1] = useState('');
  const [hotelPropertyAddr2, setHotelPropertyAddr2] = useState('');
  const [hotelPropertyCity, setHotelPropertyCity] = useState('');
  const [hotelPropertyState, setHotelPropertyState] = useState('');
  const [hotelPropertyZip, setHotelPropertyZip] = useState('');
  const [hotelPropertyContactName, setHotelPropertyContactName] = useState('');
  const [hotelPropertyContactTitle, setHotelPropertyContactTitle] = useState('');
  const [hotelPropertyContactEmail, setHotelPropertyContactEmail] = useState('');
  const [hotelPropertyContactPhone, setHotelPropertyContactPhone] = useState('');
  const [hotelPropertyContactExt, setHotelPropertyContactExt] = useState('');

  const [hotelPropertyNameValid, setHotelPropertyNameValid] = useState(false);
  const [hotelPropertyChainValid, setHotelPropertyChainValid] = useState(false);
  const [hotelPropertyBrandValid, setHotelPropertyBrandValid] = useState(false);
  const [hotelPropertyAddr1Valid, setHotelPropertyAddr1Valid] = useState(false);
  const [hotelPropertyCityValid, setHotelPropertyCityValid] = useState(false);
  const [hotelPropertyStateValid, setHotelPropertyStateValid] = useState(false);
  const [hotelPropertyZipValid, setHotelPropertyZipValid] = useState(false);
  const [hotelPropertyContactPhoneValid, setHotelPropertyContactPhoneValid] = useState(false);
  const [hotelPropertyContactEmailValid, setHotelPropertyContactEmailValid] = useState(false);
  const [hotelPropertyContactExtValid, setHotelPropertyContactExtValid] = useState(false);
  const [hotelPropertyBlacklistStatus, setHotelPropertyBlacklistStatus] = useState(false);

  const { setIsWaiting } = useButtonWait();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);

  const { setMessage } = useDialog();

  useEffect(() => {
    if (props.hotelID && entity?.id != props.hotelID) {
      if (shouldUseDatastore()) {
        DataStore.query(HotelProperty, props.hotelID).then((item) => {
          setEntity(item);
          setHotelPropertyName(item.name);
          setHotelPropertyChain(item.HotelChainID);
          setHotelPropertyBrand(item.HotelBrandID);
          setHotelPropertyAddr1(item.address);
          setHotelPropertyAddr2(item.address_2);
          setHotelPropertyCity(item.city);
          setHotelPropertyState(item.state);
          setHotelPropertyZip(item.zip);
          setHotelPropertyContactName(item.contact_name);
          setHotelPropertyContactTitle(item.contact_position);
          setHotelPropertyContactEmail(item.email);
          setHotelPropertyContactPhone(item.telephone);
          setHotelPropertyContactExt(item.extension);
        });
      } else {
        setLoadingCounter((prev) => prev + 1);
        API.graphql(graphqlOperation(getHotelProperty, { id: props.hotelID }))
          .then((results) => {
            setEntity(deserializeModel(HotelProperty, results.data.getHotelProperty));
            setHotelPropertyName(results.data.getHotelProperty?.name);
            setHotelPropertyChain(results.data.getHotelProperty?.HotelChainID);
            setHotelPropertyBrand(results.data.getHotelProperty?.HotelBrandID);
            setHotelPropertyAddr1(results.data.getHotelProperty?.address);
            setHotelPropertyAddr2(results.data.getHotelProperty?.address_2);
            setHotelPropertyCity(results.data.getHotelProperty?.city);
            setHotelPropertyState(results.data.getHotelProperty?.state);
            setHotelPropertyZip(results.data.getHotelProperty?.zip);
            setHotelPropertyContactName(results.data.getHotelProperty?.contact_name);
            setHotelPropertyContactTitle(results.data.getHotelProperty?.contact_position);
            setHotelPropertyContactEmail(results.data.getHotelProperty?.email);
            setHotelPropertyContactPhone(results.data.getHotelProperty?.telephone);
            setHotelPropertyContactExt(results.data.getHotelProperty?.extension);
            setLoadingCounter((prev) => prev - 1);
          })
          .catch((err) => {
            console.log('Caught error', err);
            setLoadingCounter((prev) => prev - 1);
            setMessage(
              'There was an error loading the Hotel Property. Please reload the page and try again.'
            );
          });
      }
    }
  }, [props.hotelID, setMessage, entity?.id]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        HotelChain,
        (c) => c.status('ne', HOTELCHAINSTATUS.DRAFT).status('ne', null),
        {
          page: 0,
          limit: 999999,
        }
      ).then((items) => {
        setChains(items);
      });
    } else {
      setLoadingCounter((prev) => prev + 1);
      API.graphql(
        graphqlOperation(listHotelChains, {
          filter: { status: { ne: HOTELCHAINSTATUS.DRAFT } },
          limit: 999,
        })
      )
        .then((results) => {
          setChains(results.data.listHotelChains.items);
          setLoadingCounter((prev) => prev - 1);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setLoadingCounter((prev) => prev - 1);
          setMessage(
            'There was an error loading the Hotel Chains. Please reload the page and try again.'
          );
        });
    }
  }, [setMessage]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(
        HotelBrand,
        (c) => c.status('ne', HOTELBRANDSTATUS.DRAFT).status('ne', null),
        {
          page: 0,
          limit: 999999,
        }
      ).then((items) => {
        setBrands(items);
      });
    } else {
      setLoadingCounter((prev) => prev + 1);
      API.graphql(
        graphqlOperation(listHotelBrands, {
          filter: { status: { ne: HOTELBRANDSTATUS.DRAFT } },
          limit: 999,
        })
      )
        .then((results) => {
          setBrands(results.data.listHotelBrands.items);
          setLoadingCounter((prev) => prev - 1);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setLoadingCounter((prev) => prev - 1);
          setMessage(
            'There was an error loading the Hotel Brands. Please reload the page and try again.'
          );
        });
    }
  }, [setMessage]);

  const sectionTitle = props.hotelID ? 'Edit Hotel Property' : 'Add New Hotel Property';

  const containerClass = classNames('add-new', 'add-new-hotel-property');

  const updateEntityName = (e) => {
    setHotelPropertyName(e.target.value);
  };

  const entityNameOnBlur = (e) => {
    setHotelPropertyNameValid(validateRequired(e.target.value));
  };

  const updateEntityAddress = (e) => {
    setHotelPropertyAddr1(e.target.value);
  };

  const entityAddressOnBlur = (e) => {
    setHotelPropertyAddr1Valid(validateRequired(e.target.value));
  };

  const updateEntityAddress2 = (e) => {
    setHotelPropertyAddr2(e.target.value);
  };

  const updateEntityCity = (e) => {
    setHotelPropertyCity(e.target.value);
  };

  const entityCityOnBlur = (e) => {
    setHotelPropertyCityValid(validateRequired(e.target.value));
  };

  const updateEntityState = (e) => {
    setHotelPropertyState(e.target.value);
    setHotelPropertyStateValid(validateRequired(e.target.value));
  };

  const updateEntityZip = (e) => {
    setHotelPropertyZip(e.target.value);
  };

  const entityZipOnBlur = (e) => {
    setHotelPropertyZipValid(validateRequired(e.target.value));
  };

  const updateEntityContactName = (e) => {
    setHotelPropertyContactName(e.target.value);
  };

  const entityContactNameOnBlur = (e) => {
    setHotelPropertyContactNameValid(validateRequired(e.target.value));
  };

  const updateEntityContactPosition = (e) => {
    setHotelPropertyContactTitle(e.target.value);
  };

  const entityContactPositionOnBlur = (e) => {
    setHotelPropertyContactTitleValid(validateRequired(e.target.value));
  };

  const updateEntityEmail = (e) => {
    setHotelPropertyContactEmail(e.target.value);
  };

  const entityContactEmailOnBlur = (e) => {
    setHotelPropertyContactEmailValid(validateEmail(e.target.value));
  };

  const updateEntityTelephone = (e) => {
    setHotelPropertyContactPhone(e);
  };

  const entityContactPhoneOnBlur = (e) => {
    setHotelPropertyContactPhoneValid(validatePhoneNumber(e.target.value));
  };

  const updateEntityExtension = (e) => {
    setHotelPropertyContactExt(e.target.value);
  };

  const entityContactExtensionOnBlur = (e) => {
    setHotelPropertyContactExtValid(validateNumeric(e.target.value));
  };

  const updateEntityIsBlacklisted = (e) => {
    setHotelPropertyBlacklistStatus(e.target.checked);
  };

  const updateEntityChain = (e) => {
    setHotelPropertyChain(e?.value);
    setHotelPropertyChainValid(validateRequired(e?.value));
    setHotelPropertyBrand(null);
  };

  const updateEntityBrand = (e) => {
    setHotelPropertyBrand(e?.value);
    setHotelPropertyBrandValid(validateRequired(e?.value));
  };

  const cancelClick = (e) => {
    e.preventDefault();
    props.toggleEditWindow(e);
  };

  const isValidForm = () => {
    const localHotelPropertyNameValid = validateRequired(hotelPropertyName);
    setHotelPropertyNameValid(localHotelPropertyNameValid);
    const localHotelPropertyAddr1Valid = validateRequired(hotelPropertyAddr1);
    setHotelPropertyAddr1Valid(localHotelPropertyAddr1Valid);
    const localHotelPropertyCityValid = validateRequired(hotelPropertyCity);
    setHotelPropertyCityValid(localHotelPropertyCityValid);
    const localHotelPropertyStateValid = validateRequired(hotelPropertyState);
    setHotelPropertyStateValid(localHotelPropertyStateValid);
    const localHotelPropertyZipValid = validateRequired(hotelPropertyZip);
    setHotelPropertyZipValid(localHotelPropertyZipValid);
    const localHotelPropertyContactPhoneValid = validatePhoneNumber(hotelPropertyContactPhone);
    setHotelPropertyContactPhoneValid(localHotelPropertyContactPhoneValid);
    const localHotelPropertyBrandValid = validateRequired(hotelPropertyBrand);
    setHotelPropertyBrandValid(localHotelPropertyBrandValid);
    const localHotelPropertyChainValid = validateRequired(hotelPropertyChain);
    setHotelPropertyChainValid(localHotelPropertyChainValid);
    return (
      localHotelPropertyNameValid.valid &&
      localHotelPropertyAddr1Valid.valid &&
      localHotelPropertyCityValid.valid &&
      localHotelPropertyStateValid.valid &&
      localHotelPropertyZipValid.valid &&
      localHotelPropertyContactPhoneValid.valid &&
      localHotelPropertyBrandValid.valid &&
      localHotelPropertyChainValid.valid
    );
  };

  const submitClick = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    // Handle validation.
    if (!isValidForm()) {
      setButtonDisabled(false);
      setMessage('Required information is missing. Please review the information.');
      return;
    }

    let newHotel = null;
    if (props.hotelID) {
      newHotel = HotelProperty.copyOf(entity, (updated) => {
        (updated.name = hotelPropertyName),
          (updated.address = hotelPropertyAddr1),
          (updated.address_2 = hotelPropertyAddr2),
          (updated.city = hotelPropertyCity),
          (updated.state = hotelPropertyState),
          (updated.zip = hotelPropertyZip),
          (updated.contact_name = hotelPropertyContactName),
          (updated.contact_position = hotelPropertyContactTitle),
          (updated.email = hotelPropertyContactEmail),
          (updated.telephone = hotelPropertyContactPhone),
          (updated.extension = hotelPropertyContactExt),
          (updated.status = HOTELPROPERTYSTATUS.ACTIVE),
          (updated.HotelChainID = hotelPropertyChain),
          (updated.HotelBrandID = hotelPropertyBrand);
      });
    } else {
      newHotel = new HotelProperty({
        name: hotelPropertyName,
        address: hotelPropertyAddr1,
        address_2: hotelPropertyAddr2,
        city: hotelPropertyCity,
        state: hotelPropertyState,
        zip: hotelPropertyZip,
        contact_name: hotelPropertyContactName,
        contact_position: hotelPropertyContactTitle,
        email: hotelPropertyContactEmail,
        telephone: hotelPropertyContactPhone,
        extension: hotelPropertyContactExt,
        status: HOTELPROPERTYSTATUS.ACTIVE,
        HotelChainID: hotelPropertyChain,
        HotelBrandID: hotelPropertyBrand,
      });
    }

    if (shouldUseDatastore()) {
      DataStore.save(newHotel)
        .then((item) => setEntity(item))
        .then(() => props.toggleEditWindow(e));
    } else {
      const {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        FisherHouse,
        HotelChain,
        HotelBrand,
        ...objectToSave
      } = newHotel;
      if (props.hotelID) {
        API.graphql(graphqlOperation(updateHotelProperty, { input: objectToSave }))
          .then((results) => {
            const newHP = deserializeModel(HotelProperty, results.data.updateHotelProperty);
            setEntity(newHP);
            setButtonDisabled(false);
            props.toggleEditWindow(e);
            props.setHotelToNewEntity({ value: newHP.id });
          })
          .catch((err) => {
            console.log('Caught error', err);
            setButtonDisabled(false);
            setMessage(
              'There was an error saving the Hotel Property. Please reload the page and try again.'
            );
          });
      } else {
        API.graphql(graphqlOperation(createHotelProperty, { input: objectToSave }))
          .then((results) => {
            const newHP = deserializeModel(HotelProperty, results.data.createHotelProperty);
            setEntity(newHP);
            setButtonDisabled(false);
            props.toggleEditWindow(e);
            props.setHotelToNewEntity({ value: newHP.id });
          })
          .catch((err) => {
            console.log('Caught error', err);
            setButtonDisabled(false);
            setMessage(
              'There was an error saving the Hotel Property. Please reload the page and try again.'
            );
          });
      }
    }
  };

  const containerClasses = classNames('detail-block', {
    loading: loadingCounter > 0,
  });

  return (
    <div className={containerClasses}>
      <h4>{sectionTitle}</h4>
      <div className={containerClass}>
        <Textfield
          wrapperClass="hotel-property-name"
          label="Hotel Property Name"
          inputValue={hotelPropertyName}
          inputOnChange={updateEntityName}
          inputRequired
          inputOnBlur={entityNameOnBlur}
          isValid={hotelPropertyNameValid.valid}
          errorMessage={hotelPropertyNameValid.message}
        />
        <Selectfield
          wrapperClass="hotel-property_hotel-chain"
          label="Hotel Chain"
          inputValue={chains
            .map((item) => {
              return { value: item.id, label: item.name };
            })
            .find((item) => item.value == hotelPropertyChain)}
          inputOnChange={updateEntityChain}
          useReactSelect
          useRegularSelect={false}
          placeholder="Select a Hotel Chain..."
          blankValue=""
          options={chains.map((item) => {
            return { value: item.id, label: item.name };
          })}
          inputRequired
          isValid={hotelPropertyChainValid.valid}
          errorMessage={hotelPropertyChainValid.message}
        />
        <Selectfield
          wrapperClass="hotel-property_hotel-brand"
          label="Hotel Brand"
          inputValue={brands
            .map((item) => {
              return { value: item.id, label: item.name };
            })
            .find((item) => item.value == hotelPropertyBrand)}
          inputOnChange={updateEntityBrand}
          useReactSelect
          useRegularSelect={false}
          placeholder="Select a Hotel Brand..."
          blankValue=""
          options={brands
            .filter((item) =>
              hotelPropertyChain ? item.hotelBrandHotelChainId == hotelPropertyChain : true
            )
            .map((item) => {
              return { value: item.id, label: item.name };
            })}
          isValid={hotelPropertyBrandValid.valid}
          errorMessage={hotelPropertyBrandValid.message}
        />
        <div className="street-address-block">
          <Textfield
            label="Street Address"
            wrapperClass="street-address"
            inputValue={hotelPropertyAddr1}
            inputOnChange={updateEntityAddress}
            inputRequired
            inputOnBlur={entityAddressOnBlur}
            isValid={hotelPropertyAddr1Valid.valid}
            errorMessage={hotelPropertyAddr1Valid.message}
          >
            <input
              className="no-label"
              type="text"
              value={hotelPropertyAddr2}
              onChange={updateEntityAddress2}
            />
          </Textfield>

          <Textfield
            label="City"
            wrapperClass="city"
            inputValue={hotelPropertyCity}
            inputOnChange={updateEntityCity}
            inputRequired
            inputOnBlur={entityCityOnBlur}
            isValid={hotelPropertyCityValid.valid}
            errorMessage={hotelPropertyCityValid.message}
          />
          <StateField
            inputValue={hotelPropertyState}
            inputOnChange={updateEntityState}
            inputRequired
            isValid={hotelPropertyStateValid.valid}
            errorMessage={hotelPropertyStateValid.message}
          />
          <Textfield
            label="Zip"
            wrapperClass="zip"
            inputValue={hotelPropertyZip}
            inputOnChange={updateEntityZip}
            inputRequired
            inputOnBlur={entityZipOnBlur}
            isValid={hotelPropertyZipValid.valid}
            errorMessage={hotelPropertyZipValid.message}
          />
        </div>
        <Textfield
          wrapperClass="hotel-property-contact-name"
          label="Contact Name (Optional)"
          inputValue={hotelPropertyContactName}
          inputOnChange={updateEntityContactName}
        />
        <Textfield
          wrapperClass="hotel-property-contact-position"
          label="Contact Position (Optional)"
          inputValue={hotelPropertyContactTitle}
          inputOnChange={updateEntityContactPosition}
        />
        <ContactInfoBlock
          emailValue={hotelPropertyContactEmail}
          emailOnChange={updateEntityEmail}
          emailOnBlur={entityContactEmailOnBlur}
          // emailValid={hotelPropertyContactEmailValid}
          emailLabel="Email (Optional)"
          telephoneValue={hotelPropertyContactPhone}
          telephoneOnChange={updateEntityTelephone}
          telephoneOnBlur={entityContactPhoneOnBlur}
          telephoneValid={hotelPropertyContactPhoneValid}
          extensionValue={hotelPropertyContactExt}
          extensionOnChange={updateEntityExtension}
          extensionOnBlur={entityContactExtensionOnBlur}
          extensionValid={hotelPropertyContactExtValid}
        />
        <div className="stay-controls">
          <button className="cancel" onClick={cancelClick} disabled={buttonDisabled} type='button'>
            Cancel
          </button>
          <button className="save" onClick={submitClick} disabled={buttonDisabled} type='button'>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

EditOrCreateHotel.defaultProps = {
  hotelID: '',
  updateAndSaveStay: () => {},
  toggleEditWindow: () => {},
  setHotelToNewEntity: () => {},
};
