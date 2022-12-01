import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from '@apollo/client';

import layout from '~styles/layout.css';
import { DialogProvider } from '~shared/Dialog';
import '~utils/yup/customMethods'; // ensures custom yup methods are available when components load
// import { TokenActivationProvider } from '~users/TokenActivationProvider';

import messages from './i18n/en.json';
import actionMessages from './i18n/en-actions';
import eventsMessages from './i18n/en-events';
import motionMessages from './i18n/en-motions';
import systemMessages from './i18n/en-system-messages';
import Routes from './routes';
import { AppContextProvider, getContext, ContextModule } from '~context';

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

  return (
    <IntlProvider
      locale="en"
      defaultLocale="en"
      messages={{
        ...messages,
        ...actionMessages,
        ...eventsMessages,
        ...systemMessages,
        ...motionMessages,
      }}
    >
      <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
          <AppContextProvider>
            <Router>
              <DialogProvider>
                {/* <TokenActivationProvider> */}
                <div className={layout.stretch}>
                  <Routes />
                </div>
                {/* </TokenActivationProvider> */}
              </DialogProvider>
            </Router>
          </AppContextProvider>
        </ReduxProvider>
      </ApolloProvider>
    </IntlProvider>
  );
};

export default Entry;
