import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~shared/NavLink';
import Heading from '~shared/Heading';
import { Tooltip } from '~shared/Popover';
import UserAvatar from '~shared/UserAvatar';
// import Icon from '~shared/Icon';
import InviteLinkButton from '~shared/Button/InviteLinkButton';

// import { useAvatarDisplayCounter, useTransformer } from '~hooks';
// import {
//   Colony,
//   ColonyContributor,
//   ColonyWatcher,
// } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useAppContext } from '~hooks';
import { Colony, User } from '~types';

import styles from './ColonyMembersWidget.css';

const displayName = 'common.ColonyHome.ColonyMembersWidget.MembersSubsection';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{isContributorsSubsection, select,
      true { Contributors }
      other { Watchers }
    } {hasCounter, select,
        true { ({count})}
        false {}
        other {}
      }`,
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading members information...',
  },
  reputationFetchFailed: {
    id: `${displayName}.reputationFetchFailed`,
    defaultMessage: `Failed to fetch the colony's
      {isContributorsSubsection, select,
        true { contributors }
        other { watchers }
      }
    `,
  },
  tooltipText: {
    id: `${displayName}.tooltipText`,
    defaultMessage: `{isContributorsSubsection, select,
      true {Contributors are members of the Colony who have earned reputation.}
      other { Watchers are members of the Colony
         who currently don't have any reputation. }
    }`,
  },
  viewMore: {
    id: `${displayName}.viewMore`,
    defaultMessage: 'View more',
  },
});

interface Props {
  colony: Colony;
  currentDomainId?: number;
  maxAvatars?: number;
  // members?: ColonyContributor[] | ColonyWatcher[];
  isContributorsSubsection: boolean;
}

// const MAX_AVATARS = 12;

const MembersSubsection = ({
  colony: { name, watchers },
  // members,
  isContributorsSubsection,
  colony,
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
}: // maxAvatars = MAX_AVATARS,
Props) => {
  const colonyWatchers = useMemo(() => watchers?.items || [], [watchers]);
  const { user } = useAppContext();
  // const hasRegisteredProfile = user?.name;
  // const canAdministerComments =
  //   userHasAccountRegistered &&
  //   (hasRoot(allUserRoles) || canAdminister(allUserRoles));

  // const {
  //   avatarsDisplaySplitRules,
  //   remainingAvatarsCount,
  // } = useAvatarDisplayCounter(maxAvatars, members || [], false);

  const BASE_MEMBERS_ROUTE = `/colony/${name}/members`;
  const membersPageRoute =
    currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
      ? BASE_MEMBERS_ROUTE
      : `${BASE_MEMBERS_ROUTE}/${currentDomainId}`;

  const setHeading = useCallback(
    (hasCounter) => (
      <div className={styles.heading}>
        <Tooltip
          content={
            <div className={styles.tooltip}>
              <FormattedMessage
                {...MSG.tooltipText}
                values={{ isContributorsSubsection }}
              />
            </div>
          }
        >
          <NavLink to={membersPageRoute}>
            <Heading
              appearance={{ size: 'normal', weight: 'bold' }}
              text={MSG.title}
              textValues={{
                count: colonyWatchers?.length,
                hasCounter,
                isContributorsSubsection,
              }}
            />
          </NavLink>
        </Tooltip>
        {!isContributorsSubsection && (
          <InviteLinkButton
            colonyName={name}
            buttonAppearance={{ theme: 'blue' }}
          />
        )}
      </div>
    ),
    [isContributorsSubsection, membersPageRoute, colonyWatchers, name],
  );

  if (!colonyWatchers) {
    return (
      <div className={styles.main}>
        {setHeading(false)}
        <span className={styles.loadingText}>
          <FormattedMessage
            {...MSG.reputationFetchFailed}
            values={{ isContributorsSubsection }}
          />
        </span>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {setHeading(true)}
      <ul className={styles.userAvatars}>
        {(colonyWatchers as { user: User }[])
          // .slice(0, avatarsDisplaySplitRules)
          .map(({ user: { walletAddress } }) => (
            <li className={styles.userAvatar} key={walletAddress}>
              <UserAvatar
                size="xs"
                address={walletAddress}
                // banned={canAdministerComments && banned}
                showInfo
                notSet={false}
                colony={colony}
                user={user}
                popperOptions={{
                  placement: 'bottom',
                  showArrow: false,
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        /*
                         * @NOTE Values are set manual, exactly as the ones provided in the figma spec.
                         *
                         * There's no logic to how they are calculated, so next time you need
                         * to change them you'll either have to go by exact specs, or change
                         * them until it "feels right" :)
                         */
                        offset: [-208, -12],
                      },
                    },
                  ],
                }}
              />
              {/* {canAdministerComments && banned && (
                  <div className={styles.userBanned}>
                    <Icon
                      appearance={{ size: 'extraTiny' }}
                      name="shield-pink"
                      title={{ id: 'label.banned' }}
                    />
                  </div>
                )} */}
            </li>
          ))}
        {/* {!!remainingAvatarsCount && (
          <li className={styles.remaningAvatars}>
            <NavLink to={membersPageRoute} title={MSG.viewMore}>
              {remainingAvatarsCount < 99 ? remainingAvatarsCount : `>99`}
            </NavLink>
          </li>
        )} */}
      </ul>
    </div>
  );
};

MembersSubsection.displayName = displayName;

export default MembersSubsection;
