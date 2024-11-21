import { Extension } from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { type ActionTypeNotificationProps } from './types.ts';

const displayName = 'v5.ActionTypeNotification';

const MSG = defineMessages({
  unlockedToken: {
    id: `${displayName}.unlockedToken`,
    defaultMessage: `This Colony's native token has already been unlocked and can be traded.`,
  },
  unlockedTokenError: {
    id: `${displayName}.unlockedTokenError`,
    defaultMessage: 'This action is irreversible. Use with caution.',
  },
  enterRecoveryModeError: {
    id: `${displayName}.enterRecoveryModeError`,
    defaultMessage:
      'This will disable the Colony and prevent any further activity until resolved.',
  },
  votingReputationExtensionNotEnabledError: {
    id: `${displayName}.votingReputationExtensionNotEnabledError`,
    defaultMessage:
      'Agreements requires the Reputation weighted extension to be enabled.',
  },
  stagedExpenditureExtensionNotEnabledError: {
    id: `${displayName}.stagedExpenditureExtensionNotEnabledError`,
    defaultMessage:
      'Staged payments requires the Staged payments extension to be enabled.',
  },
  learnMore: {
    id: `${displayName}.learnMore`,
    defaultMessage: 'Learn more',
  },
  viewExtension: {
    id: `${displayName}.viewExtension`,
    defaultMessage: 'View extension',
  },
});

export const ActionTypeNotification: FC<ActionTypeNotificationProps> = ({
  selectedAction,
  className,
  isFieldDisabled,
}) => {
  const { colony } = useColonyContext();
  const isNativeTokenUnlocked = !!colony?.status?.nativeToken?.unlocked;
  const navigate = useNavigate();
  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
  } = useActionSidebarContext();

  const actionTypeNotificationHref =
    (selectedAction === Action.UnlockToken &&
      'https://docs.colony.io/use/managing-funds/unlock-token/') ||
    undefined;

  const getNotificationTitle = (): string | undefined => {
    switch (selectedAction) {
      case Action.UnlockToken:
        return formatText(
          isNativeTokenUnlocked ? MSG.unlockedToken : MSG.unlockedTokenError,
        );
      case Action.EnterRecoveryMode:
        return formatText(MSG.enterRecoveryModeError);
      case Action.CreateDecision:
        return isFieldDisabled
          ? formatText(MSG.votingReputationExtensionNotEnabledError)
          : undefined;
      case Action.StagedPayment:
        return isFieldDisabled
          ? formatText(MSG.stagedExpenditureExtensionNotEnabledError)
          : undefined;
      default:
        return undefined;
    }
  };

  const notificationTitle = getNotificationTitle();

  return (
    <>
      {notificationTitle && (
        <div className={className}>
          <NotificationBanner
            status="error"
            icon={WarningCircle}
            callToAction={
              actionTypeNotificationHref ? (
                <a
                  href={actionTypeNotificationHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {formatText(MSG.learnMore)}
                </a>
              ) : (
                selectedAction === Action.CreateDecision && (
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`extensions/${Extension.VotingReputation}`);
                      toggleActionSidebarOff();
                    }}
                  >
                    {formatText(MSG.viewExtension)}
                  </button>
                )
              )
            }
          >
            {notificationTitle}
          </NotificationBanner>
        </div>
      )}
    </>
  );
};

ActionTypeNotification.displayName = displayName;

export default ActionTypeNotification;
