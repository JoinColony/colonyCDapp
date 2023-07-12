import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { Message } from '~types';

import styles from './TransactionTypesSection.css';

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
