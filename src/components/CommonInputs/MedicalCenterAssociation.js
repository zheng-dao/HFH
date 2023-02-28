import { AFFILIATIONTYPE, AFFILIATIONSTATUS, NOTEACTION } from '@src/API';
import Selectfield from '@components/Inputs/Selectfield';
import useAffiliationsHook from '../../hooks/useAffiliationsHook';
import { Fragment, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import classNames from 'classnames';
import Textfield from '@components/Inputs/Textfield';
import StateField from '@components/CommonInputs/StateField';
import { State } from '@utils/states';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { createAffiliation, updateAffiliation, deleteAffiliation } from '@src/graphql/mutations';
import { getAffiliation } from '@src/graphql/queries';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import toast from 'react-hot-toast';
import useDialog from '@contexts/DialogContext';
import { DataStore } from '@aws-amplify/datastore';
import { Affiliation } from '@src/models';
import useAuth from '@contexts/AuthContext';
import { FAKEUUID } from '@utils/fakeUUID';
import validateRequired from '@utils/validators/required';
import { shouldCreateNoteAboutAdminChange } from '@utils/shouldCreateNoteAboutAdminChange';
import humanName from '@utils/humanName';
import htmlEntities from '@utils/htmlEntities';
import createNote from '@utils/createNote';
import { APPLICATIONSTATUS } from '@src/API';

const MedicalCenterAssociation = forwardRef((props, ref) => {
  const { isAdministrator, profile } = useAuth();
  const options = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false);
  const optionsIncludingArchiving = useAffiliationsHook(AFFILIATIONTYPE.MEDICALCENTER, false, true);
  const { setMessage } = useDialog();

  const [addNewVisibleStatus, setAddNewVisibleStatus] = useState(false);
  const [isReadyForDelete, setIsReadyForDelete] = useState(false);

  const [affiliationNameValid, setAffiliationNameValid] = useState(false);
  const [affiliationCityValid, setAffiliationCityValid] = useState(false);
  const [affiliationStateValid, setAffiliationStateValid] = useState(false);
  const [affiliationObject, setAffiliationObject] = useState({});
  const [affiliationSourceObject, setAffiliationSourceObject] = useState({});
  const [isLoading, setIsLoading] = useState(0);

  const addNewClassNames = classNames('inner-pane', 'add-new-medcenter', {
    hidden: !addNewVisibleStatus,
    loading: isLoading > 0,
  });

  const removeClassNames = classNames('remove', {
    clicked: isReadyForDelete,
  });

  const loadAffiliation = useCallback(() => {
    return new Promise((resolve, reject) => {
      setIsLoading((prev) => prev + 1);
      if (props.value) {
        if (props.value == FAKEUUID) {
          const fakeAff = new Affiliation({
            status: AFFILIATIONSTATUS.ACTIVE,
            name: 'None/Unknown',
            type: AFFILIATIONTYPE.MEDICALCENTER,
          });
          setAffiliationObject(fakeAff);
          setIsLoading((prev) => prev - 1);
          resolve(fakeAff);
        } else {
          return API.graphql(graphqlOperation(getAffiliation, { id: props.value })).then(
            (result) => {
              const deserializedModel = deserializeModel(Affiliation, result.data.getAffiliation);
              setAffiliationObject(deserializedModel);
              setAffiliationSourceObject(deserializedModel);
              if (deserializedModel.status == AFFILIATIONSTATUS.PENDING || deserializedModel.status == AFFILIATIONSTATUS.DRAFT) {
                setAddNewVisibleStatus(true);
              }
              setIsLoading((prev) => prev - 1);
              resolve(deserializedModel);
            }
          );
        }
      } else {
        setIsLoading((prev) => prev - 1);
      }
    });
  }, [props.value]);

  useEffect(() => {
    loadAffiliation();
  }, [loadAffiliation]);

  const addNew = () => {
    addNewAffiliationInDraft();
    setAddNewVisibleStatus(true);
  };

  const removeNewAffiliation = (e) => {
    e.preventDefault();
    if (isReadyForDelete) {
      setIsReadyForDelete(false);
      setAddNewVisibleStatus(false);
      props.onChange('');
      if (shouldUseDatastore()) {
        DataStore.delete(affiliationObject);
      } else {
        API.graphql(graphqlOperation(deleteAffiliation, { input: { id: affiliationObject.id } }));
      }
      setAffiliationObject({});
      setAffiliationSourceObject({});
    } else {
      setIsReadyForDelete(true);
    }
  };

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
        .then(() => toast('Saved Affiliation Name.'));
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
          props.refreshParentObject();
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
          props.refreshParentObject();
        })
        .then(() => {
          toast('Saved ' + props.historyNoteTypeName + ' Name.');
        })
        .catch((err) => {
          console.log(err);
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

  const saveAffiliationCityChange = () => {
    const isValid = validateRequired(affiliationObject.city);
    setAffiliationCityValid(isValid);
    if (shouldUseDatastore()) {
      DataStore.save(affiliationObject)
        .then((aff) => setAffiliationObject(aff))
        .then(() => toast('Saved ' + props.historyNoteTypeName + ' City.'));
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
          props.refreshParentObject();
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
          props.refreshParentObject();
        })
        .then(() => {
          toast('Saved ' + props.historyNoteTypeName + ' City.');
        })
        .catch((err) => {
          console.log('Caught error', err);
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
        .then(() => toast('Saved Affiliation State.'));
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
          props.refreshParentObject();
          // Should we set history note?
          if (
            props.application &&
            newAff.state != affiliationSourceObject.state &&
            shouldCreateNoteAboutAdminChange(props.application, isAdministrator())
          ) {
            const originalValue = affiliationSourceObject.state || htmlEntities('<no selection>');
            const newValue = newAff.state || htmlEntities('<no selection>');
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
          props.refreshParentObject();
        })
        .then(() => {
          toast('Saved ' + props.historyNoteTypeName + ' State.');
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error saving the ' +
            props.historyNoteTypeName +
            '. Please reload the page and try again.'
          );
        });
    }
  };

  const addNewAffiliationInDraft = () => {
    if (shouldUseDatastore()) {
      DataStore.save(
        new Affiliation({
          type: AFFILIATIONTYPE.MEDICALCENTER,
          status: AFFILIATIONSTATUS.DRAFT,
        })
      ).then((aff) => {
        setAffiliationObject(aff);
        props.onChange(aff.id);
      });
    } else {
      setIsLoading((prev) => prev + 1);
      API.graphql(
        graphqlOperation(createAffiliation, {
          input: { type: AFFILIATIONTYPE.MEDICALCENTER, status: AFFILIATIONSTATUS.DRAFT, name: '' },
        })
      )
        .then((results) => {
          setAffiliationObject(deserializeModel(Affiliation, results.data.createAffiliation));
          props.onChange({ target: { value: results.data.createAffiliation.id } });
          setIsLoading((prev) => prev - 1);
        })
        .catch((err) => {
          console.log('Caught error', err);
          setMessage(
            'There was an error creating the new Affiliation. Please reload the page and try again.'
          );
          setIsLoading((prev) => prev - 1);
        });
    }
  };

  const fullListOfOptions = props.withFakeNoneOption
    ? [{ value: FAKEUUID, label: 'None/Unknown' }].concat(options)
    : options;

  const validateNewAffiliationFields = async () => {
    const aff = await loadAffiliation();
    if (aff) {
      const isNameValid = validateRequired(aff.name);
      setAffiliationNameValid(isNameValid);
      const isCityValid = validateRequired(aff.city);
      setAffiliationCityValid(isCityValid);
      const isStateValid = validateRequired(aff.state);
      setAffiliationStateValid(isStateValid);
      return (
        aff.status == AFFILIATIONSTATUS.ACTIVE ||
        (isNameValid.valid && isCityValid.valid && isStateValid.valid)
      );
    }
  };

  useImperativeHandle(ref, () => ({
    validateAffiliationForm() {
      return validateNewAffiliationFields();
    },

    getAffiliationObject() {
      return affiliationObject;
    },
  }));

  return (
    <Fragment>
      {!addNewVisibleStatus && (
        <Selectfield
          label={props.label}
          labelCount={props.labelCount}
          inputDisabled={props.inputDisabled}
          wrapperClass="medical-center"
          options={
            fullListOfOptions.find((item) => item.value === props.value) ? fullListOfOptions :
              optionsIncludingArchiving.find((item) => item.value === props.value) ? [...fullListOfOptions, optionsIncludingArchiving.find((item) => item.value === props.value)] :
                fullListOfOptions
          }
          inputValue={props.value}
          inputOnChange={props.onChange}
          placeholder={props.blankValue}
          withAddNew={props.withAddNew}
          onAddNewClick={addNew}
          useReactSelect
          useRegularSelect={false}
          blankValue=""
          isValid={props.isValid}
          errorMessage={props.errorMessage}
        />
      )}

      {addNewVisibleStatus && (
        <div className={addNewClassNames}>
          <h4>Add New {props.label.replace('Select a ', '')}</h4>

          {!props.inputDisabled && (
            <button
              id="remove-organization"
              className={removeClassNames}
              title="Remove"
              onClick={removeNewAffiliation}
              type='button'
            >
              Remove
            </button>
          )}

          <Textfield
            label="Name"
            inputDisabled={props.inputDisabled || (props.application?.status === APPLICATIONSTATUS.EXCEPTION || props.application?.status === APPLICATIONSTATUS.REQUESTED)}
            wrapperClass="medcenter-name"
            inputValue={affiliationObject?.name}
            inputOnChange={updateAffiliationNameChange}
            inputRequired={true}
            inputOnBlur={saveAffiliationNameChange}
            isValid={affiliationNameValid.valid}
            errorMessage={affiliationNameValid.message}
          />

          <Textfield
            label="City"
            inputDisabled={props.inputDisabled || (props.application?.status === APPLICATIONSTATUS.EXCEPTION || props.application?.status === APPLICATIONSTATUS.REQUESTED)}
            wrapperClass="medcenter-city"
            inputValue={affiliationObject?.city}
            inputOnChange={updateAffiliationCityChange}
            inputRequired={true}
            inputOnBlur={saveAffiliationCityChange}
            isValid={affiliationCityValid.valid}
            errorMessage={affiliationCityValid.message}
          />

          <StateField
            wrapperClass="medcenter-state"
            inputDisabled={props.inputDisabled || (props.application?.status === APPLICATIONSTATUS.EXCEPTION || props.application?.status === APPLICATIONSTATUS.REQUESTED)}
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

MedicalCenterAssociation.defaultProps = {
  value: '',
  onChange: () => { },
  label: 'Medical Center',
  labelCount: -1,
  inputDisabled: false,
  blankValue: 'Select Medical Center...',
  withAddNew: false,
  withFakeNoneOption: false,
  isValid: true,
  errorMessage: '',
  historyNoteTypeName: 'New Medical Center',
  application: null,
  refreshParentObject: () => { },
};

MedicalCenterAssociation.displayName = 'MedicalCenterAssociationBlock';

export default MedicalCenterAssociation;
