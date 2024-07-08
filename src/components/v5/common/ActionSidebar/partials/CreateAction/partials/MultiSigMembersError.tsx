import { Id } from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import { useEffect, type FC, useMemo } from 'react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { useIsEnoughSignees } from '~hooks/multiSig/useIsEnoughSignees.ts';
import {
  FROM_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { getPermissionsNeededForAction } from '~v5/common/ActionSidebar/hooks/permissions/helpers.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

const displayName =
  'v5.common.ActionSidebar.ActionSidebarContent.MultiSigMembersError';

// Needs these two props to notice the parent about the loading state and sync the can create value
// It's conditionally rendered, so it won't slow down the app until we choose Multi-Sig as the decision method
interface MultiSigMembersErrorProps {
  action?: Action;
  updateMembersLoadingState: (isLoading: boolean) => void;
  updateCanCreateAction: (canCreate: boolean) => void;
}

const MultiSigMembersError: FC<MultiSigMembersErrorProps> = ({
  action,
  updateMembersLoadingState,
  updateCanCreateAction,
}) => {
  const { watch } = useFormContext();
  const formValues = watch();
  const [fromDomain, team] = watch([FROM_FIELD_NAME, TEAM_FIELD_NAME]);

  const permissionDomainId = useMemo(() => {
    // for both of these actions you need roles in the parent domain
    if (
      action === Action.TransferFunds ||
      action === Action.ManagePermissions
    ) {
      return Id.RootDomain;
    }

    return fromDomain ?? team ?? Id.RootDomain;
  }, [fromDomain, action, team]);

  const thresholdDomainId = useMemo(() => {
    if (
      action === Action.TransferFunds ||
      action === Action.ManagePermissions
    ) {
      return Id.RootDomain;
    }

    return fromDomain ?? team ?? Id.RootDomain;
  }, [fromDomain, action, team]);

  const requiredRoles = useMemo(() => {
    if (action) {
      return getPermissionsNeededForAction(action, formValues);
    }
    return [];
  }, [action, formValues]);

  /*
   * This may seem like a hack, but for display purposes, we always fetch all possible roles
   * The only action where this can break is managing permissions in a subdomain via permissions, not via multisig, so we are good
   */
  const multiSigRoles = requiredRoles.flat();

  const { isEnoughSignees, isLoading } = useIsEnoughSignees({
    thresholdDomainId,
    permissionDomainId,
    requiredRoles: multiSigRoles,
  });

  useEffect(() => {
    updateMembersLoadingState(isLoading);
  }, [isLoading, updateMembersLoadingState]);

  useEffect(() => {
    updateCanCreateAction(isEnoughSignees);
  }, [isEnoughSignees, updateCanCreateAction]);

  if (!isEnoughSignees) {
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

export default MultiSigMembersError;
