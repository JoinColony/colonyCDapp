import { Extension } from '@colony/colony-js';

export const extensionsBadgeModeMap = {
  [Extension.VotingReputation]: 'governance',
  [Extension.OneTxPayment]: 'payments',
  [Extension.StagedExpenditure]: 'payments',
  [Extension.StakedExpenditure]: 'payments',
};

export const extensionsBadgeTextMap = {
  [Extension.VotingReputation]: 'status.governance',
  [Extension.OneTxPayment]: 'status.payments',
  [Extension.StagedExpenditure]: 'status.payments',
  [Extension.StakedExpenditure]: 'status.payments',
};
