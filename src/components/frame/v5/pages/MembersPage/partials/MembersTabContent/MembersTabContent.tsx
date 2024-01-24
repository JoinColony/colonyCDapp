import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import { useAppContext } from '~context/AppContext';
import { useColonyContext } from '~context/ColonyContext';
import useCopyToClipboard from '~hooks/useCopyToClipboard';
import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import EmptyContent from '~v5/common/EmptyContent';
import MemberCardList from '~v5/common/MemberCardList';
import { TextButton } from '~v5/shared/Button';

import { useMembersTabContentItems } from './hooks';
import { MembersTabContentProps } from './types';

const MembersTabContent: FC<PropsWithChildren<MembersTabContentProps>> = ({
  items: itemsProp,
  isLoading,
  loadMoreButtonProps,
  withSimpleCards,
  children,
  contentClassName,
  emptyContentProps,
}) => {
  const items = useMembersTabContentItems(itemsProp);
  const {
    colony: { name: colonyName },
    canInteractWithColony,
  } = useColonyContext();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();
  const { user } = useAppContext();

  const showPlaceholderCard =
    user && !withSimpleCards && canInteractWithColony && items.length < 12;
  const colonyURL = `${window.location.origin}/${colonyName}`;

  return (
    <div
      className={clsx(contentClassName, 'w-full', {
        'flex items-start gap-6': children,
      })}
    >
      <div className="flex-grow w-full sm:w-auto">
        <MemberCardList
          items={items}
          isSimple={withSimpleCards}
          placeholderCardProps={
            showPlaceholderCard
              ? {
                  description: formatText({
                    id: 'membersPage.inviteMembers.description',
                  }),
                  buttonProps: {
                    text: formatText({ id: 'members.subnav.invite' }),
                    iconName: 'user-plus',
                    onClick: () => handleClipboardCopy(colonyURL),
                  },
                  buttonTooltipProps: {
                    tooltipContent: formatText({
                      id: 'linkCopied',
                    }),
                    isOpen: isCopied,
                    isSuccess: true,
                  },
                }
              : undefined
          }
        />
        {!isLoading &&
          !items.length &&
          emptyContentProps &&
          !showPlaceholderCard && (
            <EmptyContent {...emptyContentProps} withBorder />
          )}
        {isLoading && (
          <div
            className={clsx('flex justify-center items-center w-full', {
              'mt-6': !!items.length,
            })}
          >
            <SpinnerLoader />
          </div>
        )}
        {loadMoreButtonProps && (
          <div className="w-full flex justify-center mt-6">
            <TextButton
              {...loadMoreButtonProps}
              disabled={isLoading}
              text={loadMoreButtonProps.text || formatText({ id: 'loadMore' })}
            />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default MembersTabContent;
