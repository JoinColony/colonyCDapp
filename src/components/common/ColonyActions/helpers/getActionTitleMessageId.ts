import { Colony, ColonyAction, ColonyActionType } from '~types';

const getActionTitleMessageId = (actionData: ColonyAction, colony?: Colony) => {
  const lastChangelogEntry =
    colony?.metadata?.changelog?.[colony.metadata.changelog.length - 1];

  if (
    actionData.type === ColonyActionType.ColonyEdit &&
    lastChangelogEntry?.hasWhitelistChanged
  ) {
    return `action.${ColonyActionType.ColonyEdit}.verifiedAddresses`;
  }

  return 'action.title';
};

export default getActionTitleMessageId;
