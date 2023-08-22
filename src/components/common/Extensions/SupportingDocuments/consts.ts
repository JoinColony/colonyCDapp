import { Extension } from '@colony/colony-js';
import { LAZY_CONSENSUS, PAYMENTS, MOTIONS_AND_DISPUTES } from '~constants';

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
      url: MOTIONS_AND_DISPUTES,
      text: 'supporting.documents.link3',
    },
  ],
};
