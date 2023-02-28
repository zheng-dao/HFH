const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  async headers() {
    return [
      {
        source: '/application/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, must-revalidate, private',
          },
          {
            key: 'pragma',
            value: 'no-cache',
          },
          {
            key: 'expires',
            value: 'Wed, 21 Nov 1990 17:21:00 GMT',
          },
        ],
      },
      {
        source: '/profile/:slug*',
        headers: [
          {
            key: 'cache-control',
            value: 'no-cache, must-revalidate, private',
          },
          {
            key: 'pragma',
            value: 'no-cache',
          },
          {
            key: 'expires',
            value: 'Wed, 21 Nov 1990 17:21:00 GMT',
          },
        ],
      },
      {
        source: '/system/:slug*',
        headers: [
          {
            key: 'cache-control',
            value: 'no-cache, must-revalidate, private',
          },
          {
            key: 'pragma',
            value: 'no-cache',
          },
          {
            key: 'expires',
            value: 'Wed, 21 Nov 1990 17:21:00 GMT',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'cache-control',
            value: 'no-cache, must-revalidate, private',
          },
          {
            key: 'pragma',
            value: 'no-cache',
          },
          {
            key: 'expires',
            value: 'Wed, 21 Nov 1990 17:21:00 GMT',
          },
        ],
      },
      {
        source: '/reconciliation',
        headers: [
          {
            key: 'cache-control',
            value: 'no-cache, must-revalidate, private',
          },
          {
            key: 'pragma',
            value: 'no-cache',
          },
          {
            key: 'expires',
            value: 'Wed, 21 Nov 1990 17:21:00 GMT',
          },
        ],
      },
      {
        source: '/users',
        headers: [
          {
            key: 'cache-control',
            value: 'no-cache, must-revalidate, private',
          },
          {
            key: 'pragma',
            value: 'no-cache',
          },
          {
            key: 'expires',
            value: 'Wed, 21 Nov 1990 17:21:00 GMT',
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);

module.exports = moduleExports;
