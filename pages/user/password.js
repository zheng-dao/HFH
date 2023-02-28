import { useRouter } from 'next/router';
import useAuth from '@contexts/AuthContext';
import PageHeader from '@components/PageHeader';
import IntroBlock from '@components/IntroBlock';
import UnauthenticatedSidebar from '@components/UnauthenticatedSidebar';
import config from '../../site.config';
import FisherhouseHeader from '@components/FisherhouseHeader';
import ForgotPasswordForm from '@components/ForgotPasswordForm';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { loadingInitial, isAuthenticated } = useAuth();

  const { email, code } = router.query;
  console.log('Email is', email);
  console.log('Code is', code);

  if (loadingInitial) {
    // The authentication hasn't loaded yet. Always return null.
    return null;
  } else if (isAuthenticated()) {
    router.push('/');
    return null;
  }

  return (
    <div className="page-container">
      <FisherhouseHeader title={config.title} description={config.description} />

      <PageHeader withMenu={false} />

      <IntroBlock withImage={true} />

      <section className="main-content full-bleed">
        <div className="container">
          <div className="content-columns">
            <UnauthenticatedSidebar />

            <div className="main-column">
              <ForgotPasswordForm email={email} code={code} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
