import React, { PropsWithChildren, FC } from 'react';
import { useIntl } from 'react-intl';

import { LEARN_MORE_PAYMENTS } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import LearnMore from '~shared/Extensions/LearnMore';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import Button from '~v5/shared/Button';
import TitleLabel from '~v5/shared/TitleLabel';

import LinkItem from '../LinkItem';

import { MSG, PAY_DROPDOWN_ITEMS } from './consts';

import styles from './DropdownContent.module.css';

const displayName =
  'v5.common.SubNavigation.partials.DropdownContent.PayDropdown';

const PayDropdown: FC<PropsWithChildren> = () => {
  const { formatMessage } = useIntl();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  return (
    <div className="bg-base-white">
      <TitleLabel
        className="hidden sm:block mx-6 mt-6"
        text={formatMessage({ id: 'createNewPayments' })}
      />
      <ul className={styles.listWrapper}>
        {PAY_DROPDOWN_ITEMS.map(({ action, ...rest }) => (
          <LinkItem
            {...rest}
            key={action}
            onClick={() => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: action,
              });
            }}
          />
        ))}
      </ul>
      <div className={styles.buttonWrapper}>
        <Button text={MSG.buttonTextPay} mode="quinary" isFullSize />
      </div>
      <div className={styles.infoWrapper}>
        <LearnMore
          message={{
            id: `${displayName}.helpText`,
            defaultMessage: 'Need help with payments? <a>Learn more</a>',
          }}
          href={LEARN_MORE_PAYMENTS}
        />
      </div>
    </div>
  );
};

PayDropdown.displayName = displayName;

export default PayDropdown;
