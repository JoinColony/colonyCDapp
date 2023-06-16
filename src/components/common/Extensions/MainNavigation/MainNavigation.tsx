import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import {
  useAppContext,
  useColonyContext,
  useMobile,
  useUserReputation,
} from '~hooks';
import { LEARN_MORE_PAYMENTS } from '~constants';
import Nav from './partials/Nav';
import { navMenuItems } from './partials/consts';
import { SubNavigationMobile } from '~common/Extensions/SubNavigation';
import LearnMore from '~shared/Extensions/LearnMore';
import Button from '~shared/Extensions/Button';
import PopoverBase from '~shared/Extensions/PopoverBase';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from '../UserNavigation/partials/MemberReputation';
import Icon from '~shared/Icon';
import Token from '../UserNavigation/partials/Token';

import styles from './MainNavigation.module.css';
import { MainNavigationProps } from './types';

const displayName = 'common.Extensions.MainNavigation';

const MainNavigation: FC<MainNavigationProps> = ({
  setTooltipRef,
  tooltipProps,
  isMenuOpen,
}) => {
  const { colony } = useColonyContext();
  const isMobile = useMobile();
  const { user, wallet } = useAppContext();
  const { profile } = user || {};
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );
  const { formatMessage } = useIntl();

  return (
    <div className="py-6 sm:py-0">
      <div className="hidden sm:block">
        <Nav items={navMenuItems} />
      </div>
      {isMobile && isMenuOpen && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={tooltipProps}
          classNames="w-full border-none shadow-none px-0 pb-6"
        >
          <div className={styles.mobileButtons}>
            {nativeToken && <Token nativeToken={nativeToken} />}
            <Button mode="tertiaryOutline" isFullRounded>
              <div className="flex items-center gap-3">
                <UserAvatar
                  userName={profile?.displayName || user?.name || ''}
                  size="xxs"
                  user={user}
                />
                <MemberReputation
                  userReputation={userReputation}
                  totalReputation={totalReputation}
                  hideOnMobile={false}
                />
              </div>
            </Button>
            <Button mode="tertiaryOutline" isFullRounded>
              <Icon name="list" appearance={{ size: 'extraTiny' }} />
              <span className="text-sm font-medium ml-1.5">
                {formatMessage({ id: 'helpAndAccount' })}
              </span>
            </Button>
          </div>
          <div className="px-6">
            <Nav items={navMenuItems} />
            <div className="border-t border-gray-200 mb-3" />
            <SubNavigationMobile />
            <div className="flex flex-col items-center justify-between border-t border-gray-200 mt-4">
              <div className="my-6 w-full">
                <Button
                  text="Create new action"
                  mode="secondaryOutline"
                  isFullSize={isMobile}
                />
              </div>
              <LearnMore
                message={{
                  id: `${displayName}.helpText`,
                  defaultMessage:
                    'Need help and guidance? <a>Visit our docs</a>',
                }}
                href={LEARN_MORE_PAYMENTS}
              />
            </div>
          </div>
        </PopoverBase>
      )}
    </div>
  );
};

MainNavigation.displayName = displayName;

export default MainNavigation;
