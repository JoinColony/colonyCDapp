import { ApolloProvider } from '@apollo/client';
import { PostHogProvider } from 'posthog-js/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import AnalyticsContextProvider from '~context/AnalyticsContext/AnalyticsContextProvider.tsx';
import { getContext, ContextModule } from '~context/index.ts';
import RouteTracker from '~routes/RouteTracker.tsx';

import eventsMessages from './i18n/en-events.ts';
import motionStatesMessages from './i18n/en-motion-states.ts';
import systemMessages from './i18n/en-system-messages.ts';
import messages from './i18n/en.json';
import Routes from './routes/index.ts';

interface Props {
  store: any;
}

const posthogConfig = {
  apiKey: import.meta.env.POSTHOG_KEY,
  options: {
    // eslint-disable-next-line camelcase
    api_host: import.meta.env.POSTHOG_HOST,
  },
};

if (__COMMIT_HASH__) {
  // eslint-disable-next-line no-console
  console.log(`Running on ${__COMMIT_HASH__}`);
}

const Entry = ({ store }: Props) => {
  const apolloClient = getContext(ContextModule.ApolloClient);

  return (
    <PostHogProvider {...posthogConfig}>
      <IntlProvider
        locale="en"
        defaultLocale="en"
        messages={{
          ...messages,
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
    </PostHogProvider>
  );
};

export default Entry;
