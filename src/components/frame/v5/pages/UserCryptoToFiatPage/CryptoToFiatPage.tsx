import React, { useContext } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { FeatureFlagsContext } from '~context/FeatureFlagsContext/FeatureFlagsContext.ts';
import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import {
  LANDING_PAGE_ROUTE,
  USER_EDIT_PROFILE_ROUTE,
  USER_HOME_ROUTE,
} from '~routes';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import CryptoToFiatContextProvider from './context/CryptoToFiatContextProvider.tsx';
import AutomaticDeposits from './partials/AutomaticDeposits/AutomaticDeposits.tsx';
import BankDetails from './partials/BankDetails/BankDetails.tsx';
import FiatTransfersTable from './partials/FiatTransfersTable/FiatTransfersTable.tsx';
import LiquidationAddress from './partials/LiquidationAddress/LiquidationAddress.tsx';
import Verification from './partials/Verification/Verification.tsx';

const displayName = 'v5.pages.UserCryptoToFiatPage';

const MSG = defineMessages({
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

  useSetPageHeadingTitle(formatText({ id: 'userCryptoToFiatPage.title' }));

  if (
    !cryptoToFiatFeatureFlag?.isLoading &&
    !cryptoToFiatFeatureFlag?.isEnabled
  ) {
    return <Navigate to={`${USER_HOME_ROUTE}/${USER_EDIT_PROFILE_ROUTE}`} />;
  }

  const isLoadingUserAndWalletInfo = userLoading || walletConnecting;

  if (!isLoadingUserAndWalletInfo && !user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <CryptoToFiatContextProvider>
      <div className="flex flex-col gap-6">
        <h4 className="heading-4">
          {formatMessage({ id: 'userCryptoToFiatPage.heading' })}
        </h4>
        <p className="text-md text-gray-500">
          {formatText(MSG.pageSubHeading)}
        </p>
        <Verification />
        <hr />
        <BankDetails />
        <hr />
        <AutomaticDeposits />
        <hr />
        <LiquidationAddress />
        <hr />
        <FiatTransfersTable />
      </div>
    </CryptoToFiatContextProvider>
  );
};

UserCryptoToFiatPage.displayName = displayName;

export default UserCryptoToFiatPage;
