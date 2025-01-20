import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

import { FeaturebaseContext } from './FeaturebaseContext.ts';

const FEATUREBASE_SCRIPT_ID = 'featurebase-sdk';

const FeaturebaseContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAppContext();
  const { isDarkMode } = usePageThemeContext();

  const [isFeaturebaseBooted, setIsFeaturebaseBooted] = useState(false);

  const userEmail = useMemo(() => user?.profile?.email, [user]);
  const displayName = useMemo(() => user?.profile?.displayName, [user]);

  useEffect(() => {
    if (!document.getElementById(FEATUREBASE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.src = 'https://do.featurebase.app/js/sdk.js';
      script.id = FEATUREBASE_SCRIPT_ID;

      script.onload = () => {
        if (typeof window.Featurebase !== 'function') {
          window.Featurebase = function Featurebase() {
            // eslint-disable-next-line prefer-rest-params
            (window.Featurebase.q = window.Featurebase.q || []).push(arguments);
          };
        }
        setIsFeaturebaseBooted(true);
      };

      script.onerror = () =>
        console.error('Failed to load Featurebase script.');

      document.head.appendChild(script);
    } else {
      if (typeof window.Featurebase !== 'function') {
        window.Featurebase = function Featurebase() {
          // eslint-disable-next-line prefer-rest-params
          (window.Featurebase.q = window.Featurebase.q || []).push(arguments);
        };
      }
      setIsFeaturebaseBooted(true);
    }
  }, []);

  useEffect(() => {
    if (!isFeaturebaseBooted) {
      return;
    }

    window.Featurebase('initialize_feedback_widget', {
      organization: 'colony',
      theme: isDarkMode ? 'dark' : 'light',
      email: userEmail,
      // @TODO: Switch this to user's selected language once we support multiple languages
      locale: 'en',
    });
  }, [isDarkMode, isFeaturebaseBooted, userEmail]);

  useEffect(() => {
    if (!isFeaturebaseBooted) {
      return;
    }

    window.Featurebase('init_changelog_widget', {
      organization: 'colony',
      popup: {
        enabled: true,
        usersName: displayName,
        autoOpenForNewUpdates: false,
      },
      theme: isDarkMode ? 'dark' : 'light',
      // @TODO: Switch this to user's selected language once we support multiple languages
      locale: 'en',
    });
  }, [isDarkMode, displayName, isFeaturebaseBooted]);

  const value = useMemo(() => {
    return { isFeaturebaseBooted };
  }, [isFeaturebaseBooted]);

  return (
    <FeaturebaseContext.Provider value={value}>
      {children}
    </FeaturebaseContext.Provider>
  );
};

export default FeaturebaseContextProvider;
