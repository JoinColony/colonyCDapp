import { ColonyActionType } from '~gql';

export const ICON_SIZE = 14;
export const DEFAULT_TOOLTIP_POSITION = 'top';

// FIXME: This we also already have!!! The components register their translation
export const actionTypeTranslations = {
  [ColonyActionType.CreateDecisionMotion]: 'actions.createDecision',
  [ColonyActionType.CreateDomain]: 'actions.createNewTeam',
  [ColonyActionType.ColonyEdit]: 'actions.editColonyDetails',
  [ColonyActionType.MintTokens]: 'actions.mintTokens',
  [ColonyActionType.Payment]: 'actions.simplePayment',
  [ColonyActionType.MoveFunds]: 'actions.transferFunds',
  [ColonyActionType.UnlockToken]: 'actions.unlockToken',
  [ColonyActionType.VersionUpgrade]: 'actions.upgradeColonyVersion',
  [ColonyActionType.VersionUpgradeMotion]: 'actions.upgradeColonyVersion',
  default: 'Action',
};
