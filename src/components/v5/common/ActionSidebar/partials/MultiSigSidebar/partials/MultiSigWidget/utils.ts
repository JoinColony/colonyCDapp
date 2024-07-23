import { type ColonyRole } from '@colony/colony-js';
import { isBefore, parseISO, subWeeks } from 'date-fns';

import { MultiSigVote } from '~gql';
import { type MultiSigUserSignature } from '~types/graphql.ts';
import { type Threshold, type EligibleSignee } from '~types/multiSig.ts';

import { type MultiSigSignee } from './types.ts';

export const hasWeekPassed = (createdAt: string) => {
  const createdAtDate = parseISO(createdAt);

  const currentDate = new Date();

  const oneWeekAgo = subWeeks(currentDate, 1);

  return isBefore(createdAtDate, oneWeekAgo);
};

export const getNotSignedUsers = ({
  signatures,
  eligibleSignees,
}: {
  signatures: MultiSigUserSignature[];
  eligibleSignees: EligibleSignee[];
}): MultiSigSignee[] => {
  const notSignedUsers: MultiSigSignee[] = eligibleSignees
    .filter((eligibleSignee) => {
      return !signatures.find(
        (signature) => signature.userAddress === eligibleSignee.userAddress,
      );
    })
    .map((eligibleSignee) => {
      return {
        userAddress: eligibleSignee.userAddress,
        user: {
          profile: eligibleSignee.user.profile,
        },
        vote: MultiSigVote.None,
        rolesSignedWith: [],
        userRoles: eligibleSignee.userRoles,
      };
    });

  return notSignedUsers;
};

export const getAllUserSignatures = (
  signatures: MultiSigUserSignature[],
  requiredRoles: ColonyRole[],
): Record<string, MultiSigSignee> => {
  const allUserSignatures = signatures.reduce<Record<string, MultiSigSignee>>(
    (signatureMap, signature) => {
      const existingSignature: MultiSigSignee | undefined =
        signatureMap[signature.userAddress];

      if (!existingSignature) {
        return {
          ...signatureMap,
          [signature.userAddress]: {
            userAddress: signature.userAddress,
            user: signature.user,
            vote: signature.vote,
            rolesSignedWith: [signature.role],
            userRoles: requiredRoles || [], // @TODO get this from the hook for signees
          },
        };
      }

      return {
        ...signatureMap,
        [signature.userAddress]: {
          ...existingSignature,
          rolesSignedWith: [
            ...existingSignature.rolesSignedWith,
            signature.role,
          ],
        },
      };
    },
    {},
  );

  return allUserSignatures;
};

export const getSignaturesPerRole = (
  signatures: MultiSigUserSignature[],
): {
  approvalsPerRole: Record<number, MultiSigUserSignature[]>;
  rejectionsPerRole: Record<number, MultiSigUserSignature[]>;
} => {
  const approvalsPerRole = {};
  const rejectionsPerRole = {};

  signatures.forEach((signature) => {
    const { role, vote } = signature;

    if (vote === MultiSigVote.Approve) {
      if (!approvalsPerRole[role]) {
        approvalsPerRole[role] = [];
      }
      approvalsPerRole[role].push(signature);
    } else if (vote === MultiSigVote.Reject) {
      if (!rejectionsPerRole[role]) {
        rejectionsPerRole[role] = [];
      }
      rejectionsPerRole[role].push(signature);
    }
  });

  return { approvalsPerRole, rejectionsPerRole };
};

export const getNumberOfApprovals = (
  approvalsPerRole: Record<number, MultiSigUserSignature[]>,
  thresholdPerRole: Threshold,
): number => {
  const combinedApprovals = Object.entries(approvalsPerRole).reduce(
    (approvalCount, [role, approvalsForRole]) => {
      const thresholdForRole = thresholdPerRole ? thresholdPerRole[role] : 0;
      return (
        approvalCount + Math.min(approvalsForRole.length, thresholdForRole)
      );
    },
    0,
  );

  return combinedApprovals;
};

export const getNumberOfRejections = (
  rejectionsPerRole: Record<number, MultiSigUserSignature[]>,
  thresholdPerRole: Threshold,
): number => {
  const combinedRejections = Object.entries(rejectionsPerRole).reduce(
    (rejectionCount, [role, rejectionsForRole]) => {
      const thresholdForRole = thresholdPerRole ? thresholdPerRole[role] : 0;
      return (
        rejectionCount + Math.min(rejectionsForRole.length, thresholdForRole)
      );
    },
    0,
  );

  return combinedRejections;
};

export const getIsMultiSigExecutable = (
  approvalsPerRole: Record<number, MultiSigUserSignature[]>,
  thresholdPerRole: Threshold,
): boolean => {
  const isMultiSigExecutable =
    Object.keys(approvalsPerRole).length > 0 &&
    Object.keys(approvalsPerRole).every((role) => {
      const approvals = approvalsPerRole[role]?.length || 0;
      if (!thresholdPerRole || !thresholdPerRole[role]) {
        return false;
      }
      const roleThreshold = thresholdPerRole[role];
      return approvals >= roleThreshold;
    });

  return isMultiSigExecutable;
};

export const getIsMultiSigCancelable = (
  rejectionsPerRole: Record<number, MultiSigUserSignature[]>,
  thresholdPerRole: Threshold,
): boolean => {
  const isMultiSigCancelable =
    Object.keys(rejectionsPerRole).length > 0 &&
    Object.keys(rejectionsPerRole).every((role) => {
      const rejections = rejectionsPerRole[role]?.length || 0;
      if (!thresholdPerRole) {
        return false;
      }
      const roleThreshold = thresholdPerRole[role] || 0;
      return rejections >= roleThreshold;
    });

  return isMultiSigCancelable;
};
