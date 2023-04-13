import { Colony, ColonyAction, ColonyActionType } from '~types';

const getActionTitleMessageId = (actionData: ColonyAction, colony?: Colony) => {
  const changelogItem = colony?.metadata?.changelog?.find(
    (item) => item.transactionHash === actionData.transactionHash,
  );

  if (
    actionData.type === ColonyActionType.ColonyEdit &&
    changelogItem?.hasWhitelistChanged
  ) {
    return `action.${ColonyActionType.ColonyEdit}.verifiedAddresses`;
  }

  return 'action.title';
};

export default getActionTitleMessageId;
