import { Colony, ColonyAction, ColonyActionType } from '~types';

const getActionTitleMessageId = (actionData: ColonyAction, colony?: Colony) => {
  const changelogItem = colony?.metadata?.changelog?.find(
    (item) => item.transactionHash === actionData.transactionHash,
  );

  /**
   * Special cases for Colony Edit actions since it covers a few scenarios and needs specific messages for them:
   * - Avatar or name is updated
   * - Whitelist is updated
   * - Token list is updated
   */
  if (
    actionData.type === ColonyActionType.ColonyEdit &&
    changelogItem?.hasWhitelistChanged
  ) {
    return `action.${ColonyActionType.ColonyEdit}.verifiedAddresses`;
  }

  if (
    actionData.type === ColonyActionType.ColonyEdit &&
    changelogItem?.haveTokensChanged
  ) {
    return `action.${ColonyActionType.ColonyEdit}.tokens`;
  }

  return 'action.title';
};

export default getActionTitleMessageId;
