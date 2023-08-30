import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import {
  useAppContext,
  useColonyContext,
  useDetectClickOutside,
  useMobile,
  useUserReputation,
} from '~hooks';

import UserHub from '~common/Extensions/UserHub';
import Button from '~v5/shared/Button';
import PopoverBase from '~v5/shared/PopoverBase';
import UserAvatar from '~v5/shared/UserAvatar';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import styles from './UserReputation.module.css';
import { UserReputationProps } from './types';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserReputation';

const UserReputation: FC<UserReputationProps> = ({
  hideColonies,
  hideMemberReputationOnMobile,
}) => {
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const isMobile = useMobile();
  const { profile } = user || {};
  const [, setIsWalletButtonVisible] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [txNeedsSigning, setTxNeedsSigning] = useState(false);

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

  const ref = useDetectClickOutside({
    onTriggered: () => {
      setOpen(false);
      setTxNeedsSigning(false);
    },
  });
  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isUserHubOpen,
  } = usePopperTooltip(
    {
      delayShow: isMobile ? 0 : 200,
      delayHide: isMobile ? 0 : 200,
      placement: isMobile ? 'bottom' : 'bottom-end',
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

  /*
   * I have commented out the below for two reasons:
   * 1. Need to check we even need to auto-open the user hub, given that
   * users now sign txs in metamask and not there
   * 2. If yes to the above, we should listen for the action in redux that triggers metamask to open,
   * and then open the user hub. No need to count txs.
   */
  // @ts-ignore
  // const transactionsAndMessages = transactionAndMessageGroups.toJS();
  // const txCount = useMemo(
  //   () => transactionCount(transactionsAndMessages),
  //   [transactionsAndMessages],
  // );

  // const prevTxCount: number | void = usePrevious(txCount);

  // useEffect(() => {
  //   // this condition always will be false until we will be able to trigger transactions in Extension page
  //   if (prevTxCount != null && txCount > prevTxCount) {
  //     setOpen(true);
  //     setTxNeedsSigning(true);
  //   }
  // }, [txCount, prevTxCount, setTxNeedsSigning]);

  return (
    <div ref={ref}>
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        setTriggerRef={setTriggerRef}
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            user={user}
            userName={profile?.displayName || user?.name}
            size="xxs"
          />
          {!hideColonies && (
            <MemberReputation
              userReputation={userReputation}
              totalReputation={totalReputation}
              hideOnMobile={hideMemberReputationOnMobile}
            />
          )}
        </div>
      </Button>
      {(isUserHubOpen || (isOpen && txNeedsSigning)) && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames={clsx(styles.popover)}
        >
          <div
            className="w-full sm:w-[42.625rem] pt-4 sm:pt-0"
            ref={setTooltipRef}
          >
            <UserHub
              autoOpenTransaction={txNeedsSigning}
              setAutoOpenTransaction={setTxNeedsSigning}
              isTransactionTabVisible={isOpen && txNeedsSigning}
            />
          </div>
        </PopoverBase>
      )}
    </div>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
