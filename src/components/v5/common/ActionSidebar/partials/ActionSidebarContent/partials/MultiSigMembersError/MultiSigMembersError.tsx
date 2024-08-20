import { Id } from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import { useEffect, type FC } from 'react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import {
  ACTION_TYPE_FIELD_NAME,
  FROM_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

import { useHasEnoughMembersWithPermissions } from './useHasEnoughMembersWithPermissions.ts';

const displayName =
  'v5.common.ActionSidebar.ActionSidebarContent.MultiSigMembersError';

// Needs these two props to notice the parent about the loading state and sync the can create value
// It's conditionally rendered, so it won't slow down the app until we choose Multi-Sig as the decision method
interface MultiSigMembersErrorProps {
  updateMembersLoadingState: (isLoading: boolean) => void;
  updateCanCreateAction: (canCreate: boolean) => void;
}

export const MultiSigMembersError: FC<MultiSigMembersErrorProps> = ({
  updateMembersLoadingState,
  updateCanCreateAction,
}) => {
  const { watch } = useFormContext();
  const [selectedAction, fromDomain, team] = watch([
    ACTION_TYPE_FIELD_NAME,
    FROM_FIELD_NAME,
    TEAM_FIELD_NAME,
  ]);
  const domainId = fromDomain ?? team ?? Id.RootDomain;

  const { isLoading, hasEnoughMembersWithPermissions } =
    useHasEnoughMembersWithPermissions({
      domainId,
      selectedAction,
    });

  useEffect(() => {
    updateMembersLoadingState(isLoading);
  }, [isLoading, updateMembersLoadingState]);

  useEffect(() => {
    updateCanCreateAction(hasEnoughMembersWithPermissions);
  }, [hasEnoughMembersWithPermissions, updateCanCreateAction]);

  if (!hasEnoughMembersWithPermissions) {
    return (
      <div className="mt-6">
        <NotificationBanner icon={WarningCircle} status="error">
          <FormattedMessage id="actionSidebar.notEnoughMembersWithPermissions" />
        </NotificationBanner>
      </div>
    );
  }

  return null;
};

MultiSigMembersError.displayName = displayName;
