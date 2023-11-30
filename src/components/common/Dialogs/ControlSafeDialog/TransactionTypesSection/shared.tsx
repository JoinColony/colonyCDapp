import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { ItemDataType } from '~shared/OmniPicker';
import { SpinnerLoader } from '~shared/Preloaders';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import UserAvatar from '~shared/UserAvatar';
import { Colony, Message, User } from '~types';

import styles from './TransactionTypesSection.css';

const displayName = `common.ControlSafeDialog.shared`;

export const MSG = defineMessages({
  recipient: {
    id: `${displayName}.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
});

interface ErrorMessageProps {
  error: Message;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => (
  <DialogSection>
    <div className={styles.error}>
      {typeof error === 'string' ? (
        <span>{error}</span>
      ) : (
        <FormattedMessage {...error} />
      )}
    </div>
  </DialogSection>
);

export const AvatarXS = (item: ItemDataType<User>) => (
  <UserAvatar user={item} size="xs" />
);

interface LoadingProps {
  message: Message;
}

export const Loading = ({ message }: LoadingProps) => (
  <DialogSection>
    <div className={styles.spinner}>
      <SpinnerLoader appearance={{ size: 'medium' }} loadingText={message} />
    </div>
  </DialogSection>
);

interface RecipientPickerProps {
  colony: Colony;
  transactionIndex: number;
  disabledInput: boolean;
}

export const RecipientPicker = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colony,
  transactionIndex,
  disabledInput,
}: RecipientPickerProps) => {
  const users = [];

  return (
    <div className={styles.singleUserPickerContainer}>
      <SingleUserPicker
        data={users}
        label={MSG.recipient}
        name={`transactions.${transactionIndex}.recipient`}
        filter={filterUserSelection}
        renderAvatar={AvatarXS}
        disabled={disabledInput}
        placeholder={MSG.userPickerPlaceholder}
        dataTest="paymentRecipientPicker"
        itemDataTest="paymentRecipientItem"
        valueDataTest="paymentRecipientName"
      />
    </div>
  );
};
