import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, defineMessages } from 'react-intl';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import { DialogSection } from '~shared/Dialog';
import SingleUserPicker from '~shared/SingleUserPicker/SingleUserPicker';

import { User, Colony } from '~types';
import { ItemDataType } from '~shared/OmniPicker';
import UserAvatar from '~shared/UserAvatar/UserAvatar';

import { filterUserSelection } from '~shared/SingleUserPicker';
import ConfusableWarning from '~shared/ConfusableWarning/ConfusableWarning';
import TokenAmountInput from '../TokenAmountInput/TokenAmountInput';

import styles from './CreatePaymentDialogForm.css';

const displayName =
  'common.CreatePaymentDialog.CreatePaymentDialogForm.PaymentRecipient';

const MSG = defineMessages({
  to: {
    id: `${displayName}.to`,
    defaultMessage: 'Assignee',
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `<span>Warning.</span> You are about to make a payment to an address not on the whitelist. Are you sure the address is correct?`,
  },
});

const supRenderAvatar = (item: ItemDataType<User>) => (
  <UserAvatar user={item} size="xs" />
);

const WarningLabel = (chunks) => (
  <span className={styles.warningLabel}>{chunks}</span>
);
const PaymentRecipient = ({
  verifiedUsers,
  colony,
  disabled,
  index,
}: {
  verifiedUsers: any[];
  colony: Colony;
  disabled: boolean;
  index: number;
}) => {
  const formattedData = verifiedUsers.map((user) => ({
    ...user,
    id: user.walletAddress,
  }));

  const { watch } = useFormContext();
  const { recipient } = watch();
  const showWarningForAddress = colony.metadata?.isWhitelistActivated
    ? recipient &&
      !(colony.metadata?.whitelistedAddresses ?? []).some(
        (address) =>
          address.toLowerCase() === recipient.walletAddress.toLowerCase(),
      )
    : false;

  return (
    <>
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={formattedData}
            label={MSG.to}
            name={`payments.${index}.recipient`}
            filter={filterUserSelection}
            disabled={disabled}
            placeholder={MSG.userPickerPlaceholder}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
            valueDataTest="paymentRecipientName"
            renderAvatar={supRenderAvatar}
          />
        </div>
        {showWarningForAddress && (
          <div className={styles.warningContainer}>
            <p className={styles.warningText}>
              <FormattedMessage
                {...MSG.warningText}
                values={{ span: WarningLabel }}
              />
            </p>
          </div>
        )}
        {recipient &&
          recipient.name &&
          isConfusing(recipient.name || recipient.profile?.displayName) && (
            <ConfusableWarning
              walletAddress={recipient.walletAddress}
              colonyAddress={colony?.colonyAddress}
            />
          )}
      </DialogSection>
      <DialogSection>
        <TokenAmountInput
          tokenAddressFieldName={`payments.${index}.tokenAddress`}
          amountFieldName={`payments.${index}.amount`}
          colony={colony}
          disabled={disabled}
          includeNetworkFee
        />
      </DialogSection>
    </>
  );
};

export default PaymentRecipient;
