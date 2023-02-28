import useAuth from '@contexts/AuthContext';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';
import FisherhouseHeader from '@components/FisherhouseHeader';
import config from '@root/site.config';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import ProfileForm from '@components/ProfileForm';
import { DataStore } from 'aws-amplify';
import { User } from '@src/models';
import ProfileAdminSidebar from '@components/ProfileAdminSidebar';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { getUser } from '@src/graphql/queries';
import { updateUser, deleteUser } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';
import logger from '../../src/utils/logger';
import classNames from 'classnames';
import { USERSTATUS } from '@src/API';

export default function MyProfile(props) {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);

  // Profile fields.
  const [firstName, setFirstName] = useState('');
  const [middleIniitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [extension, setExtension] = useState('');
  const [affiliationType, setAffiliationType] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [receiveEmail, setReceiveEmails] = useState(true);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [message, setMessage] = useState('');

  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user != null && currentProfile == null) {
      const { uuid } = router.query;
      setLoadingCounter((prev) => prev + 1);
      if (shouldUseDatastore()) {
        DataStore.query(User, uuid).then((profile) => {
          setCurrentProfile(profile);
          setOriginalProfile(profile);
        });
      } else {
        API.graphql(graphqlOperation(getUser, { id: uuid }))
          .then((results) => {
            if (results.data.getUser != null) {
              setCurrentProfile(deserializeModel(User, results.data.getUser));
              setOriginalProfile(deserializeModel(User, results.data.getUser));
              setLoadingCounter((prev) => prev - 1);
            } else {
              router.replace('/');
            }
          })
          .catch(() => {
            setLoadingCounter((prev) => prev - 1);
          });
      }
    }
  }, [user, currentProfile, router.query, router]);

  const [role, setRole] = useState('');
  const [originalRole, setOriginalRole] = useState('');

  useEffect(() => {
    if (currentProfile?.username && role == '') {
      setLoadingCounter((prev) => prev + 1);
      getGroupMembership(currentProfile?.username)
        .then((result) => {
          if (result.Groups.length > 0) {
            setRole(result.Groups[0].GroupName);
            setOriginalRole(result.Groups[0].GroupName);
          } else {
            setRole('Liaisons');
            setOriginalRole('Liaisons');
          }
          setLoadingCounter((prev) => prev - 1);
        })
        .catch(() => {
          setLoadingCounter((prev) => prev - 1);
        });
    }
  }, [currentProfile?.username, role]);

  const getGroupMembership = async (username) => {
    const apiName = 'AdminQueries';
    const path = '/listGroupsForUser';
    const initOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      queryStringParameters: {
        username: username,
      },
    };

    return await API.get(apiName, path, initOptions);
  };

  const updateProfileField = (field, value) => {
    if (field == 'affiliation_type') {
      setCurrentProfile(
        User.copyOf(currentProfile, (u) => {
          u[field] = value;
          u.AffiliationID = null;
        })
      );
    } else {
      setCurrentProfile(
        User.copyOf(currentProfile, (u) => {
          u[field] = value;
        })
      );
    }
  };

  const updateRole = (e) => {
    setRole(e?.value);
  };

  const removeRole = async (username, roleToRemove) => {
    const apiName = 'AdminQueries';
    const path = '/removeUserFromGroup';
    const initOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: username,
        groupname: roleToRemove,
      },
    };
    await API.post(apiName, path, initOptions);
    return;
  };

  const addRole = async (username, roleToAdd) => {
    const apiName = 'AdminQueries';
    const path = '/addUserToGroup';
    const initOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: username,
        groupname: roleToAdd,
      },
    };
    await API.post(apiName, path, initOptions);
    return;
  };

  const saveRole = async (username, roleToAdd) => {
    let roleToRemove = '';
    if (roleToAdd == 'Liaisons') {
      roleToRemove = 'Administrators';
    } else {
      roleToRemove = 'Liaisons';
    }
    await removeRole(username, roleToRemove);
    await addRole(username, roleToAdd);
  };

  const saveProfile = async (newProfile) => {
    const isExpirationDateToday =
      newProfile.expiration_date != null
        ? new Date(newProfile.expiration_date) <= new Date()
        : false;
    const profileToSave = User.copyOf(originalProfile, (u) => {
      (u.first_name = newProfile.first_name),
        (u.middle_initial = newProfile.middle_initial),
        (u.last_name = newProfile.last_name),
        (u.job = newProfile.job),
        (u.email = newProfile.email),
        (u.telephone = newProfile.telephone),
        (u.extension = newProfile.extension),
        (u.affiliation_type = newProfile.affiliation_type),
        (u.AffiliationID = newProfile.AffiliationID),
        (u.receive_emails = newProfile.receive_emails),
        (u.pending_email =
          currentProfile.username != originalProfile.username
            ? currentProfile.username
            : newProfile?.pending_email),
        (u.status = isExpirationDateToday ? USERSTATUS.INACTIVE : newProfile.status);
      u.expiration_date = newProfile.expiration_date;
    });
    if (shouldUseDatastore()) {
      return await DataStore.save(profileToSave)
        .then((profile) => {
          setCurrentProfile(profile);
          setOriginalProfile(profile);
          return true;
        })
        .then(async () => {
          await saveRole(currentProfile.username, role);
          setOriginalRole(role);
          return true;
        })
        .catch((error) => {
          logger(error);
          return false;
        });
    } else {
      const {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        Affiliation,
        owner,
        username,
        ...objectToSave
      } = profileToSave;
      try {
        await saveRole(originalProfile.username, role);
        setOriginalRole(role);
      } catch (err) {
        setMessage("There was an error saving the user's profile.");
      }
      if (currentProfile.username != originalProfile.username) {
        // Update email address in Cognito.
        const owner = currentProfile.owner.split('::');
        const apiName = 'AdminQueries';
        const path = '/adminUpdateUserAttributes';
        const initOptions = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
          },
          body: {
            username: owner[0],
            attributes: [
              {
                Name: 'email',
                Value: currentProfile.username,
              },
              {
                Name: 'email_verified',
                Value: 'false',
              },
            ],
          },
        };
        const user = await API.post(apiName, path, initOptions);
      }
      return await API.graphql(graphqlOperation(updateUser, { input: objectToSave }))
        .then((results) => {
          setCurrentProfile(deserializeModel(User, results.data.updateUser));
          setOriginalProfile(deserializeModel(User, results.data.updateUser));
          return true;
        })
        .catch((err) => {
          logger(err);
          return false;
        });
    }
  };

  const deleteProfile = async (id) => {
    return await API.graphql(graphqlOperation(deleteUser, { input: { id } }))
      .then((results) => {
        return true;
      })
      .catch((err) => {
        logger(err);
        return false;
      });
  };

  const getContentHeaderTitle = useCallback(() => {
    if (originalRole == 'Administrators') {
      return 'Admin Profile';
    } else {
      return 'Liaison Profile';
    }
  }, [originalRole]);

  const mainContentClasses = classNames('main-content', {
    loading: loadingCounter > 0,
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

      <section className={mainContentClasses}>
        <div className="container">
          <header className="content-header">
            <h1>{getContentHeaderTitle()}</h1>
          </header>

          <div className="content-columns">
            <ProfileAdminSidebar
              profile={currentProfile}
              role={role}
              updateProfile={updateProfileField}
              updateRole={updateRole}
            />

            <div className="main-column">
              <ProfileForm
                profile={currentProfile}
                updateProfile={updateProfileField}
                saveProfile={saveProfile}
                deleteProfile={deleteProfile}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
