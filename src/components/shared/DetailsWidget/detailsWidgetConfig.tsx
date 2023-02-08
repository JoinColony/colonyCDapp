import React, { ReactNode } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import TransactionLink from '~shared/TransactionLink';
import { Address, Colony, ColonyActions, UniversalMessageValues } from '~types';
import { EventValues, getDetailsForAction } from '~utils/colonyActions';
import { splitTransactionHash } from '~utils/strings';

import {
  UserDetail,
  ActionTypeDetail,
  RolesDetail,
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

const getDetailItems = (
  actionType: EventValues['actionType'],
  {
    motionDomain,
    fromDomain,
    toDomain,
    amount,
    token,
    tokenSymbol,
    reputationChange,
    isSmiteAction,
    roles,
  }: EventValues,
  colony: Colony,
  recipientWalletAddress: Address | undefined,
  transactionHash: string | undefined,
): DetailItemConfig[] => {
  const detailsForAction = getDetailsForAction(actionType);
  const shortenedHash = getShortenedHash(transactionHash || '');
  const colonyName = colony.name;

  return [
    {
      label: MSG.actionType,
      labelValues: undefined,
      item: <ActionTypeDetail actionType={actionType} />,
    },
    {
      label: MSG.motionDomain,
      labelValues: undefined,
      item: motionDomain && <TeamDetail domain={motionDomain} />,
    },
    {
      label: MSG.fromDomain,
      labelValues: undefined,
      item: detailsForAction.FromDomain && fromDomain && (
        <TeamDetail domain={fromDomain} />
      ),
    },
    {
      label: MSG.domain,
      labelValues: undefined,
      item: detailsForAction.Domain && fromDomain && (
        <TeamDetail domain={fromDomain} />
      ),
    },
    {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: detailsForAction.ToDomain && toDomain && (
        <TeamDetail domain={toDomain} />
      ),
    },
    {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: detailsForAction.ToRecipient && recipientWalletAddress && (
        <UserDetail colony={colony} walletAddress={recipientWalletAddress} />
      ),
    },
    {
      label: MSG.value,
      labelValues: undefined,
      item: detailsForAction.Amount && amount && (
        <AmountDetail amount={amount} symbol={tokenSymbol} token={token} />
      ),
    },
    {
      label: MSG.author,
      labelValues: undefined,
      item: detailsForAction.Author && recipientWalletAddress && (
        <UserDetail colony={colony} walletAddress={recipientWalletAddress} />
      ),
    },
    {
      label: MSG.reputationChange,
      labelValues: { isSmiteAction },
      item: detailsForAction.ReputationChange && reputationChange && (
        <ReputationChangeDetail reputationChange={reputationChange} />
      ),
    },
    {
      label: MSG.roles,
      labelValues: undefined,
      item: detailsForAction.Permissions && roles && (
        <RolesDetail roles={roles} />
      ),
    },
    {
      label: MSG.domainDescription,
      labelValues: undefined,
      item: detailsForAction.Description && fromDomain?.description && (
        <DomainDescriptionDetail description={fromDomain.description} />
      ),
    },
    {
      label: MSG.colonyName,
      labelValues: undefined,
      item: detailsForAction.Name && colonyName,
    },
    {
      label: MSG.transactionHash,
      labelValues: undefined,
      item: !!shortenedHash && actionType === ColonyActions.Generic && (
        <TransactionLink
          className={styles.transactionHashLink}
          hash={transactionHash as string}
          text={shortenedHash}
          title={transactionHash}
        />
      ),
    },
  ];
};

export default getDetailItems;
