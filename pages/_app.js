import '@styles/styles.scss';
import Amplify, { AuthModeStrategyType } from 'aws-amplify';
import awsconfig from '@src/aws-exports';
import AppContextProvider from '@contexts/AppContextProvider';
import Dialog from '@src/components/Dialog';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

Amplify.configure({
  ...awsconfig,
  DataStore: {
    AuthModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
});

function HotelsForHeroesApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      {process.env.NEXT_PUBLIC_RUM_SCRIPT && (
        <Head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_RUM_SCRIPT }}
          />
        </Head>
      )}
      <Component {...pageProps} />
      <Dialog />
      <Toaster position="top-right" />
    </AppContextProvider>
  );
}

export default HotelsForHeroesApp;
