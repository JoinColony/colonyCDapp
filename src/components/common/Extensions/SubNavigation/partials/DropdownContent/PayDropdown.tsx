import React, { PropsWithChildren, FC } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_PAYMENTS } from '~constants';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import LinkItem from '../LinkItem';
import styles from './DropdownContent.module.css';
import { MSG } from './consts';
import LearnMore from '~shared/Extensions/LearnMore';

const displayName = 'common.Extensions.SubNavigation.partials.DropdownContent.PayDropdown';

const PayDropdown: FC<PropsWithChildren> = () => (
  <div className="text-gray-400 text-xs">
    <div className="hidden sm:block mx-6 mt-6">
      <FormattedMessage {...MSG.paymentContentTitle} />
    </div>
    <ul className={styles.listWrapper}>
      <LinkItem title={MSG.singlePayments} description={MSG.singlePaymentsDescription} />
      <LinkItem
        title={MSG.advancedPayments}
        description={MSG.advancedPaymentsDescription}
        statusBadge={<ExtensionStatusBadge text={MSG.comingSoon} />}
      />
      <LinkItem title={MSG.streamingPayments} description={MSG.streamingPaymentsDescription} />
      <LinkItem title={MSG.moveFunds} description={MSG.moveFundsDescription} />
    </ul>
    <div className={styles.buttonWrapper}>
      <Button text={MSG.buttonTextPay} mode="secondaryOutline" isFullSize />
    </div>
    <div className={styles.infoWrapper}>
      <LearnMore
        message={{ id: `${displayName}.helpText`, defaultMessage: 'Need help with payments? <a>Learn more</a>' }}
        href={LEARN_MORE_PAYMENTS}
      />
    </div>
  </div>
);

PayDropdown.displayName = displayName;

export default PayDropdown;
