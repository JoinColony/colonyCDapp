import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useCheckKycStatusMutation } from '~gql';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { KYCModal } from '../KYCModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import { statusPillScheme } from './consts.ts';
import BankDetailsDescriptionComponent from './partials/BankDetailsDescriptionComponent/BankDetailsDescriptionComponent.tsx';
import { type KYCInfo, type KYCStatus } from './types.ts';

const displayName = 'v5.pages.UserCryptoToFiat.partials.BankDetails';

const MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
  ctaTitle: {
    id: `${displayName}.ctaTitle`,
    defaultMessage: 'Add details',
  },
});

const BankDetails = () => {
  const [isOpened, setOpened] = useState(false);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  const [checkKycStatus] = useCheckKycStatusMutation();

  const [kycDetails, setKycDetails] = useState<KYCInfo>({
    bankName: '',
    accountNumber: '',
    bic: '',
    payoutCurrency: '',
    kycStatus: 'not_started',
    currency: '',
    bicLast4: '',
  });

  useEffect(() => {
    const getKycStatus = async () => {
      try {
        const kycStatusResponse = await checkKycStatus();

        const response = kycStatusResponse?.data?.bridgeXYZMutation;

        if (response) {
          const { kyc_status: kycStatus, bankAccount } = response;

          const {
            // @ts-ignore
            currency,
            // @ts-ignore
            bankName,
            // @ts-ignore
            iban: { bic, last4 },
          } = bankAccount;

          setKycDetails((state) => ({
            ...state,
            kycStatus: kycStatus as KYCStatus,
            currency,
            bankName,
            bic,
            bicLast4: last4,
          }));
        }
      } catch (err) {
        // Show an error toast
      }
    };

    getKycStatus();
  }, [checkKycStatus]);

  const { StatusIcon } = statusPillScheme[kycDetails.kycStatus];

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
        statusPill={
          // Move this inside the RowItem.Heading component
          <PillsBase
            className={clsx(
              statusPillScheme[kycDetails.kycStatus].bgClassName,
              'text-sm font-medium',
            )}
          >
            <div className="flex items-center gap-1">
              {StatusIcon && (
                <StatusIcon
                  className={
                    statusPillScheme[kycDetails.kycStatus].textClassName
                  }
                />
              )}
              <span
                className={statusPillScheme[kycDetails.kycStatus].textClassName}
              >
                {statusPillScheme[kycDetails.kycStatus].label}
              </span>
            </div>
          </PillsBase>
        }
        itemOrder={1}
      />
      <RowItem.Body
        descriptionComponent={
          <BankDetailsDescriptionComponent
            currency={kycDetails.currency}
            bankName={kycDetails.bankName}
            bic={kycDetails.bic}
            bicLast4={kycDetails.bicLast4}
          />
        }
        ctaTitle={MSG.ctaTitle}
        ctaOnClick={handleOpen}
      />

      {isOpened && <KYCModal isOpened={isOpened} onClose={handleClose} />}
    </RowItem.Container>
  );
};

BankDetails.displayName = displayName;

export default BankDetails;
