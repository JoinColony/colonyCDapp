import { Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import {
  LAZY_CONSENSUS,
  PAYMENTS,
  LAZY_CONSENSUS_EXTENSION,
  STREAMING_PAYMENTS,
  STAKING_ADVANCED_PAYMENTS,
  STAGED_PAYMENTS,
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
  stakingPaymentsLink: {
    id: 'SupportingDocuments.StakingPayments.paymentsLink',
    defaultMessage: 'Staking Advanced Payments',
  },
  stagedPaymentsLink: {
    id: 'SupportingDocuments.StagedPayments.paymentsLink',
    defaultMessage: 'Staged Payments',
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
  [Extension.StakedExpenditure]: [
    {
      url: STAKING_ADVANCED_PAYMENTS,
      message: supportingDocumentsMessages.stakingPaymentsLink,
    },
  ],
  [Extension.StagedExpenditure]: [
    {
      url: STAGED_PAYMENTS,
      message: supportingDocumentsMessages.stagedPaymentsLink,
    },
  ],
};
