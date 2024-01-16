import { Extension, getExtensionHash } from '@colony/colony-js';

import { FriendlyNameProps } from './FriendlyName';

export const getAddressFromAgent = (
  agent: FriendlyNameProps['agent'],
): string | undefined => {
  if (!agent) {
    return undefined;
  }

  switch (agent.__typename) {
    case 'Colony': {
      return agent.colonyAddress;
    }

    case 'ColonyExtension': {
      return agent.address;
    }

    case 'Token': {
      return agent.tokenAddress;
    }

    case 'User':
    case 'SimpleTarget': {
      return agent.walletAddress;
    }

    default: {
      return undefined;
    }
  }
};

export const getDisplayNameFromAgent = (
  agent: FriendlyNameProps['agent'],
): string | null | undefined => {
  if (!agent) {
    return undefined;
  }

  switch (agent.__typename) {
    case 'Colony': {
      return agent.metadata?.displayName || agent.name;
    }

    case 'ColonyExtension': {
      if (getExtensionHash(Extension.OneTxPayment) === agent.hash) {
        return 'One Transaction Payment Extension';
      }

      if (getExtensionHash(Extension.VotingReputation) === agent.hash) {
        return 'Governance (Reputation Weighted) Extension';
      }

      return undefined;
    }

    case 'Token': {
      return agent.name;
    }

    case 'User': {
      return agent.profile?.displayName;
    }

    default: {
      return undefined;
    }
  }
};
