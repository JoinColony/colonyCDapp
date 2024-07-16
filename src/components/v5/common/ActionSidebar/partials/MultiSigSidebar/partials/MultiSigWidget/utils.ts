import { type ColonyRole } from '@colony/colony-js';
import { isBefore, parseISO, subWeeks } from 'date-fns';

import { MultiSigVote } from '~gql';
import { type User, type MultiSigUserSignature } from '~types/graphql.ts';

import { type MultiSigSignee } from './types.ts';

export const hasWeekPassed = (createdAt: string) => {
  const createdAtDate = parseISO(createdAt);

  const currentDate = new Date();

  const oneWeekAgo = subWeeks(currentDate, 1);

  return isBefore(createdAtDate, oneWeekAgo);
};

export const getNotSignedUsers = ({
  requiredRoles,
  signatures,
  eligibleSignees,
}: {
  signatures: MultiSigUserSignature[];
  eligibleSignees: User[];
  requiredRoles: ColonyRole[];
}): MultiSigSignee[] => {
  const notSignedUsers: MultiSigSignee[] = eligibleSignees
    .filter((eligibleSignee) => {
      return !signatures.find(
        (signature) => signature.userAddress === eligibleSignee?.walletAddress,
      );
    })
    .map((eligibleSignee) => {
      return {
        userAddress: eligibleSignee?.walletAddress,
        user: {
          profile: eligibleSignee?.profile,
        },
        vote: MultiSigVote.None,
        rolesSignedWith: [],
        userRoles: requiredRoles || [], // @TODO get this from the hook for signees
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
