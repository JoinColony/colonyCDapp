import React, { PropsWithChildren } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~shared/Extensions/Button/Button';

import LinkItem from '../LinkItem';

import LearnMore from './LearnMore';
import styles from './DropdownItems.module.css';

const displayName = 'Extensions.SubNavigation.DropdownItems.PayDropdown';

const MSG = defineMessages({
  paymentContentTitle: {
    id: `${displayName}.paymentContentTitle`,
    defaultMessage: 'CREATE NEW PAYMENTS',
  },
  singlePayments: {
    id: `${displayName}.singlePayments`,
    defaultMessage: 'Single payments',
  },
  singlePaymentsDescription: {
    id: `${displayName}.singlePaymentsDescription`,
    defaultMessage: 'Create a new simple payment.',
  },
  advancedPayments: {
    id: `${displayName}.advancedPayments`,
    defaultMessage: 'Advanced payments',
  },
  advancedPaymentsDescription: {
    id: `${displayName}.advancedPaymentsDescription`,
    defaultMessage: 'A payment with more features and options.',
  },
  streamingPayments: {
    id: `${displayName}.streamingPayments`,
    defaultMessage: 'Streaming payments',
  },
  streamingPaymentsDescription: {
    id: `${displayName}.streamingPaymentsDescription`,
    defaultMessage: 'Create ongoing payments.',
  },
  moveFunds: {
    id: `${displayName}.moveFunds`,
    defaultMessage: 'Move funds',
  },
  moveFundsDescription: {
    id: `${displayName}.moveFundsDescription`,
    defaultMessage: 'Transfer funds between teams.',
  },
  buttonText: {
    id: `${displayName}.buttonText`,
    defaultMessage: 'View active payments',
  },
  helpText: {
    id: `${displayName}.helpText`,
    defaultMessage: 'Need help with payments? <a>Learn more</a>',
  },
});

const PayDropdown: React.FC<PropsWithChildren> = () => (
  <div>
    <div className="text-gray-400 text-xs">
      <div className="hidden md:block mx-4 mt-4">
        <FormattedMessage {...MSG.paymentContentTitle} />
      </div>
      <ul className={styles.listWrapper}>
        <LinkItem title={MSG.singlePayments} description={MSG.singlePaymentsDescription} />
        <LinkItem title={MSG.advancedPayments} description={MSG.advancedPaymentsDescription} />
        <LinkItem title={MSG.streamingPayments} description={MSG.streamingPaymentsDescription} />
        <LinkItem title={MSG.moveFunds} description={MSG.moveFundsDescription} />
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonText} mode="primaryOutline" />
      </div>
      <div className="mt-6 md:mt-8 mb-4 text-sm flex justify-center">
        <FormattedMessage
          {...MSG.helpText}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => <LearnMore chunks={chunks} href="/" />,
          }}
        />
      </div>
    </div>
  </div>
);

PayDropdown.displayName = displayName;

export default PayDropdown;
