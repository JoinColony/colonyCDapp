import React from 'react';
import { type FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { FUND_EXPENDITURE_REQUIRED_ROLE } from '~constants/permissions.ts';
import { useIsEnoughSignees } from '~hooks/multiSig/useIsEnoughSignees.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.FundingModal.partials.MultiSigFundingMembers';
interface MultiSigFundingMembersProps {
  updateMembersLoadingState: (isLoading: boolean) => void;
  updateCanCreateAction: (canCreate: boolean) => void;
  fundingDomainId: number;
}

export const MultiSigFundingMembers: FC<MultiSigFundingMembersProps> = ({
  updateMembersLoadingState,
  updateCanCreateAction,
  fundingDomainId,
}) => {
  const { isEnoughSignees, isLoading } = useIsEnoughSignees({
    thresholdDomainId: fundingDomainId,
    permissionDomainId: fundingDomainId,
    requiredRoles: [FUND_EXPENDITURE_REQUIRED_ROLE],
  });

  useEffect(() => {
    updateMembersLoadingState(isLoading);
  }, [isLoading, updateMembersLoadingState]);

  useEffect(() => {
    updateCanCreateAction(isEnoughSignees);
  }, [isEnoughSignees, updateCanCreateAction]);

  if (!isEnoughSignees) {
    return (
      <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm font-medium text-negative-400">
        <FormattedMessage id="actionSidebar.notEnoughMembersWithPermissions" />
      </div>
    );
  }

  return null;
};

MultiSigFundingMembers.displayName = displayName;
