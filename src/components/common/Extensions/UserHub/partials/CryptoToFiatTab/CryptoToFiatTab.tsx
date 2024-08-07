import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { ActionTypes } from '~redux';
import { USER_HOME_ROUTE } from '~routes';
import { ActionForm } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { useTransferForm } from './partials/hooks.ts';
import KycCard from './partials/KycCard.tsx';
import Success from './partials/Success.tsx';
import TransferForm from './partials/TransferForm.tsx';

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
  const { formatMessage } = useIntl();
  const { transform, validationSchema } = useTransferForm();
  // @TODO: Check this correctly updates on submission
  const [success, setSuccess] = useState(false);

  // @TODO: Get verification status from user context
  const verificationRequired = false;

  const handleReset = () => {
    setSuccess(false);
  };

  return (
    <div className="px-6">
      <div className="flex justify-between pt-6">
        <p className="heading-5">{formatText(MSG.cryptoToFiat)}</p>
        {/* @TODO: Update to complete link */}
        <Link
          to={`${USER_HOME_ROUTE}`}
          className="text-xs text-blue-400 hover:underline"
        >
          {formatMessage(MSG.updateDetails)}
        </Link>
      </div>
      <div className="pt-4">
        {verificationRequired && <KycCard />}
        {!success ? (
          <ActionForm
            actionType={ActionTypes.USER_CRYPTO_TO_FIAT_TRANSFER}
            validationSchema={validationSchema}
            transform={transform}
            defaultValues={{
              amount: 0,
              convertedAmount: 0,
            }}
            onSuccess={() => {
              setSuccess(true);
            }}
          >
            <TransferForm isFormDisabled={verificationRequired} />
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
