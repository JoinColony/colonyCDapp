import React, { ReactNode } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Numeral from '~shared/Numeral';
import TransactionLink from '~shared/TransactionLink';
import {
  Colony,
  ColonyAction,
  ColonyActionType,
  UniversalMessageValues,
} from '~types';
import {
  getExtendedActionType,
  ActionPageDetails,
  getDetailItemsKeys,
} from '~utils/colonyActions';
import { findDomainByNativeId } from '~utils/domains';
import { splitTransactionHash } from '~utils/strings';

import {
  UserDetail,
  ActionTypeDetail,
  TeamDetail,
  AmountDetail,
  DomainDescriptionDetail,
  ReputationChangeDetail,
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

const getMotionDetailItem = (colony: Colony, motionDomainId?: number) => {
  const motionDomain = findDomainByNativeId(
    Number(motionDomainId ?? 1),
    colony,
  );
  return {
    label: MSG.motionDomain,
    labelValues: undefined,
    item: motionDomain?.metadata && (
      <TeamDetail domainMetadata={motionDomain.metadata} />
    ),
  };
};

const getDetailItemsMap = (
  colony: Colony,
  actionData: ColonyAction,
): { [key in Exclude<ActionPageDetails, 'Permissions'>]: DetailItemConfig } => {
  const {
    type,
    transactionHash,
    fromDomain,
    toDomain,
    amount,
    recipient,
    token,
  } = actionData; // roles,
  const shortenedHash = getShortenedHash(transactionHash || '');
  const recipientWalletAddress = recipient?.walletAddress;
  const isSmiteAction = type === ColonyActionType.EmitDomainReputationPenalty;
  const extendedActionType = getExtendedActionType(actionData, colony);

  return {
    [ActionPageDetails.Type]: {
      label: MSG.actionType,
      labelValues: undefined,
      item: <ActionTypeDetail actionType={extendedActionType} />,
    },
    [ActionPageDetails.FromDomain]: {
      label: MSG.fromDomain,
      labelValues: undefined,
      item: fromDomain?.metadata && (
        <TeamDetail domainMetadata={fromDomain.metadata} />
      ),
    },
    [ActionPageDetails.Domain]: {
      label: MSG.domain,
      labelValues: undefined,
      item: fromDomain?.metadata && (
        <TeamDetail domainMetadata={fromDomain.metadata} />
      ),
    },
    [ActionPageDetails.ToDomain]: {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: toDomain?.metadata && (
        <TeamDetail domainMetadata={toDomain.metadata} />
      ),
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
          token={token}
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
    [ActionPageDetails.ReputationChange]: {
      label: MSG.reputationChange,
      labelValues: { isSmiteAction },
      item: amount && (
        <ReputationChangeDetail
          reputationChange={amount}
          decimals={token?.decimals ?? DEFAULT_TOKEN_DECIMALS}
        />
      ),
    },
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
      item: fromDomain?.metadata?.description && (
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
  actionData: ColonyAction,
  colony: Colony,
): DetailItemConfig[] => {
  const detailItemsMap = getDetailItemsMap(colony, actionData);
  const detailItemKeys = getDetailItemsKeys(actionData.type);
  const motionDetailItem = getMotionDetailItem(
    colony,
    actionData.fromDomain?.nativeId,
  );
  const detailItems = detailItemKeys
    .map((itemKey) => detailItemsMap[itemKey])
    .filter((detail) => !!detail.item);

  if (actionData.isMotion) {
    detailItems.splice(1, 0, motionDetailItem);
  }

  return detailItems;
};

export default getDetailItems;
