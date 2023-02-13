import React, { ReactNode } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Numeral from '~shared/Numeral';
import TransactionLink from '~shared/TransactionLink';
import { getDetailsForAction } from '~utils/colonyActions';
import { Colony, ColonyAction, UniversalMessageValues } from '~types';
import { ActionPageDetails, getDetailItemsKeys } from '~utils/colonyActions';
import { findDomainByNativeId } from '~utils/domains';
import { splitTransactionHash } from '~utils/strings';

import {
  UserDetail,
  ActionTypeDetail,
  TeamDetail,
  AmountDetail,
  DomainDescriptionDetail,
} from '../DetailsWidget';

import styles from './DetailsWidget.css';

const displayName = 'DetailsWidget';

const MSG = defineMessages({
  actionType: {
    id: `${displayName}.actionType`,
    defaultMessage: 'Action Type',
  },
  fromDomain: {
    id: `${displayName}.fromDomain`,
    defaultMessage: 'From',
  },
  motionDomain: {
    id: `${displayName}.motionDomain`,
    defaultMessage: 'Motion created in',
  },
  toRecipient: {
    id: `${displayName}.toRecipient`,
    defaultMessage: 'To',
  },
  value: {
    id: `${displayName}.value`,
    defaultMessage: 'Value',
  },
  transactionHash: {
    id: `${displayName}.transactionHash`,
    defaultMessage: 'Transaction Hash',
  },
  domain: {
    id: `${displayName}.domain`,
    defaultMessage: 'Team',
  },
  domainDescription: {
    id: `${displayName}.domainDescription`,
    defaultMessage: 'Team Purpose',
  },
  roles: {
    id: `${displayName}.roles`,
    defaultMessage: 'Roles',
  },
  colonyName: {
    id: `${displayName}.colonyName`,
    defaultMessage: 'Name',
  },
  reputationChange: {
    id: `${displayName}.reputationChange`,
    defaultMessage: `Reputation {isSmiteAction, select,
        true {penalty}
        other {reward}
      }`,
  },
  author: {
    id: `${displayName}.author`,
    defaultMessage: 'Author',
  },
});

const getShortenedHash = (transactionHash: string) => {
  const splitHash = splitTransactionHash(transactionHash);

  if (splitHash) {
    const { header, start, end } = splitHash;
    return `${header}${start}...${end}`;
  }

  return undefined;
};

interface DetailItemConfig {
  label: MessageDescriptor;
  labelValues?: UniversalMessageValues;
  item: ReactNode;
}

const getMotionDetailItem = (colony: Colony, motionDomainId?: string) => {
  const motionDomain = findDomainByNativeId(
    Number(motionDomainId ?? 1),
    colony,
  );
  return {
    label: MSG.motionDomain,
    labelValues: undefined,
    item: motionDomain && <TeamDetail domain={motionDomain} />,
  };
};

const getDetailItemsMap = (
  colony: Colony,
  {
    type,
    transactionHash,
    fromDomain: fromDomainId,
    toDomain: toDomainId,
    amount,
    recipient,
    decimals,
    //token,
    // roles,
    tokenSymbol,
  }: // reputationChange
  typeof mockEventData & ColonyAction,
) => {
  const shortenedHash = getShortenedHash(transactionHash || '');
  const fromDomain = findDomainByNativeId(fromDomainId, colony);
  const toDomain = findDomainByNativeId(toDomainId, colony);
  const adjustedAmount = getAdjustedAmount(amount, decimals);
  const recipientWalletAddress = recipient?.walletAddress;
  // const isSmiteAction =
  //   actionType === ColonyActions.EmitDomainReputationPenalty;
  return {
    [ActionPageDetails.FromDomain]: {
      label: MSG.fromDomain,
      labelValues: undefined,
      item: fromDomain.metadata && <TeamDetail domain={fromDomain.metadata} />,
    },
    [ActionPageDetails.Domain]: {
      label: MSG.domain,
      labelValues: undefined,
      item: fromDomain.metadata && <TeamDetail domain={fromDomain.metadata} />,
    },
    [ActionPageDetails.ToDomain]: {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: toDomain?.metadata && <TeamDetail domain={toDomain.metadata} />,
    },
    [ActionPageDetails.ToRecipient]: {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: recipientWalletAddress && (
        <UserDetail walletAddress={recipientWalletAddress} />
      ),
    },
    [ActionPageDetails.Amount]: {
      label: MSG.value,
      labelValues: undefined,
      item: amount && (
        <AmountDetail
          amount={
            <Numeral
              value={amount}
              decimals={token?.decimals ?? DEFAULT_TOKEN_DECIMALS}
            />
          }
          symbol={token?.symbol}
          token={token ?? undefined}
        />
      ),
    },
    [ActionPageDetails.Author]: {
      label: MSG.author,
      labelValues: undefined,
      item: recipientWalletAddress && (
        <UserDetail walletAddress={recipientWalletAddress} />
      ),
    },
    // {
    //   label: MSG.reputationChange,
    //   labelValues: { isSmiteAction },
    //   item: detailsForAction.ReputationChange && reputationChange && (
    //     <ReputationChangeDetail reputationChange={reputationChange} />
    //   ),
    // },
    // {
    //   label: MSG.roles,
    //   labelValues: undefined,
    //   item: detailsForAction.Permissions && roles && (
    //     <RolesDetail roles={roles} />
    //   ),
    // },
    [ActionPageDetails.Description]: {
      label: MSG.domainDescription,
      labelValues: undefined,
      item: fromDomain?.metadata.description && (
        <DomainDescriptionDetail
          description={fromDomain.metadata.description}
        />
      ),
    },
    [ActionPageDetails.Name]: {
      label: MSG.colonyName,
      labelValues: undefined,
      item: colony.metadata?.displayName,
    },
    [ActionPageDetails.Generic]: {
      label: MSG.transactionHash,
      labelValues: undefined,
      item: !!shortenedHash && (
        <TransactionLink
          className={styles.transactionHashLink}
          hash={transactionHash as string}
          text={shortenedHash}
          title={transactionHash}
        />
      ),
    },
  };
};

const getDetailItems = (
  itemData: typeof mockEventData & ColonyAction,
  colony: Colony,
): DetailItemConfig[] => {
  const detailItemsMap = getDetailItemsMap(colony, itemData);
  const detailItemKeys = getDetailItemsKeys(itemData.type);
  const motionDetailItem = getMotionDetailItem(colony, itemData.fromDomain);

  const detailItems = detailItemKeys
    .map((itemKey) => detailItemsMap[itemKey])
    .filter((detail) => !!detail.item);

  if (itemData.isMotion) {
    detailItems.splice(1, 0, motionDetailItem);
  }

  return detailItems;
};

export default getDetailItems;
