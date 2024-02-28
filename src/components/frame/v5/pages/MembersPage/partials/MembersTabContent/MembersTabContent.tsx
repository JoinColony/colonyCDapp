import { UserPlus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { APP_URL } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useFilterContext } from '~context/FilterContext.tsx';
import { useSearchContext } from '~context/SearchContext.tsx';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import MemberCardList from '~v5/common/MemberCardList/index.ts';
import { TextButton } from '~v5/shared/Button/index.ts';

import { useMembersTabContentItems } from './hooks.tsx';
import { type MembersTabContentProps } from './types.ts';

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
  const { selectedFilterCount } = useFilterContext();
  const { searchValue } = useSearchContext();

  const showPlaceholderCard =
    user && !withSimpleCards && canInteractWithColony && items.length < 12;
  const colonyURL = `${APP_URL.origin}/${colonyName}`;

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
            showPlaceholderCard && items.length > 0
              ? {
                  description: formatText({
                    id: 'membersPage.inviteMembers.description',
                  }),
                  buttonProps: {
                    text: formatText({ id: 'members.subnav.invite' }),
                    icon: UserPlus,
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
          (selectedFilterCount > 0 || searchValue) && (
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
