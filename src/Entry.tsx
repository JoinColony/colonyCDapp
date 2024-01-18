import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { getContext, ContextModule } from '~context';
import { AnalyticsContextProvider } from '~context/AnalyticsContext';
import RouteTracker from '~routes/RouteTracker';

import actionMessages from './i18n/en-actions';
import eventsMessages from './i18n/en-events';
import motionStatesMessages from './i18n/en-motion-states';
import systemMessages from './i18n/en-system-messages';
import messages from './i18n/en.json';
import Routes from './routes';

// @ts-ignore
if (!Intl.RelativeTimeFormat) {
  /* eslint-disable global-require */
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/locale-data/en');
  /* eslint-enable global-require */
}

interface Props {
  store: any;
}

/**
 * @NOTE Coming from webpack DefinePlugin, only on production
 *
 * It became apparent that we need a "live" way to check what commit we're running on
 * while debugging issues strait into production
 */
declare const PROD_COMMIT_HASH: string | undefined;

if (PROD_COMMIT_HASH) {
  // eslint-disable-next-line no-console
  console.log(`Running on ${PROD_COMMIT_HASH}`);
}

const Entry = ({ store }: Props) => {
  const apolloClient = getContext(ContextModule.ApolloClient);

  return (
    <IntlProvider
      locale="en"
      defaultLocale="en"
      messages={{
        ...messages,
        ...actionMessages,
        ...eventsMessages,
        ...systemMessages,
        ...motionStatesMessages,
      }}
    >
      <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
          <HelmetProvider>
            <AnalyticsContextProvider>
              <Router>
                <RouteTracker />
                <Routes />
              </Router>
            </AnalyticsContextProvider>
          </HelmetProvider>
        </ReduxProvider>
      </ApolloProvider>
    </IntlProvider>
  );
};

export default Entry;
