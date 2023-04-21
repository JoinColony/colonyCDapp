import React, { PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '~shared/Extensions/Button/Button';
import { LEARN_MORE_PAYMENTS } from '~constants';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge-new/ExtensionStatusBadge';
import Icon from '~shared/Icon/Icon';

import LinkItem from '../LinkItem';
import LearnMore from '../LearnMore';

import styles from './DropdownContent.module.css';
import { MSG } from './consts';

const displayName = 'common.Extensions.SubNavigation.Partials.DropdownContent.PayDropdown';

const PayDropdown: React.FC<PropsWithChildren> = () => (
  <div>
    <div className="text-gray-400 text-xs">
      <div className="hidden md:block mx-4 mt-4">
        <FormattedMessage {...MSG.paymentContentTitle} />
      </div>
      <ul className={styles.listWrapper}>
        <LinkItem title={MSG.singlePayments} description={MSG.singlePaymentsDescription} />
        <LinkItem
          title={MSG.advancedPayments}
          description={MSG.advancedPaymentsDescription}
          statusBadge={<ExtensionStatusBadge text={MSG.commingSoon} />}
        />
        <LinkItem title={MSG.streamingPayments} description={MSG.streamingPaymentsDescription} />
        <LinkItem title={MSG.moveFunds} description={MSG.moveFundsDescription} />
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonTextPay} mode="primaryOutline" />
      </div>
      <div className={styles.infoWrapper}>
        <Icon name="question-mark" className={styles.questionIcon} />
        <FormattedMessage
          {...MSG.helpTextPay}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => <LearnMore chunks={chunks} href={LEARN_MORE_PAYMENTS} />,
          }}
        />
      </div>
    </div>
  </div>
);

PayDropdown.displayName = displayName;

export default PayDropdown;
