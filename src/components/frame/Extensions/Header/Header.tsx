import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import Icon from '~shared/Icon';
import UserNavigation from '~common/Extensions/UserNavigation';
import MainNavigation from '~common/Extensions/MainNavigation';
import { CloseButton } from '~v5/shared/Button';
import { useHeader } from './hooks';
import { HeaderProps } from './types';

const displayName = 'frame.Extensions.Header';

const Header: FC<HeaderProps> = ({ hideColonies = false }) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();

  const {
    mainMenuGetTooltipProps,
    mainMenuSetTooltipRef,
    mainMenuSetTriggerRef,
    isMainMenuVisible,
    visible,
  } = useHeader();

  const isCloseButtonVisible = (isMainMenuVisible || visible) && isMobile;

  return (
    <header>
      <div className="bg-base-white w-full flex min-h-[6.375rem] justify-center px-6">
        <div className="flex items-center justify-between sm:max-w-[90rem] w-full">
          <div className="mr-5 sm:mr-10">
            <ColonySwitcher />
          </div>
          <div
            className={clsx('flex w-full items-center', {
              'justify-end': hideColonies,
              'justify-between': !hideColonies,
            })}
          >
            {!hideColonies && (
              <>
                <button
                  type="button"
                  className={clsx('flex items-center sm:hidden', {
                    'opacity-100 visible': !isMainMenuVisible,
                    'opacity-0 invisible': isMainMenuVisible,
                  })}
                  ref={mainMenuSetTriggerRef}
                  aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
                >
                  <Icon name="list" appearance={{ size: 'tiny' }} />
                  <span className="text-2 ml-1.5">
                    {formatMessage({ id: 'menu' })}
                  </span>
                </button>
                <MainNavigation
                  setTooltipRef={mainMenuSetTooltipRef}
                  tooltipProps={mainMenuGetTooltipProps}
                  isMenuOpen={isMainMenuVisible}
                />
              </>
            )}
            <div>
              {isCloseButtonVisible ? (
                <CloseButton iconSize="tiny" />
              ) : (
                <UserNavigation hideColonies={hideColonies} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = displayName;

export default Header;
