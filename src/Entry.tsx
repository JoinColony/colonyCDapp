import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { getContext, ContextModule } from '~context/index.ts';
import { uiEvents } from '~uiEvents/index.ts';

import actionMessages from './i18n/en-actions.ts';
import eventsMessages from './i18n/en-events.ts';
import motionStatesMessages from './i18n/en-motion-states.ts';
import systemMessages from './i18n/en-system-messages.ts';
import messages from './i18n/en.json';
import Routes from './routes/index.ts';

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
  console.log(
    `Running on experimental-${PROD_COMMIT_HASH} (based from 5ab06d7ed1201d402f82ac64a3c0f9002811d80a)`,
  );
}

/*
 * @NOTE This can be called regardless, as no direct keys or settings required
 * Everything goes through the auth proxy, so it's responsible for ensuring
 * this service is correctly connected to it's host
 *
 * But even it that's not true, the app will still run, you'll just get an 404
 * from the auth proxy informing you that the service is not available
 */
uiEvents.load();

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
            <Router>
              <Routes />
            </Router>
          </HelmetProvider>
        </ReduxProvider>
      </ApolloProvider>
    </IntlProvider>
  );
};

export default Entry;
