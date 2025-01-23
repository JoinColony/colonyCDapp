import { ApolloProvider } from '@apollo/client';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import {
  DynamicContextProvider,
  mergeNetworks,
} from '@dynamic-labs/sdk-react-core';
import { PostHogProvider } from 'posthog-js/react';
import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { GANACHE_NETWORK, GANACHE_LOCAL_RPC_URL } from '~constants/index.ts';
import AnalyticsContextProvider from '~context/AnalyticsContext/AnalyticsContextProvider.tsx';
import BreadcrumbsContextProvider from '~context/BreadcrumbsContext/BreadcrumbsContextProvider.tsx';
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
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('isDarkMode') === 'true' || false,
  );

  useEffect(() => {
    function checkAppTheme() {
      setIsDarkMode(localStorage.getItem('isDarkMode') === 'true');
    }
    window.addEventListener('storage', checkAppTheme);

    return () => {
      window.removeEventListener('storage', checkAppTheme);
    };
  }, []);

  return (
    <DynamicContextProvider
      theme={isDarkMode ? 'dark' : 'light'}
      settings={{
        debugError: import.meta.env.DEV,
        logLevel: import.meta.env.DEV ? 'WARN' : 'ERROR',
        mobileExperience: 'redirect',
        environmentId: import.meta.env.DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors],
        initialAuthenticationMode: 'connect-only',
        enableVisitTrackingOnConnectOnly: false,
        networkValidationMode: 'always',
        recommendedWallets: [
          {
            walletKey: 'metamask',
            label: 'Recommended',
          },
        ],
        overrides: {
          evmNetworks: (networks) => {
            if (import.meta.env.DEV) {
              return mergeNetworks(
                [
                  {
                    blockExplorerUrls: [
                      GANACHE_NETWORK.blockExplorerUrl as string,
                    ],
                    chainId: parseInt(GANACHE_NETWORK.chainId, 10),
                    chainName: 'Local Hardhat Instance',
                    iconUrls: ['/src/images/icons/hardhat.svg'],
                    name: 'Local Hardhat Instance',
                    nativeCurrency: {
                      decimals: 18,
                      name: 'Ether',
                      symbol: 'ETH',
                      iconUrl:
                        'https://app.dynamic.xyz/assets/networks/eth.svg',
                    },
                    networkId: parseInt(GANACHE_NETWORK.chainId, 10),

                    rpcUrls: [GANACHE_LOCAL_RPC_URL],
                    vanityName: 'Hardhat',
                  },
                ],
                networks,
              );
            }
            return networks;
          },
        },
        shadowDOMEnabled: false,
      }}
    >
      <PostHogProvider {...posthogConfig}>
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
                    <BreadcrumbsContextProvider>
                      <RouteTracker />
                      <Routes />
                    </BreadcrumbsContextProvider>
                  </Router>
                </AnalyticsContextProvider>
              </HelmetProvider>
            </ReduxProvider>
          </ApolloProvider>
        </IntlProvider>
      </PostHogProvider>
    </DynamicContextProvider>
  );
};

export default Entry;
