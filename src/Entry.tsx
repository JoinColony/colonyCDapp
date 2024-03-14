import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { AnalyticsContextProvider } from '~context/AnalyticsContext/index.ts';
import { getContext, ContextModule } from '~context/index.ts';
import RouteTracker from '~routes/RouteTracker.tsx';

import actionMessages from './i18n/en-actions.ts';
import eventsMessages from './i18n/en-events.ts';
import motionStatesMessages from './i18n/en-motion-states.ts';
import systemMessages from './i18n/en-system-messages.ts';
import messages from './i18n/en.json';
import Routes from './routes/index.ts';

interface Props {
  store: any;
}

if (import.meta.env.VITE_PROD_COMMIT_HASH) {
  // eslint-disable-next-line no-console
  console.log(`Running on ${import.meta.env.VITE_PROD_COMMIT_HASH}`);
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
