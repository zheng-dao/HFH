import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Auth, DataStore, Hub, graphqlOperation, API } from 'aws-amplify';
import CognitoUser from 'aws-amplify';
import { USERSTATUS } from '@src/API';
import { User } from '@src/models';
import lookupUser from '@utils/lookupUser';
import dataStoreEnum from '@utils/dataStoreEnum';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';
import { createUser } from '@src/graphql/mutations';
import { deserializeModel } from '@aws-amplify/datastore/ssr';

export enum UserType {
  Liaison = 'liaison',
  Administrator = 'administrator',
}

interface AuthContextType {
  user?: any;
  loading: boolean;
  loadingInitial: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleInitial: string
  ) => void;
  createProfile: () => void;
  logout: () => void;
  isLiaison: () => boolean;
  isAdministrator: () => boolean;
  isAuthenticated: () => boolean;
  profile?: User;
  setProfile: (user: User) => void;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType>({} as any as AuthContextType);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [profile, setProfile] = useState<User>();
  const [dataState, setDataState] = useState(dataStoreEnum.UNKNOWN);

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  });

  useEffect(() => {
    const listener = Hub.listen('datastore', async (hubData) => {
      const { event, data } = hubData.payload;
      if (event == 'ready') {
        setDataState(dataStoreEnum.READY);
      } else if (event == 'storageSubscribed') {
        setDataState(dataStoreEnum.PENDING);
      }
    });

    return listener;
  }, [user]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((u) => setUser(u))
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoadingInitial(false));
  }, []);

  useEffect(() => {
    console.log('User is', user);
    if (user != null) {
      console.log('User is', user);
      lookupUser(user.attributes.email).then((prof) => {
        if (prof.length == 0) {
          createProfile();
        } else {
          setProfile(prof[0]);
        }
      });
    }
  }, [user, dataState]);

  function createProfile() {
    console.log('User is', user);
    if (shouldUseDatastore()) {
      DataStore.save(
        new User({
          username: user.attributes.email,
          first_name: user.attributes.given_name,
          middle_initial: user.attributes.middle_name,
          last_name: user.attributes.family_name,
          status: USERSTATUS.DRAFT,
          receive_emails: true,
        }),
        (u) => u.username('ne', user.attributes.email)
      ).then((prof) => setProfile(prof));
    } else {
      API.graphql(
        graphqlOperation(createUser, {
          input: {
            username: user.attributes.email,
            first_name: user.attributes.given_name,
            middle_initial: user.attributes.middle_name,
            last_name: user.attributes.family_name,
            status: USERSTATUS.DRAFT,
            receive_emails: true,
          },
        })
        // @ts-ignore
      ).then((results) => {
        // @ts-ignore
        setProfile(deserializeModel(User, results.data.createUser));
      });
    }
  }

  // Checks if the user is a liaison.
  function isLiaison() {
    if (user == null) return false;
    else {
      const session = user.getSignInUserSession();
      if (session != null) {
        const accessToken = session.getAccessToken();
        if (accessToken != null) {
          const payload = accessToken.decodePayload();
          if (typeof payload['cognito:groups'] !== 'undefined')
            return payload['cognito:groups'].includes('Liaisons');
          else return false;
        } else return false;
      } else return false;
    }
    return false;
  }

  // Checks if the user is an Administrator.
  function isAdministrator() {
    if (user == null) return false;
    else {
      const session = user.getSignInUserSession();
      if (session != null) {
        const accessToken = session.getAccessToken();
        if (accessToken != null) {
          const payload = accessToken.decodePayload();
          if (typeof payload['cognito:groups'] !== 'undefined')
            return payload['cognito:groups'].includes('Administrators');
          else return false;
        } else return false;
      } else return false;
    }
    return false;
  }

  function isAuthenticated() {
    if (isAdministrator() || isLiaison()) return true;
    else if (user !== null) return true;
    else return false;
  }

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  function login(email: string, password: string) {
    setLoading(true);

    return Auth.signIn(email, password)
      .then((u) => {
        if (shouldUseDatastore()) {
          console.log('Starting DataStore.');
          DataStore.start();
        }
        if (u?.challengeName == 'NEW_PASSWORD_REQUIRED') {
          alert(
            'Your account password has expired and requires an administrator to reset your account. Please contact us for further assistance.'
          );
        } else {
          setUser(u);
        }
      })
      .catch((err) => Promise.reject(err))
      .finally(() => setLoading(false));
  }

  // Sends sign up details to the server. On success we just apply
  // the created user to the state.
  function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleInitial: string
  ) {
    setLoading(true);

    return (
      Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          family_name: lastName,
          given_name: firstName,
          middle_name: middleInitial,
        },
        validationData: [], // optional
      })
        // .then((u) => {
        //   setUser(u.user);
        // })
        .catch((err) => Promise.reject(err))
        .finally(() => setLoading(false))
    );
  }

  // Call the logout endpoint and then remove the user
  // from the state.
  function logout() {
    return Auth.signOut().then(() => {
      setUser(null);
      setProfile(null);
      return;
    });
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      loadingInitial,
      error,
      login,
      signUp,
      logout,
      isLiaison,
      isAdministrator,
      isAuthenticated,
      createProfile,
      setProfile,
      setUser,
    }),
    [user, profile, loading, loadingInitial, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}
