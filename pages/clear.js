import { DataStore } from 'aws-amplify';
import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import { shouldUseDatastore } from '@utils/shouldUseDatastore';

export default function ClearPage(props) {
  if (shouldUseDatastore()) {
    DataStore.clear();
  }

  const { logout } = useAuth();
  logout();
  const router = useRouter();
  router.push('/user');

  return null;
}
