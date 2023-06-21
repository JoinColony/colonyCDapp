import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { UserMenuProps } from './types';
import { useAppContext, useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import Icon from '~shared/Icon';
import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';
import styles from './UserMenu.module.css';
import PopoverBase from '~v5/shared/PopoverBase';
import TitledContent from '~common/Extensions/TitledContent';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu';
import Link from '~v5/shared/Link';
import UserSubmenu from '../UserSubmenu';
import { userMenuItems } from './consts';
import TitleLabel from '~v5/shared/TitleLabel';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isWalletConnected,
  user,
  isVerified,
  walletAddress,
  userReputation,
  totalReputation,
  nativeToken,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { connectWallet } = useAppContext();
  const { name, profile } = user || {};
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const iconSize = isMobile ? 'small' : 'extraTiny';

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles
      classNames={clsx(styles.userMenuPopup, 'shadow-default', {
        'w-full border-none shadow-none': isMobile,
        'w-[20.125rem]': !isMobile,
      })}
    >
      <div
        className={clsx('absolute inset-0 p-6 transition-transform', {
          'translate-x-0': activeSubmenu,
          'translate-x-full': !activeSubmenu,
        })}
      >
        <button
          type="button"
          aria-label={formatMessage({ id: 'ariaLabel.backToMainMenu' })}
          className={clsx(styles.buttonBack, 'group text-4')}
          onClick={() => setActiveSubmenu(null)}
        >
          <Icon name="caret-left" appearance={{ size: 'extraTiny' }} />
          {activeSubmenu && (
            <TitleLabel
              className="ml-2"
              text={formatMessage({ id: activeSubmenu })}
            />
          )}
        </button>
        {activeSubmenu && <UserSubmenu submenuId={activeSubmenu} />}
      </div>
      <div
        className={clsx('transition-transform', {
          '-translate-x-0': !activeSubmenu,
          '-translate-x-[100vw]': activeSubmenu,
        })}
      >
        {isWalletConnected && (
          <WalletConnectedTopMenu
            userName={profile?.displayName || name || ''}
            isVerified={isVerified}
            walletAddress={walletAddress}
            userReputation={userReputation}
            totalReputation={totalReputation}
            nativeToken={nativeToken}
            avatar={profile?.thumbnail || profile?.avatar || ''}
            user={user}
          />
        )}
        {!isWalletConnected && (
          <>
            <div className={styles.mobileButtons}>
              <Button mode="tertiaryOutline" isFullRounded>
                <Icon name="cardholder" appearance={{ size: 'tiny' }} />
                <span className="text-3 ml-1.5">
                  {formatMessage({ id: 'connectWallet' })}
                </span>
              </Button>
              <Button mode="tertiaryOutline" isFullRounded>
                <Icon name="list" appearance={{ size: 'extraTiny' }} />
                <p className="text-3 ml-1">{formatMessage({ id: 'help' })}</p>
              </Button>
            </div>
            <div className="w-full pb-6 mb-6 border-b border-b-gray-200 sm:pb-5 sm:mb-5">
              <Button
                mode="quaternaryOutline"
                isFullSize
                onClick={connectWallet}
              >
                {formatMessage({ id: 'connectWallet' })}
              </Button>
            </div>
          </>
        )}
        <div className="w-full pb-6 mb-6 border-b border-b-gray-200 sm:pb-5 sm:mb-5">
          <TitledContent title={{ id: 'userMenu.optionsTitle' }}>
            <ul className="text-lg font-semibold sm:font-normal sm:text-md text-left">
              {userMenuItems.map((item) => (
                <li className="mb-4 last:mb-0" key={item.id}>
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="flex items-center transition-all duration-normal text-gray-700 hover:text-blue-400"
                    >
                      <Icon name={item.icon} appearance={{ size: iconSize }} />
                      <p className="ml-2">{formatMessage({ id: item.name })}</p>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => setActiveSubmenu(item.name)}
                      aria-expanded={activeSubmenu === item.name}
                      aria-controls="actionsWithVisibility"
                    >
                      <span className="flex items-center shrink-0">
                        <Icon
                          name={item.icon}
                          appearance={{ size: iconSize }}
                        />
                        <p className="ml-2">
                          {formatMessage({ id: item.name })}
                        </p>
                      </span>
                      <Icon
                        name="caret-right"
                        appearance={{ size: 'extraTiny' }}
                      />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </TitledContent>
        </div>
        {isWalletConnected && (
          <div className="w-full mb-6 sm:mb-5">
            <TitledContent title={{ id: 'userMenu.other' }}>
              <Link to="/" className={clsx(styles.link, 'heading-5')}>
                <Icon name="plugs" appearance={{ size: iconSize }} />
                <p className="ml-2">
                  {formatMessage({ id: 'userMenu.disconnectWalletTitle' })}
                </p>
              </Link>
            </TitledContent>
          </div>
        )}
        <ThemeSwitcher />
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
