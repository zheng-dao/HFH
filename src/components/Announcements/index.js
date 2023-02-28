import useAuth from '@contexts/AuthContext';
import { useState, useEffect, Fragment } from 'react';
import Textfield from '@components/Inputs/Textfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import { DataStore } from '@aws-amplify/datastore';
import { ConfigurationSetting } from '@src/models';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listConfigurationSettings } from '@src/graphql/queries';
import { createConfigurationSetting, updateConfigurationSetting } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
import classNames from 'classnames';

export default function Announcements() {
  const MAINANNOUNCEMENTKEY = 'main_announcement';
  const SECONDARYANNOUNCEMENTKEY = 'secondary_announcement';

  const { isAdministrator } = useAuth();
  const { setMessage } = useDialog();

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [mainAnnouncement, setMainAnnouncement] = useState('');
  const [secondaryAnnouncement, setSecondaryAnnouncement] = useState('');
  const [loadingCounter, setLoadingCounter] = useState(0);

  const updateMainAnnouncement = (e) => {
    setMainAnnouncement(
      ConfigurationSetting.copyOf(mainAnnouncement, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const updateSecondaryAnnouncement = (e) => {
    setSecondaryAnnouncement(
      ConfigurationSetting.copyOf(secondaryAnnouncement, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const notifyNewAnnouncement = async () => {
    let results = await API.post('Utils', '/utils/notify-announcement', {
      body: {
        main_announcement: mainAnnouncement.value,
        secondary_announcement: secondaryAnnouncement.value,
      },
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    });
  };

  const saveAnnouncements = (e) => {
    e.preventDefault();
    setIsInEditMode(!isInEditMode);
    if (shouldUseDatastore()) {
      DataStore.save(mainAnnouncement);
      DataStore.save(secondaryAnnouncement);
    } else {
      if (typeof mainAnnouncement.id == 'string') {
        // Existing main announcement, use an update
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } =
          mainAnnouncement;
        API.graphql(graphqlOperation(updateConfigurationSetting, { input: objectToSave }))
          .then((results) => {
            setMainAnnouncement(
              deserializeModel(ConfigurationSetting, results.data.updateConfigurationSetting)
            );
          })
          .catch((err) => {
            console.log('Caught error', err);
            setMessage(
              'There was an error saving the announcement. Please reload the page and try again.'
            );
          });
      } else {
        // New main announcement
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } =
          mainAnnouncement;
        API.graphql(graphqlOperation(createConfigurationSetting, { input: objectToSave })).then(
          (results) => {
            if (
              results?.data?.createConfigurationSetting?.items &&
              results?.data?.createConfigurationSetting?.items.length > 0
            ) {
              setMainAnnouncement(
                deserializeModel(ConfigurationSetting, results.data.createConfigurationSetting)
              );
            }
          }
        );
      }
      if (typeof secondaryAnnouncement.id == 'string') {
        // Existing secondary announcement, use an update
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } =
          secondaryAnnouncement;
        API.graphql(graphqlOperation(updateConfigurationSetting, { input: objectToSave }))
          .then((results) => {
            setSecondaryAnnouncement(
              deserializeModel(ConfigurationSetting, results.data.updateConfigurationSetting)
            );
          })
          .catch((err) => {
            console.log('Caught error', err);
            setMessage(
              'There was an error saving the announcement. Please reload the page and try again.'
            );
          });
      } else {
        // New secondary announcement
        const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } =
          secondaryAnnouncement;
        API.graphql(graphqlOperation(createConfigurationSetting, { input: objectToSave })).then(
          (results) => {
            if (
              results?.data?.createConfigurationSetting?.items &&
              results?.data?.createConfigurationSetting?.items.length > 0
            ) {
              setSecondaryAnnouncement(
                deserializeModel(ConfigurationSetting, results.data.createConfigurationSetting)
              );
            }
          }
        );
      }
    }
    if (confirm('Announcement saved. Do you want to email this updated announcement to users?')) {
      notifyNewAnnouncement();
    }
  };

  useEffect(() => {
    if (shouldUseDatastore()) {
      setLoadingCounter((prev) => prev + 1);
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', MAINANNOUNCEMENTKEY))
        .then((items) => {
          if (items.length == 0) {
            setMainAnnouncement(
              new ConfigurationSetting({
                value: '',
                name: MAINANNOUNCEMENTKEY,
              })
            );
          } else {
            setMainAnnouncement(items[0]);
          }
        })
        .finally(() => {
          setLoadingCounter((prev) => prev - 1);
        });
    } else {
      setLoadingCounter((prev) => prev + 1);
      API.graphql(
        graphqlOperation(listConfigurationSettings, {
          filter: { name: { eq: MAINANNOUNCEMENTKEY } },
        })
      )
        .then((results) => {
          if (
            results?.data?.listConfigurationSettings?.items &&
            results?.data?.listConfigurationSettings?.items.length > 0
          ) {
            setMainAnnouncement(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            setMainAnnouncement(
              new ConfigurationSetting({
                value: '',
                name: MAINANNOUNCEMENTKEY,
              })
            );
          }
        })
        .finally(() => {
          setLoadingCounter((prev) => prev - 1);
        });
    }
  }, []);

  useEffect(() => {
    if (shouldUseDatastore()) {
      setLoadingCounter((prev) => prev + 1);
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', SECONDARYANNOUNCEMENTKEY))
        .then((items) => {
          if (items.length == 0) {
            setSecondaryAnnouncement(
              new ConfigurationSetting({
                value: '',
                name: SECONDARYANNOUNCEMENTKEY,
              })
            );
          } else {
            setSecondaryAnnouncement(items[0]);
          }
        })
        .finally(() => {
          setLoadingCounter((prev) => prev - 1);
        });
    } else {
      setLoadingCounter((prev) => prev + 1);
      API.graphql(
        graphqlOperation(listConfigurationSettings, {
          filter: { name: { eq: SECONDARYANNOUNCEMENTKEY } },
        })
      )
        .then((results) => {
          if (
            results?.data?.listConfigurationSettings?.items &&
            results?.data?.listConfigurationSettings?.items.length > 0
          ) {
            setSecondaryAnnouncement(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            setSecondaryAnnouncement(
              new ConfigurationSetting({
                value: '',
                name: SECONDARYANNOUNCEMENTKEY,
              })
            );
          }
        })
        .finally(() => {
          setLoadingCounter((prev) => prev - 1);
        });
    }
  }, []);

  const announcmentsListClassName = classNames({
    loading: loadingCounter > 0,
  });

  if (isAdministrator()) {
    return (
      <div className="announcements">
        <h2>
          Announcements
          {!isInEditMode && (
            <button className="update" onClick={() => setIsInEditMode(!isInEditMode)}>
              Edit
            </button>
          )}
        </h2>
        {isInEditMode && (
          <Fragment>
            <ul>
              <li>
                <Textfield
                  label="Main System Announcement Text"
                  inputValue={mainAnnouncement?.value}
                  inputOnChange={updateMainAnnouncement}
                />
              </li>
              <li className="secondary">
                <Textfield
                  label="Secondary System Announcement Text"
                  inputValue={secondaryAnnouncement?.value}
                  inputOnChange={updateSecondaryAnnouncement}
                />
              </li>
            </ul>
            <SubmitButton inputValue="Save" inputClass="save" inputOnClick={saveAnnouncements} />
          </Fragment>
        )}
        {!isInEditMode && (
          <Fragment>
            <ul className={announcmentsListClassName}>
              <li>{mainAnnouncement?.value}</li>
              <li className="secondary">{secondaryAnnouncement?.value}</li>
            </ul>
          </Fragment>
        )}
      </div>
    );
  } else {
    if (mainAnnouncement?.value) {
      return (
        <div className="announcements">
          <h2>Announcements</h2>

          <ul className={announcmentsListClassName}>
            <li>{mainAnnouncement?.value}</li>
            <li className="secondary">{secondaryAnnouncement?.value}</li>
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}
