import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { WalletPopoverProps } from './types';
import PopoverBase from '~shared/Extensions/PopoverBase';
import Icon from '~shared/Icon';
import Link from '~shared/Link';
import styles from './WalletPopover.module.css';
import WalletPopoverOption from '../WalletPopoverOption';
import Button from '~shared/Extensions/Button';
import { useAppContext, useMobile } from '~hooks';
import TitledContent from '~common/Extensions/TitledContent/TitledContent';

const displayName = 'common.Extensions.UserNavigation.partials.WalletPopover';

const WalletPopover: FC<WalletPopoverProps> = ({ setTooltipRef, tooltipProps }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { connectWallet } = useAppContext();

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      classNames={styles.walletPopover}
      withTooltipStyles={false}
    >
      <div className={styles.mobileButtons}>
        <Button mode="tertiaryOutline" isFullRounded onClick={connectWallet}>
          <Icon name="cardholder" appearance={{ size: 'tiny' }} />
          <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'connectWallet' })}</p>
        </Button>
        <Button mode="tertiaryOutline" isFullRounded>
          <Icon name="list" appearance={{ size: 'extraTiny' }} />
          <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'help' })}</p>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row h-full">
        <div className={styles.walletPopoverColumn}>
          {!isMobile && (
            // there is no <Icon /> component here because the icon is oblong and the component turns it into a square
            <svg className="w-[6.25rem] h-5">
              <use xlinkHref="#colony-logo" />
            </svg>
          )}
          <p className="mt-7 text-sm text-gray-900">{formatMessage({ id: 'walletPopover.content' })}</p>
          <div className="flex mt-auto text-xs font-medium text-gray-900">
            <p>
              {formatMessage({ id: 'walletPopover.signin' })}{' '}
              <Link to="/" className="inline text-blue-400 underline">
                {formatMessage({ id: 'walletPopover.terms' })}
              </Link>
            </p>
          </div>
        </div>
        <div className="py-6 md:p-6">
          <h4 className="text-lg font-semibold text-gray-900">
            {formatMessage({ id: 'walletPopover.connectWallet' })}
          </h4>
          {isMobile && <p className="mt-2 text-sm text-gray-900">{formatMessage({ id: 'walletPopover.content' })}</p>}
          <TitledContent
            title={{ defaultMessage: 'available wallets', id: 'availableWallets' }}
            isTitleHiddenOnDesktop
            className="mt-6"
          >
            <ul className="md:mt-6">
              <li>
                {/* @TODO: Add metamask connection to API */}
                <WalletPopoverOption
                  title={{ defaultMessage: 'MetaMask', id: 'metaMask' }}
                  description={{ defaultMessage: 'Requires MetaMask browser extension', id: 'metaMaskRequired' }}
                  icon="metamask"
                  // eslint-disable-next-line no-console
                  onClick={() => console.log('MetaMask connect')}
                />
              </li>
            </ul>
          </TitledContent>
        </div>
        {isMobile && (
          <div className="py-6 md:p-6 border-t border-gray-200">
            <div className="flex mt-auto text-xs font-medium text-gray-900">
              <p>
                {formatMessage({ id: 'walletPopover.signin' })}{' '}
                <Link to="/" className="inline text-blue-400 underline">
                  {formatMessage({ id: 'walletPopover.terms' })}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </PopoverBase>
  );
};

WalletPopover.displayName = displayName;

export default WalletPopover;
