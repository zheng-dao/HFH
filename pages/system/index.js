import FisherhouseHeader from '@components/FisherhouseHeader';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import config from '@root/site.config';
import PageTitle from '@components/PageTitle';
import SystemSidebar from '@components/SystemSidebar';
import useAuth from '@contexts/AuthContext';
import { useRouter } from 'next/router';
import SystemLandingContent from '../../src/components/SystemLandingContent';

export default function SystemPage() {
  const { user, loadingInitial, isAuthenticated, isAdministrator } = useAuth();
  const router = useRouter();

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
          <PageTitle title="System" />

          <SystemLandingContent />
        </div>
      </section>
    </div>
  );
}
