import React, { type FC, type PropsWithChildren, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { useBeamer } from '~hooks/useBeamer.ts';

import { AnalyticsContext, type AnalyticsEvent } from './AnalyticsContext.ts';

const defaultAnalyticsContext = {
  trackEvent: () => {},
  trackPageView: () => {},
};

// AnalyticsContextProvider
const AnalyticsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const gtmId = import.meta.env.GOOGLE_TAG_MANAGER_ID; // GTM ID from environment variable
  useBeamer();

  const contextValue = useMemo(() => {
    return gtmId
      ? {
          trackEvent: (event: AnalyticsEvent) => {
            if (window.dataLayer) {
              window.dataLayer.push(event);
            }
          },
          trackPageView: (path: string) => {
            if (window.dataLayer) {
              window.dataLayer.push({ event: 'pageview', path });
            }
          },
        }
      : defaultAnalyticsContext;
  }, [gtmId]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {!!gtmId && (
        <Helmet>
          <script type="text/javascript">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${gtmId}');
            `}
          </script>
        </Helmet>
      )}
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContextProvider;
