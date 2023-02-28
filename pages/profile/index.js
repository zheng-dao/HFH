import useAuth from '@contexts/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import FisherhouseHeader from '@components/FisherhouseHeader';
import config from '@root/site.config';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import ProfileForm from '@components/ProfileForm';
import UnauthenticatedProfileSidebar from '@src/components/UnauthenticatedProfileSidebar';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '@src/models';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getUser } from '@src/graphql/queries';
import { updateUser, deleteUser } from '@src/graphql/mutations';
import { deserializeModel, serializeModel } from '@aws-amplify/datastore/ssr';
import useDialog from '@contexts/DialogContext';
// import { onDeleteUser } from '@src/graphql/subscriptions'
import { onUpdateUser } from '../../src/customQueries/subscribeUserUpdates';

export default function MyProfile(props) {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const { user, profile, loadingInitial, isAuthenticated, isAdministrator, setProfile, setUser } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadUser = (user_id) => {
      API.graphql(
        graphqlOperation(getUser, {
          id: user_id,
        })
      ).then((res) => {
        const u_model = deserializeModel(User, res.data.getUser);
        setCurrentProfile(u_model);
        setOriginalProfile(u_model);
      });
    };

    if (profile?.id) {
      loadUser(profile.id);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (currentProfile != null) {
      const update_user_subscription = API.graphql(
        graphqlOperation(
          onUpdateUser
          // {
          //   owner: user.username
          // }
        )
      ).subscribe({
        next: (u) => {
          if (u.value.data.onUpdateUser.id == currentProfile.id) {
            setCurrentProfile(deserializeModel(User, u.value.data.onUpdateUser));
            setOriginalProfile(deserializeModel(User, u.value.data.onUpdateUser));
            Auth.currentAuthenticatedUser({ bypassCache: true }).then((u) => {
              console.log('New user is', u);
              setUser(u);
            });
          }
        },
      });

      return () => update_user_subscription.unsubscribe();
    }
  }, [currentProfile, user?.username, setUser]);

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

  const saveProfile = async (newProfile) => {
    const profileToSave = User.copyOf(originalProfile, (u) => {
      (u.first_name = newProfile.first_name),
        (u.middle_initial = newProfile.middle_initial),
        (u.last_name = newProfile.last_name),
        (u.job = newProfile.job),
        (u.email = newProfile.email),
        (u.telephone = newProfile.telephone),
        (u.extension = newProfile.extension),
        (u.pending_email =
          currentProfile.username != originalProfile.username
            ? currentProfile.username
            : newProfile?.pending_email),
        (u.affiliation_type = newProfile.affiliation_type),
        (u.AffiliationID = newProfile.AffiliationID),
        (u.receive_emails = newProfile.receive_emails),
        (u.status = newProfile.status);
    });
    if (shouldUseDatastore()) {
      return await DataStore.save(profileToSave)
        .then((profile) => {
          setCurrentProfile(profile);
          setOriginalProfile(profile);
          return true;
        })
        .catch((error) => {
          console.log('Error saving user', error);
          return false;
        });
    } else {
      let {
        createdAt,
        updatedAt,
        _deleted,
        _lastChangedAt,
        owner,
        Affiliation,
        username,
        ...objectToSave
      } = profileToSave;
      if (currentProfile.username != originalProfile.username) {
        // Update email address in Cognito.
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
          email: currentProfile.username,
        });
      }
      return await API.graphql({
        query: updateUser,
        variables: {
          input: Object.fromEntries(Object.entries(objectToSave).filter(([_, v]) => v != null)),
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      })
        .then((results) => {
          setCurrentProfile(deserializeModel(User, results.data.updateUser));
          setOriginalProfile(deserializeModel(User, results.data.updateUser));
          setProfile(deserializeModel(User, results.data.updateUser));
          return true;
        })
        .catch((err) => {
          console.log('Error saving user', err);
          return false;
        });
    }
  };

  const deleteProfile = async (id) => {
    return await API.graphql({
      query: deleteUser,
      variables: {
        input: { id },
      },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })
      .then((results) => {
        router.push('/user');
        return true;
      })
      .catch((err) => {
        console.log('Error saving user', err);
        return false;
      });
  };

  const getContentHeaderTitle = () => {
    if (isAdministrator()) {
      return 'Admin Profile';
    } else {
      return 'Liaison Profile';
    }
  };

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (!isAuthenticated()) {
    // All unauthenticated users go to the /user page for signup/login.
    router.push('/user');
    return null;
  }

  return (
    <div className="page-container">
      <FisherhouseHeader title={config.title} description={config.description} />

      <PageHeader />

      <IntroBlock />

      <section className="main-content">
        <div className="container">
          <header className="content-header">
            <h1>{getContentHeaderTitle()}</h1>
          </header>

          <div className="content-columns">
            <UnauthenticatedProfileSidebar />

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
