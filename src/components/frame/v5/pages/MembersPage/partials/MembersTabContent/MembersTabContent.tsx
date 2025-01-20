import { UserPlus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { APP_URL } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useFilterContext } from '~context/FilterContext/FilterContext.ts';
import { useSearchContext } from '~context/SearchContext/SearchContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import MemberCard from '~v5/common/MemberCard/index.ts';
import MemberCardSkeleton from '~v5/common/MemberCard/MemberCardSkeleton.tsx';
import MemberCardList from '~v5/common/MemberCardList/index.ts';
import SimpleMemberCard from '~v5/common/SimpleMemberCard/SimpleMemberCard.tsx';
import SimpleMemberCardSkeleton from '~v5/common/SimpleMemberCard/SimpleMemberCardSkeleton.tsx';
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
      <div className="w-full flex-grow sm:w-auto">
        <MemberCardList
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
        >
          {items.map((item) => {
            if (withSimpleCards) {
              return (
                <SimpleMemberCard
                  key={item.member.walletAddress}
                  userAddress={item.member.walletAddress}
                  user={item.member.user ?? undefined}
                  meatBallMenuProps={item.meatBallMenuProps}
                />
              );
            }

            return (
              <MemberCard
                key={item.member.walletAddress}
                userAddress={item.member.walletAddress}
                user={item.member.user ?? undefined}
                domains={item.member.domains}
                meatBallMenuProps={item.meatBallMenuProps}
                reputation={item.member.reputation}
                isVerified={item.member.isVerified}
                contributorType={item.member.contributorType}
              />
            );
          })}
        </MemberCardList>
        {!isLoading &&
          !items.length &&
          emptyContentProps &&
          (selectedFilterCount > 0 || searchValue) && (
            <EmptyContent {...emptyContentProps} withBorder />
          )}
        {isLoading && withSimpleCards && (
          <MemberCardList isSimple>
            {[...Array(16).keys()].map((key) => (
              <SimpleMemberCardSkeleton key={key} />
            ))}
          </MemberCardList>
        )}
        {isLoading && !withSimpleCards && (
          <MemberCardList>
            {[...Array(8).keys()].map((key) => (
              <MemberCardSkeleton key={key} />
            ))}
          </MemberCardList>
        )}
        {loadMoreButtonProps && (
          <div className="mt-6 flex w-full justify-center">
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
