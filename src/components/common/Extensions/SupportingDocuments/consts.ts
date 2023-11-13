import { Extension } from '@colony/colony-js';
import {
  LAZY_CONSENSUS,
  PAYMENTS,
  LAZY_CONSENSUS_EXTENSION,
  STREAMING_PAYMENTS,
} from '~constants';

export const links = {
  [Extension.OneTxPayment]: [
    {
      url: PAYMENTS,
      text: 'supporting.documents.singleTransacion.paymentsDocumentsLink',
    },
  ],
  [Extension.VotingReputation]: [
    {
      url: LAZY_CONSENSUS,
      text: 'supporting.documents.votingReputation.lazyConsensusLink',
    },
    {
      url: LAZY_CONSENSUS_EXTENSION,
      text: 'supporting.documents.votingReputation.lazyConsensusExtensionLink',
    },
  ],
  [Extension.StreamingPayments]: [
    {
      url: STREAMING_PAYMENTS,
      text: 'supporting.documents.streamingPayments.streamingPaymensLink',
    },
  ],
};
