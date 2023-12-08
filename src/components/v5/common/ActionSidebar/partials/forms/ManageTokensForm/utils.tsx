import { DeepPartial } from 'utility-types';

import { ADDRESS_ZERO } from '~constants';
import { ColonyActionType, ColonyMetadataChangelog } from '~gql';
import { Colony } from '~types';
import { createAddress } from '~utils/web3';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { ManageTokensFormValues } from './consts';

export const manageTokensDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<ManageTokensFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  const changelogItem: Partial<ColonyMetadataChangelog> = {
    haveTokensChanged: true,
    transactionHash: ADDRESS_ZERO,
  };

  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.ColonyEdit
        : ColonyActionType.ColonyEditMotion,
    pendingColonyMetadata: {
      changelog: [changelogItem],
    },
    isMotion: true,
  });
};

export const getManageTokensPayload = (
  colony: Colony,
  values: ManageTokensFormValues,
) => {
  const {
    selectedTokenAddresses,
    description: annotationMessage,
    title,
  } = values;

  let addresses = selectedTokenAddresses.map(({ token }) => token) ?? [];
  addresses = [
    ...new Set(
      addresses
        .map((address) => createAddress(address))
        .filter((address) => {
          return (
            address !== ADDRESS_ZERO &&
            address !== colony.nativeToken.tokenAddress
          );
        }),
    ),
  ];

  return {
    colony,
    tokenAddresses: addresses,
    annotationMessage,
    customActionTitle: title,
  };
};
