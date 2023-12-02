import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from '@apollo/client';

import { getContext, ContextModule } from '~context';
import {
  getAuthExpirationTimeout,
  deauthenticateWallet,
  authenticateWallet,
} from '~auth';

import messages from './i18n/en.json';
import actionMessages from './i18n/en-actions';
import eventsMessages from './i18n/en-events';
import systemMessages from './i18n/en-system-messages';
import motionStatesMessages from './i18n/en-motion-states';
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

const Entry = ({ store }: Props) => {
  const apolloClient = getContext(ContextModule.ApolloClient);

  /*
   * @NOTE Attempt to trigger a auth refresh once the cookie expires
   */
  useEffect(() => {
    let timeoutId;
    const handleAuthExpiration = async () => {
      const expirationTimeout = await getAuthExpirationTimeout();
      if (expirationTimeout) {
        timeoutId = setTimeout(async () => {
          try {
            /*
             * @TODO This might throw a HTTP error
             * Since by this point we might already be logged out
             */
            await deauthenticateWallet();
          } catch (error) {
            // silent
          }
          await authenticateWallet();
          clearTimeout(timeoutId);
        }, expirationTimeout);
      }
    };
    handleAuthExpiration();
    return () => clearTimeout(timeoutId);
  }, []);

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
          <Router>
            <Routes />
          </Router>
        </ReduxProvider>
      </ApolloProvider>
    </IntlProvider>
  );
};

export default Entry;
