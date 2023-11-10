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
      text: 'supporting.documents.link2',
    },
  ],
  [Extension.VotingReputation]: [
    {
      url: LAZY_CONSENSUS,
      text: 'supporting.documents.link1',
    },
    {
      url: LAZY_CONSENSUS_EXTENSION,
      text: 'supporting.documents.link3',
    },
  ],
  [Extension.StreamingPayments]: [
    {
      url: STREAMING_PAYMENTS,
      text: 'supporting.documents.link4',
    },
  ],
};
