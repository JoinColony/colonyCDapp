import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import { noop } from 'lodash';
import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext.tsx';
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

const displayName = 'v5.UserPopover';

const UserPopover: FC<PropsWithChildren<UserPopoverProps>> = ({
  userName,
  walletAddress = '',
  user,
  size,
  children,
  additionalContent,
  popperOptions,
  withVerifiedBadge = true,
  className,
  wrapperClassName,
}) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = user || {};
  const { avatar, thumbnail } = profile || {};

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

  const buttonComponent = (
    <button
      onClick={isMobile ? onOpenModal : noop}
      onMouseEnter={isMobile ? noop : () => onOpenModal()}
      onMouseLeave={isMobile ? noop : () => onCloseModal()}
      type="button"
      ref={setTriggerRef}
      className={clsx(
        className,
        'inline-flex transition-all duration-normal hover:text-blue-400 flex-shrink-0',
      )}
    >
      {children}
    </button>
  );

  const button = withVerifiedBadge ? (
    <div className={clsx(wrapperClassName, 'items-center flex flex-shrink-0')}>
      {buttonComponent}
      {isVerified && <SealCheck size={14} className="text-blue-400 ml-1" />}
    </div>
  ) : (
    buttonComponent
  );

  const content = (
    <UserInfo
      size={size}
      userName={userName}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      aboutDescription={bio || ''}
      avatar={thumbnail || avatar || ''}
      userStatus={userStatus}
      domains={domains}
      additionalContent={
        <>
          {additionalContent}
          {!isVerified && (
            <UserPopoverAdditionalContent
              description={
                <div className="mt-2 font-semibold break-words text-sm pb-2">
                  {user?.walletAddress}
                </div>
              }
            />
          )}
        </>
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
                  'border-2 border-purple-200 overflow-hidden ':
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
