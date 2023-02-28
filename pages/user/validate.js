import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import useDialog from '@contexts/DialogContext';

export default function ValidateEmailPage() {
  const router = useRouter();

  const { email, code } = router.query;
  const { isAuthenticated, logout } = useAuth();
  const { setMessage } = useDialog();
  const [hasAttemptedReset, setHasAttemptedReset] = useState(false);

  useEffect(() => {
    if (router.isReady && !hasAttemptedReset) {
      setHasAttemptedReset(true);
      Auth.currentAuthenticatedUser().then((user) => {
        console.log('User is', user);
        API.post('Utils', '/user/email/confirm', {
          body: {
            token: user?.signInUserSession?.accessToken?.jwtToken,
            code,
            email,
          },
        })
          .then((response) => {
            console.log('Response is', response);
            setMessage(
              'Your email address has been updated. Your new email will be reflected on your profile, and should be used for logging in moving forward.'
            );
            logout()
              .then(() => {
                localStorage.removeItem('search-params');
                router.push('/user');
              })
              .catch((e) => {
                console.log(e);
                localStorage.removeItem('search-params');
                router.push('/user');
              });
          })
          .catch((error) => {
            console.log(error.response);
            setMessage(
              'There was an error verifying your email address. If you received more than one verification message, please try the latest link. Otherwise, try generating a new link by changing your email address again. ' +
                (error?.response?.data || '')
            );
            router.push('/');
          });
      });
    }
  }, [router.isReady, code, router, setMessage, email, hasAttemptedReset, logout]);

  if (!isAuthenticated() && !hasAttemptedReset) {
    setMessage('Please login before attempting to verify your email address.');
    router.push('/');
  }

  return null;
}
