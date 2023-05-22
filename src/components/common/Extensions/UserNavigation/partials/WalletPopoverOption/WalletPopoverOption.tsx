import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { WalletPopoverOptionProps } from './types';
import Icon from '~shared/Icon';
import styles from './WalletPopoverOption.module.css';

const displayName = 'common.Extensions.UserNavigation.partials.WalletPopoverOption';

const WalletPopoverOption: FC<WalletPopoverOptionProps> = ({ description, icon, title, onClick }) => {
  const { formatMessage } = useIntl();

  return (
    <button type="button" aria-label={formatMessage(title)} className={styles.walletPopoverOption} onClick={onClick}>
      <div className="flex items-center">
        <Icon name={icon} appearance={{ size: 'large' }} />
        <div className="ml-4 flex flex-col justify-start">
          <h5 className="text-lg font-semibold text-gray-900 text-left">{formatMessage(title)}</h5>
          <p className="text-sm text-gray-600 font-normal">{formatMessage(description)}</p>
        </div>
      </div>
      <Icon name="caret-right" appearance={{ size: 'extraTiny' }} />
    </button>
  );
};

WalletPopoverOption.displayName = displayName;

export default WalletPopoverOption;
