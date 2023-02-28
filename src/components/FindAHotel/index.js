import { Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { HotelChain, HotelBrand, HotelProperty } from '@src/models';
import {
  HOTELCHAINSTATUS,
  HOTELBRANDSTATUS,
  HOTELPROPERTYSTATUS,
  ROOMTYPE,
  ROOMFEATURES,
} from '@src/API';
import SelectBox from '../Inputs/SelectBox';
import HotelDetails from '../HotelDetails';
import Selectfield from '../Inputs/Selectfield';
import Textfield from '../Inputs/Textfield';
import Checkboxes from '../Inputs/Checkboxes';
import EditOrCreateHotel from '../EditOrCreateHotel';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import {
  listHotelProperties,
  searchHotelProperties,
  listHotelChains,
  searchHotelChains,
  listHotelBrands,
  searchHotelBrands,
} from '@src/graphql/queries';
import { listHotelPropertiesWithRelationships } from '@src/customQueries/listHotelPropertiesWithRelationships';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import validateRequired from '@utils/validators/required';
import { State } from '@utils/states';

export default function FindAHotel(props) {
  const [chainFilter, setChainFilter] = useState();
  const [brandFilter, setBrandFilter] = useState();
  const [stateFilter, setStateFilter] = useState();
  const [cityFilter, setCityFilter] = useState();
  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [properties, setProperties] = useState([]);
  const [arcProperties, setArcProperties] = useState([]);
  const [showEditOrCreateHotel, setShowEditOrCreateHotel] = useState(false);
  const [cities, setCities] = useState([]);
  const [hotelProperty, setHotelProperty] = useState();

  const { setMessage } = useDialog();

  const loadHotelPropertiesWithRelationship = useCallback(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelProperty, (c) => c.status('eq', HOTELPROPERTYSTATUS.ACTIVE), {
        page: 0,
        limit: 999999,
      }).then((items) => {
        setProperties(items);
        setCities(
          [
            ...new Set(
              items
                .filter((item) => item.city && item.city.trim().length > 0 && item.city != null)
                .map((item) => {
                  return item.city;
                })
            ),
          ]
            .sort()
            .map((item) => {
              return { value: item, label: item };
            })
        );
      });
    } else {
      API.graphql(
        graphqlOperation(listHotelPropertiesWithRelationships, {
          filter: {
            or: [
              { status: { eq: HOTELPROPERTYSTATUS.ACTIVE } },
              { status: { eq: HOTELPROPERTYSTATUS.ARCHIVED } },
              { status: { eq: HOTELPROPERTYSTATUS.BLACKLISTED } },
            ],
          },
          limit: 9999,
        })
      )
        .then((results) => {
          let propertyData = results.data.listHotelProperties.items
            .filter((item) => !item['_deleted'])
            .map((item) => deserializeModel(HotelProperty, item));
          setProperties(propertyData);
          setCities(
            [
              ...new Set(
                propertyData
                  .filter((item) => item.city && item.city.trim().length > 0 && item.city != null)
                  .map((item) => {
                    return item.city;
                  })
              ),
            ]
              .sort()
              .map((item) => {
                return { value: item, label: item };
              })
          );
          setArcProperties(
            propertyData.filter((item) => item.status === HOTELPROPERTYSTATUS.ARCHIVED)
          );
          setProperties(propertyData.filter((item) => item.status !== HOTELPROPERTYSTATUS.ARCHIVED));
          setCities(
            [
              ...new Set(
                propertyData
                  .filter((item) => item.city && item.city.trim().length > 0 && item.city != null)
                  .map((item) => {
                    return item.city;
                  })
              ),
            ]
              .sort()
              .map((item) => {
                return { value: item, label: item };
              })
          );
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error loading the Hotel Properties. Please reload the page and try again.'
          );
        });
    }
  }, [setMessage]);

  useEffect(() => {
    loadHotelPropertiesWithRelationship();
  }, [loadHotelPropertiesWithRelationship]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelChain, (c) => c.status('ne', HOTELCHAINSTATUS.DRAFT), {
        page: 0,
        limit: 999999,
      }).then((items) => {
        setChains(items);
      });
    } else {
      API.graphql(
        graphqlOperation(searchHotelChains, {
          filter: {
            or: [{ status: { eq: HOTELCHAINSTATUS.ACTIVE } }],
          },
          limit: 999,
        })
      )
        .then((results) => {
          let activeChains = results.data.searchHotelChains.items;
          setChains(
            activeChains
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .map((item) => deserializeModel(HotelChain, item))
          );
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error loading the Hotel Chains. Please reload the page and try again.'
          );
        });
    }
  }, [setMessage]);

  useEffect(() => {
    if (shouldUseDatastore()) {
      DataStore.query(HotelBrand, (b) => b.status('ne', HOTELBRANDSTATUS.DRAFT), {
        page: 0,
        limit: 999999,
      }).then((items) => {
        setBrands(items);
      });
    } else {
      API.graphql(
        graphqlOperation(searchHotelBrands, {
          filter: {
            or: [{ status: { eq: HOTELCHAINSTATUS.ACTIVE } }],
          },
          limit: 999,
        })
      )
        .then((results) => {
          let activeBrands = results.data.searchHotelBrands.items;
          setBrands(
            activeBrands
              .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
              .map((item) => deserializeModel(HotelBrand, item))
          );
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error loading the Hotel Brands. Please reload the page and try again.'
          );
        });
    }
  }, [setMessage]);

  const updateChainFilter = (e) => {
    setChainFilter(e);
    if (e !== null) {
      if (!brandFilter) {
        setBrandFilter();
      } else {
        const brand = brands.find((a) => a.id === brandFilter.value);
        const chain = chains.find((item) => item.id === brand?.hotelBrandHotelChainId);
        if (chain?.id !== e.value) {
          setBrandFilter();
        }
      }
    }
    if (hotelProperty) {
      if (e !== null) {
        if (hotelProperty.HotelChain?.name !== e?.label) {
          props.updateAndSaveStay(props.stay, (u) => {
            u.HotelPropertyID = '';
          });
        }
      }
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.HotelPropertyID = '';
      });
    }
  };

  const updateBrandFilter = (e) => {
    setBrandFilter(e);
    if (hotelProperty) {
      if (e !== null) {
        if (hotelProperty.HotelBrand?.name !== e?.label) {
          props.updateAndSaveStay(props.stay, (u) => {
            u.HotelPropertyID = '';
          });
        }
      }
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.HotelPropertyID = '';
      });
    }
  };

  const updateStateFilter = (e) => {
    setStateFilter(e);
    let newCities = [];
    if (e !== null) {
      newCities = [
        ...new Set(
          properties
            .filter(
              (item) =>
                item.state === e.value &&
                item.city &&
                item.city.trim().length > 0 &&
                item.city != null
            )
            .map((item) => {
              return item.city;
            })
        ),
      ]
        .sort()
        .map((item) => {
          return { value: item, label: item };
        });
      if (!cityFilter) {
        setCityFilter();
      } else {
        const newCities = properties
          .filter(
            (item) =>
              item.state === e.value &&
              item.city &&
              item.city.trim().length > 0 &&
              item.city != null
          )
          .sort()
          .map((item) => {
            return item.city;
          });
        const city = newCities.find((item) => item === cityFilter.value);
        if (!city) {
          setCityFilter();
        }
      }
    } else {
      newCities = [
        ...new Set(
          properties
            .filter((item) => item.city && item.city.trim().length > 0 && item.city != null)
            .map((item) => {
              return item.city;
            })
        ),
      ]
        .sort()
        .map((item) => {
          return { value: item, label: item };
        });
    }

    setCities(newCities);
    if (hotelProperty) {
      if (e !== null) {
        if (hotelProperty.state !== e?.value) {
          props.updateAndSaveStay(props.stay, (u) => {
            u.HotelPropertyID = '';
          });
        }
      }
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.HotelPropertyID = '';
      });
    }
  };

  const updateCityFilter = (e) => {
    setCityFilter(e);
    if (hotelProperty) {
      if (e !== null) {
        console.log(hotelProperty.city, e?.value);
        console.log(hotelProperty.city.length, e?.value.length);
        if (hotelProperty.city !== e?.value) {
          props.updateAndSaveStay(props.stay, (u) => {
            u.HotelPropertyID = '';
          });
        }
      }
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.HotelPropertyID = '';
      });
    }
  };

  const saveRoomTypeActual = (e) => {
    props.setRoomTypeActualValid(validateRequired(e?.value));
    props.updateAndSaveStay(props.stay, (u) => {
      u.room_type_actual = e?.value === undefined || e?.value == '' ? null : e?.value;
      u.room_description_actual =
        e?.value == ROOMTYPE.OTHER ? props.stay.room_description_actual : '';
    });
  };

  const updateRoomDescriptionActual = (e) => {
    props.updateStay(props.stay, (u) => {
      u.room_description_actual = e.target.value;
    });
  };

  const saveRoomDescriptionActual = (e) => {
    props.setRoomTypeDescriptionValid(validateRequired(e.target.value));
    props.updateAndSaveStay(props.stay, (u) => {
      u.room_description_actual = e.target.value;
    });
  };

  const saveRoomFeatureActual = (e) => {
    if (e.target.checked) {
      props.updateAndSaveStay(props.stay, (u) => {
        u.room_feature_actual =
          props.stay.room_feature_actual == null
            ? [e.target.value]
            : [...props.stay.room_feature_actual, e.target.value];
      });
    } else {
      props.updateAndSaveStay(props.stay, (u) => {
        u.room_feature_actual = props.stay.room_feature_actual.filter(
          (item) => item != e.target.value
        );
      });
    }
  };

  const saveHotelSelection = (e) => {
    if (e === null) {
      setHotelProperty();
    }
    props.setHotelPropertyIsValid(validateRequired(e?.value));
    props.updateAndSaveStay(props.stay, (u) => {
      u.HotelPropertyID = e?.value ?? '';
    });
  };

  const toggleEditOrCreateHotel = (e) => {
    e.preventDefault();
    if (showEditOrCreateHotel) {
      loadHotelPropertiesWithRelationship();
    }
    setShowEditOrCreateHotel(!showEditOrCreateHotel);
  };

  const addNewHotel = (e) => {
    e.preventDefault();
    props.updateAndSaveStay(props.stay, (u) => {
      u.HotelPropertyID = '';
    });
    toggleEditOrCreateHotel(e);
  };

  const stateOptions = new State().getStatesOfCountry('US').map((i) => {
    return { value: i.name, label: i.name + ' (' + i.isoCode + ')' };
  });

  // const states1 = [
  //   ...new Set(
  //     properties
  //       .filter((item) => item.state && item.state.trim().length > 0 && item.state != null)
  //       .map((item) => {
  //         return item.state;
  //       })
  //   ),
  // ]
  //   .sort()
  //   .map((item) => {
  //     return { value: item, label: item };
  //   });

  // const states = states1.map(item => {
  //   return stateOptions.find(option => option.value === item.value);
  // });

  const states = stateOptions;

  const handleHotelProperty = (property) => {
    setHotelProperty(property);
  };

  const propOptions = properties.find(item => item.id === props.stay?.HotelPropertyID) ? properties :
    arcProperties.find(item => item.id === props.stay?.HotelPropertyID) ? [...properties, arcProperties.find((item) => item.id === props.stay?.HotelPropertyID)] :
      properties;
  const propertyOptions = propOptions
    .filter((item) => {
      return stateFilter == null || stateFilter == '' || stateFilter.value == item.state;
    })
    .filter((item) => {
      return cityFilter == null || cityFilter == '' || cityFilter.value == item.city;
    })
    .filter((item) => {
      return (
        chainFilter == null || chainFilter == '' || chainFilter.value == item.HotelChainID
      );
    })
    .filter((item) => {
      return (
        brandFilter == null || brandFilter == '' || brandFilter.value == item.HotelBrandID
      );
    })
    .filter((item) => item.name)
    .sort((a, b) => a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    .map((item) => ({
      value: item.id,
      label:
        item.status == HOTELPROPERTYSTATUS.BLACKLISTED
          ? 'BLACKLISTED - ' +
          (item.HotelChain?.name ? item.HotelChain?.name + ' - ' : '') +
          item.name
          : (item.HotelChain?.name ? item.HotelChain?.name + ' - ' : '') + item.name,
    }));

  return (
    <Fragment>
      {showEditOrCreateHotel && (
        <EditOrCreateHotel
          hotelID={props.stay?.HotelPropertyID}
          toggleEditWindow={toggleEditOrCreateHotel}
          setHotelToNewEntity={saveHotelSelection}
        />
      )}
      {!showEditOrCreateHotel && (
        <div className="detail-block">
          <h4>Find a Hotel</h4>

          <div className="input-combo hotel-filters">
            <label className={props.inputDisabled ? 'disabled' : ''}>Filter By</label>

            <div className="selectbox hotel-filters">
              <SelectBox
                inputClass="select-state"
                withWrapper={false}
                options={states}
                placeholder="State"
                inputOnChange={updateStateFilter}
                inputValue={stateOptions.find((item) => item.value == stateFilter?.value)}
                inputDisabled={props.inputDisabled}
                useReactSelect
                useRegularSelect={false}
                blankValue=""
              />
              <SelectBox
                inputClass="select-city"
                withWrapper={false}
                options={cities}
                placeholder="City"
                inputOnChange={updateCityFilter}
                inputValue={cityFilter}
                inputDisabled={props.inputDisabled}
                useReactSelect
                useRegularSelect={false}
                blankValue=""
              />
              <SelectBox
                inputClass="select-hotel-chain"
                withWrapper={false}
                options={chains.map((item) => {
                  return { value: item.id, label: item.name };
                })}
                placeholder="Hotel Chain"
                inputOnChange={updateChainFilter}
                inputValue={chainFilter}
                inputDisabled={props.inputDisabled}
                useReactSelect
                useRegularSelect={false}
                blankValue=""
              />
              <SelectBox
                inputClass="select-hotel-brand"
                withWrapper={false}
                options={brands
                  .filter((item) => {
                    if (chainFilter) {
                      return item.hotelBrandHotelChainId == chainFilter?.value;
                    }
                    return true;
                  })
                  .map((item) => {
                    return { value: item.id, label: item.name };
                  })}
                placeholder="Hotel Brand"
                inputOnChange={updateBrandFilter}
                inputValue={brandFilter}
                inputDisabled={props.inputDisabled}
                useReactSelect
                useRegularSelect={false}
                blankValue=""
              />
            </div>
            {/* <!-- // NOTE: In this case, we will only replace the selects WITHIN the selectbox element with the searchable dropdowns, rather than the entire selectbox --> */}
          </div>

          <Selectfield
            wrapperClass="hotel-selector"
            label="Hotel"
            withAddNew
            onAddNewClick={addNewHotel}
            placeholder="Select Hotel Property..."
            options={propertyOptions}
            inputValue={props.stay?.HotelPropertyID}
            inputOnChange={saveHotelSelection}
            isValid={props.hotelPropertyIsValid}
            errorMessage={props.hotelPropertyMessage}
            inputDisabled={props.inputDisabled}
            useReactSelect
            useRegularSelect={false}
            blankValue=""
          />

          {props.stay?.HotelPropertyID && !showEditOrCreateHotel && (
            <HotelDetails
              hotelID={props.stay?.HotelPropertyID}
              toggleEditWindow={toggleEditOrCreateHotel}
              inputDisabled={props.inputDisabled}
              withEditHotelButton
              setHotelProperty={handleHotelProperty}
            />
          )}

          <h4>Room Details</h4>
          <Selectfield
            label="Room Type"
            options={ROOMTYPE}
            inputValue={props.stay?.room_type_actual}
            inputOnChange={saveRoomTypeActual}
            inputDisabled={props.inputDisabled}
            isValid={props.roomTypeIsValid}
            errorMessage={props.roomTypeMessage}
            useReactSelect
            useRegularSelect={false}
            blankValue=""
            placeholder="Select Room Type..."
          />

          {props.stay?.room_type_actual == ROOMTYPE.OTHER && (
            <Textfield
              label="Room Description"
              inputValue={props.stay?.room_description_actual}
              inputOnChange={updateRoomDescriptionActual}
              inputOnBlur={saveRoomDescriptionActual}
              inputDisabled={props.inputDisabled}
              isValid={props.roomTypeDescriptionIsValid}
              errorMessage={props.roomTypeDescriptionMessage}
            />
          )}
        </div>
      )}
    </Fragment>
  );
}

FindAHotel.defaultProps = {
  editable: true,
  stay: {},
  setStay: () => { },
  saveStay: () => { },
  roomTypeIsValid: true,
  roomTypeMessage: '',
  setRoomTypeActualValid: () => { },
  roomTypeDescriptionIsValid: true,
  roomTypeDescriptionMessage: '',
  setRoomTypeDescriptionValid: () => { },
  hotelPropertyIsValid: true,
  hotelPropertyMessage: '',
  setHotelPropertyIsValid: () => { },
};
