import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';
import { useAppContext, useColonyContext, useMobile, useUserReputation } from '~hooks';
import Button from '~shared/Extensions/Button';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from './partials/MemberReputation';
import Icon from '~shared/Icon';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC = () => {
  const { colony } = useColonyContext();
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      delayShow: 200,
      placement: 'bottom-start',
      trigger: 'click',
      interactive: true,
    },
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: popperTooltipOffset,
          },
        },
      ],
    },
  );

  const isWalletConnected = !!wallet?.address;
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, wallet?.address);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <div className="flex items-center gap-1">
      {isWalletConnected ? (
        <>
          {nativeToken && <Token nativeToken={nativeToken} />}
          <Button mode="tertiaryOutline" isFullRounded>
            <div className="flex items-center gap-3">
              <UserAvatar user={user} userName={user?.name || ''} size="xxs" />
              <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
            </div>
          </Button>
        </>
      ) : (
        isButtonVisible && (
          <Button mode="tertiaryOutline" isFullRounded onClick={connectWallet}>
            <Icon name="cardholder" appearance={{ size: 'tiny' }} />
            <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'connectWallet' })}</p>
          </Button>
        )
      )}
      <Button mode="tertiaryOutline" isFullRounded setTriggerRef={setTriggerRef}>
        <Icon name="list" appearance={{ size: 'tiny' }} />
      </Button>
      <div>
        <Button
          className={clsx({
            'px-4 py-2.5 !border-base-white': visible && isMobile,
            'p-0': !visible && isMobile,
          })}
          mode="tertiaryOutline"
          isFullRounded
          setTriggerRef={setTriggerRef}
          onClick={() => isMobile && setIsButtonVisible((prevState) => !prevState)}
        >
          <Icon name={visible && isMobile ? 'close' : 'list'} appearance={{ size: 'tiny' }} />
        </Button>
        <div className="w-full h-auto top-[6.5rem] md:top-[2.3rem]">
          {visible && (
            <UserMenu
              tooltipProps={getTooltipProps}
              setTooltipRef={setTooltipRef}
              isWalletConnected={isWalletConnected}
            />
          )}
        </div>
      </div>
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
