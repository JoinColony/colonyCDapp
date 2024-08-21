import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { KycStatus, useCheckKycStatusQuery } from '~gql';
import { ActionTypes } from '~redux';
import { USER_CRYPTO_TO_FIAT_ROUTE, USER_HOME_ROUTE } from '~routes';
import { ActionForm } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { useTransferForm } from './partials/hooks.ts';
import KycCard from './partials/KycCard.tsx';
import Success from './partials/Success.tsx';
import TransferForm from './partials/TransferForm.tsx';
// import { useCryptoToFiatContext } from '~frame/v5/pages/UserCryptoToFiatPage/context/CryptoToFiatContext.ts';
// import { KycStatus } from '~gql';

const displayName = 'common.Extensions.UserHub.partials.CryptoToFiatTab';

const MSG = defineMessages({
  cryptoToFiat: {
    id: `${displayName}.cryptoToFiat`,
    defaultMessage: 'Crypto to fiat',
  },
  updateDetails: {
    id: `${displayName}.updateDetails`,
    defaultMessage: 'Update details',
  },
});

const CryptoToFiatTab = () => {
  const { data, loading: isKycStatusLoading } = useCheckKycStatusQuery();

  const { formatMessage } = useIntl();
  const { transform, validationSchema } = useTransferForm();

  // @TODO: Check this correctly updates on submission
  const [success, setSuccess] = useState(false);

  const cryptoToFiatLink = `${USER_HOME_ROUTE}/${USER_CRYPTO_TO_FIAT_ROUTE}`;

  const verificationRequired =
    data?.bridgeCheckKYC?.kycStatus !== KycStatus.Approved ||
    !data?.bridgeCheckKYC?.liquidationAddress;

  const handleReset = () => {
    setSuccess(false);
  };

  const showKycCard = isKycStatusLoading || verificationRequired;

  return (
    <div className="px-6">
      <div className="flex justify-between pt-6">
        <p className="heading-5">{formatText(MSG.cryptoToFiat)}</p>
        {/* @TODO: Update to complete link */}
        <LoadingSkeleton
          isLoading={isKycStatusLoading}
          className="h-[18px] w-[59px] rounded"
        >
          <Link
            to={cryptoToFiatLink}
            className="text-xs text-blue-400 hover:underline"
          >
            {formatMessage(MSG.updateDetails)}
          </Link>
        </LoadingSkeleton>
      </div>
      <div className="pt-4">
        {showKycCard && (
          <KycCard
            isKycStatusLoading={isKycStatusLoading}
            link={cryptoToFiatLink}
          />
        )}
        {!success ? (
          <ActionForm
            actionType={ActionTypes.USER_CRYPTO_TO_FIAT_TRANSFER}
            validationSchema={validationSchema}
            mode="onChange"
            reValidateMode="onChange"
            transform={transform}
            defaultValues={{
              amount: 0,
              convertedAmount: 0,
            }}
            onSuccess={() => {
              setSuccess(true);
            }}
          >
            <TransferForm
              isFormDisabled={verificationRequired}
              isKycStatusLoading={isKycStatusLoading}
            />
          </ActionForm>
        ) : (
          <Success resetForm={handleReset} />
        )}
      </div>
    </div>
  );
};

CryptoToFiatTab.displayName = displayName;

export default CryptoToFiatTab;
