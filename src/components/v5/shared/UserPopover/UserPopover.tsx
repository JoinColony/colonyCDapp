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
import { useGetColonyContributorQuery } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useContributorBreakdown from '~hooks/members/useContributorBreakdown.ts';
import { getColonyContributorId } from '~utils/members.ts';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types.ts';
import Modal from '~v5/shared/Modal/index.ts';
import PopoverBase from '~v5/shared/PopoverBase/index.ts';

import UserPopoverAdditionalContent from '../UserPopoverAdditionalContent/index.ts';

import UserInfo from './partials/UserInfo.tsx';
import { type UserPopoverProps } from './types.ts';
import UserDetails from '../UserDetails/UserDetails.tsx';

const displayName = 'v5.UserPopover';

const UserPopover: FC<PropsWithChildren<UserPopoverProps>> = ({
  className,
  userName,
  walletAddress,
  user,
  size,
  children,
  popperOptions,
  withVerifiedBadge = true,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = user || {};
  const { avatar } = profile || {};

  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data: colonyContributorData } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
  });

  const contributor = colonyContributorData?.getColonyContributor;
  const { bio } = contributor?.user?.profile || {};
  const { isVerified } = contributor || {};
  const domains = useContributorBreakdown(contributor);

  const userStatus = (contributor?.type?.toLowerCase() ??
    null) as ContributorTypeFilter | null;

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
        className,
        'inline-flex flex-shrink-0 items-center transition-all duration-normal hover:text-blue-400',
      )}
    >
      {children}
      {withVerifiedBadge && isVerified && (
        <CircleWavyCheck size={14} className="ml-1 text-blue-400" />
      )}
    </button>
  );

  const content = (
    <UserInfo
      aboutDescription={bio || ''}
      userStatus={userStatus}
      domains={domains}
      userDetails={
        <UserDetails
          isVerified={isVerified}
          size={size}
          userName={userName}
          userAvatarSrc={avatar ?? undefined}
          userStatus={userStatus}
          walletAddress={walletAddress}
        />
      }
      additionalContent={
        !isVerified ? (
          <UserPopoverAdditionalContent
            description={
              <div className="mt-2 font-semibold break-words text-sm pb-2">
                {user?.walletAddress}
              </div>
            }
          />
        ) : null
      }
    />
  );

  const isTopSectionWithBackground = userStatus === ContributorTypeFilter.Top;

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
                  'p-6': !isTopSectionWithBackground,
                  'overflow-hidden border-2 border-purple-200 ':
                    userStatus === 'top',
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

UserPopover.displayName = displayName;

export default UserPopover;
