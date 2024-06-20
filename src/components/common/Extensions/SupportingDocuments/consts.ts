import { Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import {
  LAZY_CONSENSUS,
  PAYMENTS,
  LAZY_CONSENSUS_EXTENSION,
  STREAMING_PAYMENTS,
  MULTI_SIG_EXTENSION,
  PERMISSIONS,
  STAKING_ADVANCED_PAYMENTS,
} from '~constants/index.ts';

const supportingDocumentsMessages = defineMessages({
  oneTxPaymentLink: {
    id: 'SupportingDocuments.OneTxPayment.paymentsLink',
    defaultMessage: 'Single Transaction Payments',
  },
  lazyConsensusLink: {
    id: 'SupportingDocuments.VotingReputation.consensusLink',
    defaultMessage: 'Understanding Lazy Consensus',
  },
  lazyConsensusExtensionLink: {
    id: 'SupportingDocuments.VotingReputation.lazyConsensusExtensionLink',
    defaultMessage: 'Lazy Consensus Extension',
  },
  streamingPaymentsLink: {
    id: 'SupportingDocuments.StreamingPayments.paymentsLink',
    defaultMessage: 'Streaming Payments',
  },
  permissionsLink: {
    id: 'SupportingDocuments.MultiSig.permissionsLink',
    defaultMessage: 'Understanding Permissions',
  },
  multiSigExtensionLink: {
    id: 'SupportingDocuments.MultiSig.extensionLink',
    defaultMessage: 'Multi-Sig Extension',
  },
  stakingPaymentsLink: {
    id: 'SupportingDocuments.StakingPayments.paymentsLink',
    defaultMessage: 'Staking Advanced Payments',
  },
});

export const links = {
  [Extension.OneTxPayment]: [
    {
      url: PAYMENTS,
      message: supportingDocumentsMessages.oneTxPaymentLink,
    },
  ],
  [Extension.VotingReputation]: [
    {
      url: LAZY_CONSENSUS,
      message: supportingDocumentsMessages.lazyConsensusLink,
    },
    {
      url: LAZY_CONSENSUS_EXTENSION,
      message: supportingDocumentsMessages.lazyConsensusExtensionLink,
    },
  ],
  [Extension.StreamingPayments]: [
    {
      url: STREAMING_PAYMENTS,
      message: supportingDocumentsMessages.streamingPaymentsLink,
    },
  ],
  [Extension.MultisigPermissions]: [
    {
      url: PERMISSIONS,
      message: supportingDocumentsMessages.permissionsLink,
    },
    {
      url: MULTI_SIG_EXTENSION,
      message: supportingDocumentsMessages.multiSigExtensionLink,
    },
  ],
  [Extension.StakedExpenditure]: [
    {
      url: STAKING_ADVANCED_PAYMENTS,
      message: supportingDocumentsMessages.stakingPaymentsLink,
    },
  ],
};
