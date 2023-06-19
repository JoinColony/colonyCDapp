import clsx from 'clsx';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import {
  useAppContext,
  useColonyContext,
  useDetectClickOutside,
  useMobile,
  usePrevious,
  useUserReputation,
} from '~hooks';

import UserHub from '~common/Extensions/UserHub';
import Button from '~shared/Extensions/Button';
import PopoverBase from '~shared/Extensions/PopoverBase';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from '~shared/MemberReputation';

import { UserReputationProps } from '../../types';

import { transactionCount } from '~frame/GasStation/transactionGroup';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserReputation';

const UserReputation: FC<UserReputationProps> = ({
  transactionAndMessageGroups,
}) => {
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const isMobile = useMobile();
  const { profile } = user || {};
  const [, setIsWalletButtonVisible] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [txNeedsSigning, setTxNeedsSigning] = useState(false);

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];

  const ref = useDetectClickOutside({
    onTriggered: () => {
      setOpen(false);
      setTxNeedsSigning(false);
    },
  });
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: 200,
        delayHide: 200,
        placement: 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: (newVisible) => {
          if (!newVisible && isMobile) {
            setIsWalletButtonVisible(true);
          }
        },
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

  const { colonyAddress } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  // @ts-ignore
  const transactionsAndMessages = transactionAndMessageGroups.toJS();
  const txCount = useMemo(
    () => transactionCount(transactionsAndMessages),
    [transactionsAndMessages],
  );

  const prevTxCount: number | void = usePrevious(txCount);

  useEffect(() => {
    // this confition always will be false until we will be able to trigger transactions in Extension page
    if (prevTxCount != null && txCount > prevTxCount) {
      setOpen(true);
      setTxNeedsSigning(true);
    }
  }, [txCount, prevTxCount, setTxNeedsSigning]);

  return (
    <div ref={ref}>
      <Button
        mode="tertiaryOutline"
        isFullRounded
        setTriggerRef={setTriggerRef}
        // onClick={() => isMobile && setIsButtonVisible((prevState) => !prevState)}
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            user={user}
            userName={profile?.displayName || user?.name || ''}
            size="xxs"
          />
          <MemberReputation
            userReputation={userReputation}
            totalReputation={totalReputation}
          />
        </div>
      </Button>
      {(visible || (isOpen && txNeedsSigning)) && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames={clsx({
            'w-full border-none shadow-none': isMobile,
          })}
        >
          <div className="p-4 md:p-0" ref={setTooltipRef}>
            <UserHub
              transactionAndMessageGroups={transactionsAndMessages}
              autoOpenTransaction={txNeedsSigning}
              setAutoOpenTransaction={setTxNeedsSigning}
              isTranactionTabVisible={isOpen && txNeedsSigning}
            />
          </div>
        </PopoverBase>
      )}
    </div>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
