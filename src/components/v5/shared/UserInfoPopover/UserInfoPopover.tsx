import { CircleWavyCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import { noop } from 'lodash';
import React, { type FC, useCallback, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { ContributorType, useGetColonyContributorQuery } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useContributorBreakdown from '~hooks/members/useContributorBreakdown.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { getColonyContributorId } from '~utils/members.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import UserDetails from '../UserDetails/UserDetails.tsx';

import UserInfo from './partials/UserInfo.tsx';
import UserNotVerified from './partials/UserNotVerified.tsx';
import { type UserInfoPopoverProps } from './types.ts';

const displayName = 'v5.UserInfoPopover';

const UserInfoPopover: FC<UserInfoPopoverProps> = ({
  className,
  walletAddress,
  user,
  children,
  popperOptions,
  withVerifiedBadge = true,
  withUserName,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { totalMembers, loading: isColonyMembersDataLoading } =
    useMemberContext();

  const contributorData = totalMembers.find(
    (member) => member?.contributorAddress === walletAddress,
  );

  const {
    data: colonyContributorData,
    loading: isColonyContributorDataLoading,
  } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
    fetchPolicy: 'cache-first',
    skip: !!contributorData,
  });

  const contributor =
    contributorData || colonyContributorData?.getColonyContributor;
  const { bio } = contributor?.user?.profile || {};
  const { isVerified, type: contributorType } = contributor || {};
  const domains = useContributorBreakdown(contributor);
  const resolvedUser = contributor?.user ?? user;
  const { profile } = resolvedUser || {};
  const { avatar, displayName: userName } = profile || {};

  const onOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const [
    isTooltipVisible,
    {
      toggleOn: toggleOnTooltip,
      toggleOff: toggleOffTooltip,
      registerContainerRef,
    },
  ] = useToggle();

  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      delayShow: 200,
      delayHide: 200,
      placement: popperOptions?.placement || 'bottom-end',
      trigger: ['click'],
      interactive: true,
    },
    popperOptions,
  );

  const button = (
    <button
      ref={setTriggerRef}
      onClick={isMobile ? onOpenModal : toggleOnTooltip}
      onMouseEnter={isMobile ? noop : () => onOpenModal()}
      onMouseLeave={isMobile ? noop : () => onCloseModal()}
      type="button"
      className={clsx(
        'inline-flex flex-shrink-0 items-center transition-all duration-normal hover:text-blue-400',
        className,
        {
          skeleton:
            isColonyMembersDataLoading || isColonyContributorDataLoading,
        },
      )}
      disabled={isColonyMembersDataLoading || isColonyContributorDataLoading}
    >
      {typeof children === 'function'
        ? children(resolvedUser ?? undefined)
        : children}
      {withUserName && <>{userName || splitWalletAddress(walletAddress)}</>}
      {withVerifiedBadge && isVerified && (
        <CircleWavyCheck
          size={14}
          className="ml-1 flex-shrink-0 text-blue-400"
        />
      )}
    </button>
  );

  const content = (
    <UserInfo
      aboutDescription={bio || ''}
      contributorType={contributorType ?? undefined}
      domains={domains}
      userDetails={
        <UserDetails
          isVerified={isVerified}
          userName={userName}
          userAvatarSrc={avatar ?? undefined}
          walletAddress={walletAddress}
          contributorType={contributorType ?? undefined}
        />
      }
      additionalContent={
        !isVerified ? (
          <UserNotVerified
            onClick={toggleOffTooltip}
            walletAddress={walletAddress}
            description={
              <div className="mt-2 break-words pb-2 text-sm font-semibold">
                {walletAddress}
              </div>
            }
          />
        ) : null
      }
    />
  );

  const isTopSectionWithBackground = contributorType === ContributorType.Top;

  return (
    <>
      {button}
      {isMobile ? (
        <Modal
          isFullOnMobile={false}
          onClose={onCloseModal}
          isOpen={isOpen}
          withPadding={false}
          withPaddingBottom
          withBorder={isTopSectionWithBackground}
        >
          {content}
        </Modal>
      ) : (
        <>
          {isTooltipVisible && (
            <span ref={registerContainerRef}>
              <PopoverBase
                setTooltipRef={setTooltipRef}
                tooltipProps={getTooltipProps}
                classNames="sm:w-[20rem]"
                withTooltipStyles={false}
                cardProps={{
                  rounded: 's',
                  className: clsx('bg-base-white', {
                    'overflow-hidden border-2 border-purple-200 ':
                      isTopSectionWithBackground,
                  }),
                  hasShadow: true,
                }}
                isTopSectionWithBackground={
                  isTopSectionWithBackground && isMobile
                }
              >
                {content}
              </PopoverBase>
            </span>
          )}
        </>
      )}
    </>
  );
};

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
