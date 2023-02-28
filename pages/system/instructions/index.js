import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { ConfigurationSetting } from '@src/models';
import striptags from 'striptags';
import SubmitButton from '@components/Inputs/SubmitButton';
import useDialog from '@contexts/DialogContext';
import Textareafield from '@components/Inputs/Textareafield';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, graphqlOperation } from 'aws-amplify';
import { listConfigurationSettings } from '@src/graphql/queries';
import { createConfigurationSetting, updateConfigurationSetting } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import classNames from 'classnames';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function UserInstructionsEditPage() {
  const { setMessage } = useDialog();
  const router = useRouter();
  const { setIsWaiting } = useButtonWait();

  const [entity, setEntity] = useState(null);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const CONFIG_NAME = 'user_login_instructions';

  useEffect(() => {
    setLoadingCounter((prev) => prev + 1);
    if (shouldUseDatastore()) {
      DataStore.query(ConfigurationSetting, (c) => c.name('eq', CONFIG_NAME)).then((item) => {
        if (item.length > 0) {
          setEntity(item[0]);
        } else {
          DataStore.save(
            new ConfigurationSetting({
              name: CONFIG_NAME,
            })
          ).then((item) => {
            setEntity(item);
          });
        }
      });
    } else {
      API.graphql(
        graphqlOperation(listConfigurationSettings, { filter: { name: { eq: CONFIG_NAME } } })
      )
        .then((results) => {
          if (results.data.listConfigurationSettings.items.length > 0) {
            setEntity(
              deserializeModel(
                ConfigurationSetting,
                results.data.listConfigurationSettings.items[0]
              )
            );
          } else {
            API.graphql(
              graphqlOperation(createConfigurationSetting, { input: { name: CONFIG_NAME } })
            ).then((item) => {
              setEntity(
                deserializeModel(ConfigurationSetting, item.data.createConfigurationSetting)
              );
            });
          }
        })
        .finally(() => setLoadingCounter((prev) => prev - 1));
    }
  }, []);

  const updateEntityValue = (e) => {
    setEntity(
      ConfigurationSetting.copyOf(entity, (updated) => {
        updated.value = e.target.value;
      })
    );
  };

  const saveEntity = (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    const newConfigurationSetting = ConfigurationSetting.copyOf(entity, (updated) => {
      updated.value = striptags(entity.value, ['a', 'p', 'em', 'strong']);
    });
    if (shouldUseDatastore()) {
      DataStore.save(newConfigurationSetting).then((item) => {
        setEntity(item);
        setMessage('User Instructions saved.');
      });
    } else {
      const { createdAt, updatedAt, _deleted, _lastChangedAt, ...objectToSave } =
        newConfigurationSetting;
      API.graphql(graphqlOperation(updateConfigurationSetting, { input: { ...objectToSave } }))
        .then((result) => {
          setEntity(deserializeModel(ConfigurationSetting, result.data.updateConfigurationSetting));
          setMessage('User Instructions saved.');
        })
        .catch(() => {
          setMessage('There was an error saving the User Instructions.');
        })
        .finally(() => {
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  };

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();

  const appPaneClassNames = classNames('primary', 'app-pane', {
    loading: loadingCounter > 0 || entity == null,
  });

  const appControlClassNames = classNames('app-controls', {
    loading: loadingCounter > 0 || entity == null,
  });

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  } else if (!isAdministrator()) {
    // Only administrators should be able to access system paths.
    router.replace('/');
    return null;
  }

  return (
    <div className="page-container">
      <FisherhouseHeader title={config.title} description={config.description} />

      <PageHeader />

      <IntroBlock />

      <section className="main-content">
        <div className="container">
          <PageTitle prefix="System / " title="User Instructions" />

          <div className="content-columns">
            <SystemSidebar />

            <div className="main-column">
              <section className={appPaneClassNames}>
                <form id="system-pane">
                  <h2>Edit User Instructions</h2>

                  <Textareafield
                    label="Login"
                    inputValue={entity?.value}
                    inputOnChange={updateEntityValue}
                  />
                </form>
              </section>

              <div className={appControlClassNames}>
                <SubmitButton
                  inputValue="Save"
                  inputClass="save"
                  inputOnClick={saveEntity}
                  inputDisabled={buttonDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
