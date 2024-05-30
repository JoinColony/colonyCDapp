import { CircleWavyCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import { noop } from 'lodash';
import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ContributorType, useGetColonyContributorQuery } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useContributorBreakdown from '~hooks/members/useContributorBreakdown.ts';
import { getColonyContributorId } from '~utils/members.ts';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import UserDetails from '../UserDetails/UserDetails.tsx';

import UserInfo from './partials/UserInfo.tsx';
import UserNotVerified from './partials/UserNotVerified.tsx';
import { type UserInfoPopoverProps } from './types.ts';

const displayName = 'v5.UserInfoPopover';

const UserInfoPopover: FC<PropsWithChildren<UserInfoPopoverProps>> = ({
  className,
  walletAddress,
  user,
  children,
  popperOptions,
  withVerifiedBadge = true,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = user || {};
  const { avatar, displayName: userName } = profile || {};

  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data: colonyContributorData } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
    fetchPolicy: 'cache-first',
  });

  const contributor = colonyContributorData?.getColonyContributor;
  const { bio } = contributor?.user?.profile || {};
  const { isVerified, type: contributorType } = contributor || {};
  const domains = useContributorBreakdown(contributor);

  const onOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: popperOptions?.placement || 'bottom-end',
      trigger: ['click'],
      interactive: true,
    });

  const button = (
    <button
      onClick={isMobile ? onOpenModal : noop}
      onMouseEnter={isMobile ? noop : () => onOpenModal()}
      onMouseLeave={isMobile ? noop : () => onCloseModal()}
      type="button"
      ref={setTriggerRef}
      className={clsx(
        'inline-flex flex-shrink-0 items-center transition-all duration-normal hover:text-blue-400',
        className,
      )}
    >
      {children}
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
          isTopSectionWithBackground={isTopSectionWithBackground}
        >
          {content}
        </Modal>
      ) : (
        <>
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              classNames="max-w-[20rem]"
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
          )}
        </>
      )}
    </>
  );
};

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
