import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useGetColonyContributorQuery } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useContributorBreakdown from '~hooks/members/useContributorBreakdown.ts';
import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { getColonyContributorId } from '~utils/members.ts';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types.ts';
import Modal from '~v5/shared/Modal/index.ts';

import MenuContainer from '../MenuContainer/index.ts';
import Portal from '../Portal/Portal.tsx';
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
  dropdownPlacementProps,
  withVerifiedBadge = true,
  className,
  wrapperClassName,
}) => {
  const isMobile = useMobile();
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

  const [
    isOpen,
    { toggleOn: openModal, toggleOff: closeModal, registerContainerRef },
  ] = useToggle();
  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isOpen], dropdownPlacementProps);

  const buttonComponent = (
    <button
      onClick={openModal}
      type="button"
      ref={relativeElementRef}
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
          onClose={closeModal}
          isOpen={isOpen}
          isTopSectionWithBackground={isTopSectionWithBackground}
        >
          {content}
        </Modal>
      ) : (
        <>
          {isOpen && (
            <Portal>
              <div
                ref={(ref) => {
                  registerContainerRef(ref);
                  portalElementRef.current = ref;
                }}
                className="absolute z-[65] md:z-[60]"
              >
                <MenuContainer
                  className={clsx(
                    'w-full bg-base-white max-w-[20rem] max-h-[inherit] !overflow-y-auto',
                    {
                      'p-6': !isTopSectionWithBackground,
                      'border-2 border-purple-200 overflow-hidden ':
                        userStatus === 'top',
                    },
                  )}
                  rounded="s"
                  hasShadow
                  withPadding={!isTopSectionWithBackground}
                >
                  {content}
                </MenuContainer>
              </div>
            </Portal>
          )}
        </>
      )}
    </>
  );
};

UserPopover.displayName = displayName;

export default UserPopover;
