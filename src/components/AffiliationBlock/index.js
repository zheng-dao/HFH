import { Fragment, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { AFFILIATIONTYPE, AFFILIATIONSTATUS, NOTEACTION } from '@src/API';
import Radios from '@components/Inputs/Radios';
import Selectfield from '@components/Inputs/Selectfield';
import Textfield from '@components/Inputs/Textfield';
import StateField from '@components/CommonInputs/StateField';
import classNames from 'classnames';
import { State } from '@utils/states';
import { DataStore } from '@aws-amplify/datastore';
import { Affiliation } from '@src/models';
import toast from 'react-hot-toast';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { createAffiliation, updateAffiliation, deleteAffiliation } from '@src/graphql/mutations';
import { getAffiliation } from '@src/graphql/queries';
import useDialog from '@contexts/DialogContext';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import logger from '../../utils/logger';
import validateRequired from '@utils/validators/required';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import useAuth from '@contexts/AuthContext';
import humanName from '@utils/humanName';
import htmlEntities from '@utils/htmlEntities';
import createNote from '@utils/createNote';
import { APPLICATIONSTATUS, USERSTATUS } from '@src/API';

const AffiliationBlock = forwardRef((props, ref) => {
  let affiliationOptions = [];
  let selectTitle = '';
  let addNewTitle = '';
  let noneOption = '';
  const { setMessage } = useDialog();
  const { profile, isAdministrator } = useAuth();

  const [affiliationNameValid, setAffiliationNameValid] = useState(false);
  const [affiliationCityValid, setAffiliationCityValid] = useState(false);
  const [affiliationStateValid, setAffiliationStateValid] = useState(false);

  switch (props.selectedAffiliationType) {
    case AFFILIATIONTYPE.FISHERHOUSE:
      affiliationOptions = props.fisherhouseOptions;
      selectTitle = 'Find Your Fisher House';
      addNewTitle = 'Add New Fisher House';
      noneOption = 'Select Fisher House...';
      break;

    case AFFILIATIONTYPE.BASE:
      affiliationOptions = props.baseOptions.filter((option) => option.label !== '');
      selectTitle = 'Find Your Base';
      addNewTitle = 'Add New Base';
      noneOption = 'Select Base...';
      break;

    case AFFILIATIONTYPE.MEDICALCENTER:
      affiliationOptions = props.medicalCenterOptions.filter((option) => option.label !== '');
      selectTitle = 'Find Your Medical Center';
      addNewTitle = 'Add New Medical Center';
      noneOption = 'Select Medical Center...';
      break;

    case AFFILIATIONTYPE.ORGANIZATION:
      affiliationOptions = props.organizationOptions.filter((option) => option.label !== '');
      selectTitle = 'Find Your Organization';
      addNewTitle = 'Add New Organization';
      noneOption = 'Select Organization...';
      break;
  }

  const [addNewVisibleStatus, setAddNewVisibleStatus] = useState(false);
  const [isReadyForDelete, setIsReadyForDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(0);

  const addNewClassNames = classNames(
    'inner-pane',
    'add-new-' + (props.selectedAffiliationType ? props.selectedAffiliationType.toLowerCase() : ''),
    {
      hidden: !addNewVisibleStatus,
      loading: isLoading > 0,
    }
  );

  const removeClassNames = classNames('remove', {
    clicked: isReadyForDelete,
  });

  const [affiliationObject, setAffiliationObject] = useState({});
  const [affiliationSourceObject, setAffiliationSourceObject] = useState({});

  const affiliationNameClass = classNames(props.selectedAffiliationType?.toLowerCase() + '-name');
  const affiliationCityClass = classNames(props.selectedAffiliationType?.toLowerCase() + '-city');
  const affiliationStateClass = classNames(props.selectedAffiliationType?.toLowerCase() + '-state');

  useEffect(() => {
    if (props.selectedAffiliation && props.selectedAffiliation != affiliationObject?.id) {
      setIsLoading((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(Affiliation, props.selectedAffiliation).then((aff) => {
          if (typeof aff != 'undefined') {
            setAffiliationObject(aff);
            if (aff.status == AFFILIATIONSTATUS.PENDING || aff.status == AFFILIATIONSTATUS.DRAFT) {
              setAddNewVisibleStatus(true);
            }
          }
        });
      } else {
        API.graphql(graphqlOperation(getAffiliation, { id: props.selectedAffiliation }))
          .then((result) => {
            const aff = result.data.getAffiliation;
            if (typeof aff != 'undefined' && aff != null) {
              setAffiliationObject(deserializeModel(Affiliation, aff));
              setAffiliationSourceObject(deserializeModel(Affiliation, aff));
              if (
                aff.status == AFFILIATIONSTATUS.PENDING ||
                aff.status == AFFILIATIONSTATUS.DRAFT
              ) {
                setAddNewVisibleStatus(true);
              }
              setIsLoading((prev) => prev - 1);
            }
          })
          .catch((err) => {
            console.log('Caught error', err);
            setMessage(
              'There was an error loading the Affiliation. Please reload the page and try again.'
            );
            setIsLoading((prev) => prev - 1);
          });
      }
    }
  }, [props.selectedAffiliation, affiliationObject?.id, setMessage]);

  const updateAffiliationNameChange = (e) => {
    setAffiliationObject(
      Affiliation.copyOf(affiliationObject, (u) => {
        u.name = e.target.value;
      })
    );
  };

  const saveAffiliationNameChange = () => {
    const isValid = validateRequired(affiliationObject.name);
    setAffiliationNameValid(isValid);
    if (shouldUseDatastore()) {
      DataStore.save(affiliationObject)
        .then((aff) => setAffiliationObject(aff))
        .then(() => toast('Saved ' + props.historyNoteTypeName + ' Name.'));
    } else {
      // Destructure object to remove extra fields.
      const {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        AssociatedAffiliation,
        owner,
        ...objectToSave
      } = affiliationObject;
      API.graphql(graphqlOperation(updateAffiliation, { input: { ...objectToSave } }))
        .then((result) => {
          const newAff = deserializeModel(Affiliation, result.data.updateAffiliation);
          // setAffiliationObject(newAff);
          props.setAffiliation(newAff.id);
          // Should we set history note?
          if (
            props.application &&
            newAff.name != affiliationSourceObject.name &&
            shouldCreateNoteAboutAdminChange(props.application, isAdministrator())
          ) {
            const originalValue = affiliationSourceObject.name || htmlEntities('<empty>');
            const newValue = newAff.name || htmlEntities('<empty>');
            createNote(
              humanName(profile) +
                " changed <span class='field'>" +
                props.historyNoteTypeName +
                ' Name</span> from ' +
                originalValue +
                ' to ' +
                newValue +
                '.',
              NOTEACTION.CHANGE_DATA,
              props.application,
              profile
            );
          }
          setAffiliationSourceObject(newAff);
        })
        .then(() => {
          toast('Saved ' + props.historyNoteTypeName + ' Name.');
        })
        .catch((err) => {
          err.errors.forEach((item) => {
            logger(new Error(item.message));
          });
          setMessage(
            'There was an error saving the ' +
              props.historyNoteTypeName +
              '. Please reload the page and try again.'
          );
        });
    }
  };

  const updateAffiliationCityChange = (e) => {
    setAffiliationObject(
      Affiliation.copyOf(affiliationObject, (u) => {
        u.city = e.target.value;
      })
    );
  };

  const saveAffiliationCityChange = (e) => {
    const isValid = validateRequired(affiliationObject.city);
    setAffiliationCityValid(isValid);
    if (shouldUseDatastore()) {
      DataStore.save(affiliationObject)
        .then((aff) => setAffiliationObject(aff))
        .then(() => toast('Saved ' + props.historyNoteTypeName + ' City.'));
    } else {
      // Destructure object to remove extra fields.
      const newAffiliation = Affiliation.copyOf(affiliationObject, (u) => {
        u.city = e.target.value;
      });
      const {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        AssociatedAffiliation,
        owner,
        ...objectToSave
      } = newAffiliation;
      setAffiliationObject(newAffiliation);
      API.graphql(graphqlOperation(updateAffiliation, { input: { ...objectToSave } }))
        .then((result) => {
          const newAff = deserializeModel(Affiliation, result.data.updateAffiliation);
          // setAffiliationObject(newAff);
          props.setAffiliation(newAff.id);
          // Should we set history note?
          if (
            props.application &&
            newAff.city != affiliationSourceObject.city &&
            shouldCreateNoteAboutAdminChange(props.application, isAdministrator())
          ) {
            const originalValue = affiliationSourceObject.city || htmlEntities('<empty>');
            const newValue = newAff.city || htmlEntities('<empty>');
            createNote(
              humanName(profile) +
                " changed <span class='field'>" +
                props.historyNoteTypeName +
                ' City</span> from ' +
                originalValue +
                ' to ' +
                newValue +
                '.',
              NOTEACTION.CHANGE_DATA,
              props.application,
              profile
            );
          }
          setAffiliationSourceObject(newAff);
        })
        .then(() => {
          toast('Saved ' + props.historyNoteTypeName + ' City.');
        })
        .catch((err) => {
          console.log('Caught error saveAffiliationCityChange', err);
          setMessage(
            'There was an error saving the ' +
              props.historyNoteTypeName +
              '. Please reload the page and try again.'
          );
        });
    }
  };

  const updateAffiliationStateChange = (e) => {
    const isValid = validateRequired(e.target.value);
    setAffiliationStateValid(isValid);
    if (shouldUseDatastore()) {
      DataStore.save(
        Affiliation.copyOf(affiliationObject, (u) => {
          u.state = e.target.value;
        })
      )
        .then((aff) => setAffiliationObject(aff))
        .then(() => toast('Saved ' + props.historyNoteTypeName + ' State.'));
    } else {
      // Destructure object to remove extra fields.
      const newAffiliation = Affiliation.copyOf(affiliationObject, (u) => {
        u.state = e.target.value;
      });
      const {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        AssociatedAffiliation,
        owner,
        ...objectToSave
      } = newAffiliation;
      setAffiliationObject(newAffiliation);
      API.graphql(graphqlOperation(updateAffiliation, { input: { ...objectToSave } }))
        .then((result) => {
          const newAff = deserializeModel(Affiliation, result.data.updateAffiliation);
          // setAffiliationObject(newAff);
          props.setAffiliation(newAff.id);
          // Should we set history note?
          if (
            props.application &&
            newAff.state != affiliationSourceObject.state &&
            shouldCreateNoteAboutAdminChange(props.application, isAdministrator())
          ) {
            const originalValue = affiliationSourceObject.state || htmlEntities('<empty>');
            const newValue = newAff.state || htmlEntities('<empty>');
            createNote(
              humanName(profile) +
                " changed <span class='field'>" +
                props.historyNoteTypeName +
                ' State</span> from ' +
                originalValue +
                ' to ' +
                newValue +
                '.',
              NOTEACTION.CHANGE_DATA,
              props.application,
              profile
            );
          }
          setAffiliationSourceObject(newAff);
        })
        .then(() => {
          toast('Saved ' + props.historyNoteTypeName + ' State.');
        })
        .catch((err) => {
          console.log('Caught error updateAffiliationStateChange', err);
          setMessage(
            'There was an error saving the ' +
              props.historyNoteTypeName +
              '. Please reload the page and try again.'
          );
        });
    }
  };

  const validateNewAffiliationFields = () => {
    const isNameValid = validateRequired(affiliationObject.name);
    setAffiliationNameValid(isNameValid);
    const isCityValid = validateRequired(affiliationObject.city);
    setAffiliationCityValid(isCityValid);
    const isStateValid = validateRequired(affiliationObject.state);
    setAffiliationStateValid(isStateValid);
    return (
      affiliationObject.status == AFFILIATIONSTATUS.ACTIVE ||
      (isNameValid.valid && isCityValid.valid && isStateValid.valid)
    );
  };

  useImperativeHandle(ref, () => ({
    validateAffiliationForm() {
      return validateNewAffiliationFields();
    },

    getAffiliationObject() {
      return affiliationObject;
    },
  }));

  const removeNewAffiliation = (e) => {
    e.preventDefault();
    if (isReadyForDelete) {
      setIsReadyForDelete(false);
      setAddNewVisibleStatus(false);
      props.setAffiliation('');
      if (shouldUseDatastore()) {
        DataStore.delete(affiliationObject);
      } else {
        API.graphql(graphqlOperation(deleteAffiliation, { input: { id: affiliationObject.id } }));
      }
      setAffiliationObject({});
    } else {
      setIsReadyForDelete(true);
    }
  };

  const addNew = () => {
    addNewAffiliationInDraft();
    setAddNewVisibleStatus(true);
  };

  const setAffiliation = (e) => {
    props.setAffiliation(e?.value);
  };

  const addNewAffiliationInDraft = () => {
    if (shouldUseDatastore()) {
      DataStore.save(
        new Affiliation({
          type: props.selectedAffiliationType,
          status: AFFILIATIONSTATUS.DRAFT,
        })
      ).then((aff) => {
        setAffiliationObject(aff);
        props.setAffiliation(aff.id);
      });
    } else {
      setIsLoading((prev) => prev + 1);
      API.graphql(
        graphqlOperation(createAffiliation, {
          input: { type: props.selectedAffiliationType, status: AFFILIATIONSTATUS.DRAFT, name: '' },
        })
      )
        .then((results) => {
          setAffiliationObject(deserializeModel(Affiliation, results.data.createAffiliation));
          props.setAffiliation(results.data.createAffiliation.id);
          setIsLoading((prev) => prev - 1);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error creating the ' +
              props.historyNoteTypeName +
              '. Please reload the page and try again.'
          );
          setIsLoading((prev) => prev - 1);
        });
    }
  };

  const changeAffiliationType = (e) => {
    // If we are on a draft item, delete it
    if (affiliationObject.status == AFFILIATIONSTATUS.DRAFT) {
      if (shouldUseDatastore()) {
        DataStore.delete(affiliationObject);
      } else {
        API.graphql(graphqlOperation(deleteAffiliation, { input: { id: affiliationObject.id } }));
      }
    }
    // props.setAffiliation('');
    setAddNewVisibleStatus(false);
    props.setAffiliationType(e);
  };

  const userAffiliationRadiosClassname = classNames('user-affiliation-radios', 'radios', {
    error: !props.affiliationTypeValid,
  });

  return (
    <Fragment>
      <h3>Affiliation</h3>

      <p>
        Choose one.
        {props.affiliationTypeCount >= 0 && (
          <Fragment>
            &nbsp;
            <abbr
              title={'There are ' + props.affiliationTypeCount + ' unique values for this input.'}
            >
              ({props.affiliationTypeCount})
            </abbr>
          </Fragment>
        )}
      </p>

      <fieldset className={userAffiliationRadiosClassname}>
        <Radios
          inputDisabled={props.inputDisabled}
          options={AFFILIATIONTYPE}
          withFieldset={false}
          selected={props.selectedAffiliationType}
          onChange={changeAffiliationType}
          isValid={props.affiliationTypeValid}
          // errorMessage={props.affiliationTypeMessage}
        />
      </fieldset>
      {props.affiliationTypeMessage.length > 0 && (
        <p className="errMsg">{props.affiliationTypeMessage}</p>
      )}

      {!addNewVisibleStatus && props.selectedAffiliationType && (
        <Selectfield
          wrapperClass="fisher-house"
          inputDisabled={props.inputDisabled}
          label={selectTitle}
          labelCount={props.affiliationCount}
          inputOnChange={setAffiliation}
          inputValue={props.selectedAffiliation}
          options={affiliationOptions}
          withAddNew={props.withAddNew}
          onAddNewClick={addNew}
          isValid={props.affiliationValid}
          errorMessage={props.affiliationMessage}
          useReactSelect
          useRegularSelect={false}
          placeholder={noneOption}
          blankValue=""
        />
      )}

      {addNewVisibleStatus && (
        <div className={addNewClassNames}>
          <h4>{addNewTitle}</h4>

          {!props.inputDisabled && (
            <button
              id="remove-organization"
              className={removeClassNames}
              title="Remove"
              onClick={removeNewAffiliation}
              type="button"
            >
              Remove
            </button>
          )}

          <Textfield
            label="Name"
            inputDisabled={
              props.inputDisabled ||
              props.application?.status === APPLICATIONSTATUS.EXCEPTION ||
              props.application?.status === APPLICATIONSTATUS.REQUESTED ||
              props.profile?.status === USERSTATUS.PENDING
            }
            wrapperClass={affiliationNameClass}
            inputValue={affiliationObject?.name}
            inputOnChange={updateAffiliationNameChange}
            inputRequired={true}
            inputOnBlur={saveAffiliationNameChange}
            isValid={affiliationNameValid.valid}
            errorMessage={affiliationNameValid.message}
          />

          <Textfield
            label="City"
            inputDisabled={
              props.inputDisabled ||
              props.application?.status === APPLICATIONSTATUS.EXCEPTION ||
              props.application?.status === APPLICATIONSTATUS.REQUESTED ||
              props.profile?.status === USERSTATUS.PENDING
            }
            wrapperClass={affiliationCityClass}
            inputValue={affiliationObject?.city}
            inputOnChange={updateAffiliationCityChange}
            inputRequired={true}
            inputOnBlur={saveAffiliationCityChange}
            isValid={affiliationCityValid.valid}
            errorMessage={affiliationCityValid.message}
          />

          <StateField
            inputDisabled={
              props.inputDisabled ||
              props.application?.status === APPLICATIONSTATUS.EXCEPTION ||
              props.application?.status === APPLICATIONSTATUS.REQUESTED ||
              props.profile?.status === USERSTATUS.PENDING
            }
            inputValue={affiliationObject?.state}
            inputOnChange={updateAffiliationStateChange}
            isValid={affiliationStateValid.valid}
            errorMessage={affiliationStateValid.message}
          />
        </div>
      )}
    </Fragment>
  );
});

AffiliationBlock.defaultProps = {
  selectedAffiliationType: '',
  affiliationTypeCount: -1,
  affiliationCount: -1,
  setAffiliationType: () => {},
  setAffiliation: () => {},
  fisherhouseOptions: [],
  medicalCenterOptions: [],
  baseOptions: [],
  organizationOptions: [],
  inputDisabled: false,
  withAddNew: true,
  affiliationTypeValid: true,
  affiliationTypeMessage: '',
  affiliationValid: true,
  affiliationMessage: '',
  application: false,
  historyNoteTypeName: 'New Affiliation',
  profile: false,
};

AffiliationBlock.displayName = 'AffiliationBlock';

export default AffiliationBlock;
