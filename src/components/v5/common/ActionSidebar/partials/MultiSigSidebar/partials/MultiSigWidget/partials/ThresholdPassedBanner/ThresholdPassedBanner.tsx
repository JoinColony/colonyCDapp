import { type ColonyRole } from '@colony/colony-js';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { MULTI_SIG_HELP_URL } from '~constants/externalUrls.ts';
import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { type MultiSigUserSignature } from '~types/graphql.ts';
import { type Threshold } from '~types/multiSig.ts';
import { getMultipleRolesText } from '~utils/colonyRoles.ts';
import { formatText } from '~utils/intl.ts';

import { useRelevantUserRoles } from '../../../../hooks/useRelevantUserRoles.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget.partials.ThresholdPassedBanner';

interface ThresholdPassedBannerProps {
  approvalsPerRole: Record<number, MultiSigUserSignature[]>;
  rejectionsPerRole: Record<number, MultiSigUserSignature[]>;
  thresholdPerRole: Threshold;
  requiredRoles: ColonyRole[];
  multiSigDomainId: number;
}

const MSG = defineMessages({
  cantApproveText: {
    id: `${displayName}.cantApproveText`,
    defaultMessage:
      'The {passedRoles} {numberOfPassedRoles, plural, one {permission has} other {permissions have}} passed the required threshold. Only the {remainingRoles} {numberOfRemainingRoles, plural, one {permission is} other {permissions are}} required to approve. Your approval won’t count towards the total. ',
  },
  cantRejectText: {
    id: `${displayName}.cantRejectText`,
    defaultMessage:
      'The {passedRoles} {numberOfPassedRoles, plural, one {permission has} other {permissions have}} passed the required threshold. Only the {remainingRoles} {numberOfRemainingRoles, plural, one {permission is} other {permissions are}} required to reject. Your rejection won’t count towards the total. ',
  },
  learnMoreLink: {
    id: `${displayName}.learnMoreLink`,
    defaultMessage: 'Learn more',
  },
});

// This component assumes you won't render it if the user has already signed the multisig
const ThresholdPassedBanner: FC<ThresholdPassedBannerProps> = ({
  rejectionsPerRole,
  approvalsPerRole,
  thresholdPerRole,
  requiredRoles,
  multiSigDomainId,
}) => {
  const { relevantUserRoles } = useRelevantUserRoles({
    requiredRoles,
    domainId: multiSigDomainId,
  });
  const rolesPassedApproval: number[] = [];
  const rolesRemainingApproval: number[] = [];

  const rolesPassedRejection: number[] = [];
  const rolesRemainingRejection: number[] = [];

  Object.keys(approvalsPerRole).forEach((role) => {
    const approvals = approvalsPerRole[role]?.length || 0;

    if (!thresholdPerRole || !thresholdPerRole[role]) {
      return;
    }

    const roleThreshold = thresholdPerRole[role];

    if (approvals >= roleThreshold) {
      rolesPassedApproval.push(Number(role));
    } else {
      rolesRemainingApproval.push(Number(role));
    }
  });

  Object.keys(rejectionsPerRole).forEach((role) => {
    const approvals = rejectionsPerRole[role]?.length || 0;

    if (!thresholdPerRole || !thresholdPerRole[role]) {
      return;
    }

    const roleThreshold = thresholdPerRole[role];

    if (approvals >= roleThreshold) {
      rolesPassedRejection.push(Number(role));
    } else {
      rolesRemainingRejection.push(Number(role));
    }
  });

  const userRolesPassedApproval = relevantUserRoles.filter((role) =>
    rolesPassedApproval.includes(role),
  );
  const userRolesNotPassedApproval = relevantUserRoles.filter(
    (role) => !userRolesPassedApproval.includes(role),
  );

  const userRolesPassedRejection = relevantUserRoles.filter((role) =>
    rolesPassedRejection.includes(role),
  );
  const userRolesNotPassedRejection = relevantUserRoles.filter(
    (role) => !userRolesPassedRejection.includes(role),
  );

  // @TODO tweak what to do if both are true

  // if there are more roles that have passed the approval threshold and user has no roles to approve with left
  if (
    userRolesPassedApproval.length > 0 &&
    userRolesNotPassedApproval.length === 0
  ) {
    const remainingApprovalRoles = requiredRoles.filter(
      (role) => !rolesPassedApproval.includes(role),
    );

    return (
      <div className="flex flex-col gap-1 bg-negative-100 px-4 py-3 text-negative-400">
        <p className="text-sm">
          {formatText(MSG.cantApproveText, {
            passedRoles: getMultipleRolesText(userRolesPassedApproval),
            numberOfPassedRoles: userRolesPassedApproval.length,
            remainingRoles: getMultipleRolesText(remainingApprovalRoles),
            numberOfRemainingRoles: remainingApprovalRoles.length,
          })}
        </p>
        <ExternalLink
          className="text-xs font-medium text-negative-400 underline"
          href={MULTI_SIG_HELP_URL}
        >
          {formatText(MSG.learnMoreLink)}
        </ExternalLink>
      </div>
    );
  }

  // if there are more roles that have passed the rejection threshold and user has no roles to reject with left
  if (
    userRolesPassedRejection.length > 0 &&
    userRolesNotPassedRejection.length === 0
  ) {
    const remainingRejectionRoles = requiredRoles.filter(
      (role) => !rolesPassedRejection.includes(role),
    );

    return (
      <div className="flex flex-col gap-1 bg-negative-100 px-4 py-3 text-negative-400">
        <p className="text-sm">
          {formatText(MSG.cantRejectText, {
            passedRoles: getMultipleRolesText(userRolesPassedRejection),
            numberOfPassedRoles: userRolesPassedRejection.length,
            remainingRoles: getMultipleRolesText(remainingRejectionRoles),
            numberOfRemainingRoles: remainingRejectionRoles.length,
          })}
        </p>
        <ExternalLink
          className="text-xs font-medium text-negative-400 underline"
          href={MULTI_SIG_HELP_URL}
        >
          {formatText(MSG.learnMoreLink)}
        </ExternalLink>
      </div>
    );
  }

  return null;
};

ThresholdPassedBanner.displayName = displayName;
export default ThresholdPassedBanner;
