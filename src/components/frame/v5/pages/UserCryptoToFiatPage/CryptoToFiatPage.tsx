import React, { Fragment, useContext, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { FeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { useCheckKycStatusMutation } from '~gql';
import {
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes';
import { formatText } from '~utils/intl.ts';

import { useUserCryptoToFiatPage } from './hooks.tsx';
import FiatTransfersTable from './partials/FiatTransfersTable/FiatTransfersTable.tsx';
import { type KycStatusData } from './types.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Fetching crypto to fiat information',
  },
  pageHeading: {
    id: `${displayName}.pageHeading`,
    defaultMessage: 'Crypto to fiat settings',
  },
  pageSubHeading: {
    id: `${displayName}.pageSubHeading`,
    defaultMessage:
      'Compelete the following steps to off-ramp USDC to your bank account in USD or EUR.',
  },
});

const UserCryptoToFiatPage = () => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const featureFlags = useContext(FeatureFlagsContext);
  const cryptoToFiatFeatureFlag = featureFlags[FeatureFlag.CRYPTO_TO_FIAT];

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  const { rowItems } = useUserCryptoToFiatPage();

  const [checkKycStatus] = useCheckKycStatusMutation();
  const [kycStatusData, setKycStatusData] = useState<KycStatusData | null>(
    null,
  );

  useEffect(() => {
    checkKycStatus().then((result) => {
      if (result.data?.bridgeXYZMutation) {
        setKycStatusData(result.data.bridgeXYZMutation);
      }
    });
  }, [checkKycStatus]);

  if (userLoading || walletConnecting || cryptoToFiatFeatureFlag?.isLoading) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!cryptoToFiatFeatureFlag?.isEnabled) {
    return <Navigate to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-1">
        <h4 className="heading-4">{formatText(MSG.pageHeading)}</h4>
        <span className="text-md text-gray-500">
          {formatText(MSG.pageSubHeading)}
        </span>
      </section>
      {rowItems.map(({ Component, key }, index, items) => {
        return (
          <Fragment key={key}>
            {/* @TODO: Is there a benefit in having the hook return an array instead of just rendering components?  */}
            <Component order={index + 1} kycStatusData={kycStatusData} />
            {index < items.length - 1 && <hr />}
          </Fragment>
        );
      })}
      <hr />
      <FiatTransfersTable />
    </div>
  );
};

UserCryptoToFiatPage.displayName = displayName;

export default UserCryptoToFiatPage;
