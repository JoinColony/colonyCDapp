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
import { getDetailsForAction } from '~utils/colonyActions';
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

const getDetailItems = (
  {
    // motionDomain,
    type,
    fromDomain,
    toDomain,
    amount,
    recipient,
    transactionHash,
    token,
  }: // reputationChange,
  // roles,
  ColonyAction,
  colony: Colony,
): DetailItemConfig[] => {
  const detailsForAction = getDetailsForAction(type);
  const shortenedHash = getShortenedHash(transactionHash || '');

  // const isSmiteAction =
  //   actionType === ColonyActions.EmitDomainReputationPenalty;

  const colonyName = colony.name;
  return [
    {
      label: MSG.actionType,
      labelValues: undefined,
      item: <ActionTypeDetail actionType={type} />,
    },
    // {
    //   label: MSG.motionDomain,
    //   labelValues: undefined,
    //   item: motionDomain && <TeamDetail domain={motionDomain} />,
    // },
    {
      label: MSG.fromDomain,
      labelValues: undefined,
      item: detailsForAction.FromDomain && fromDomain?.metadata && (
        <TeamDetail domainMetadata={fromDomain.metadata} />
      ),
    },
    {
      label: MSG.domain,
      labelValues: undefined,
      item: detailsForAction.Domain && fromDomain?.metadata && (
        <TeamDetail
          transactionHash={transactionHash}
          domainMetadata={fromDomain.metadata}
        />
      ),
    },
    {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: detailsForAction.ToDomain && toDomain?.metadata && (
        <TeamDetail domainMetadata={toDomain.metadata} />
      ),
    },
    {
      label: MSG.toRecipient,
      labelValues: undefined,
      item: detailsForAction.ToRecipient && recipient?.walletAddress && (
        <UserDetail walletAddress={recipient.walletAddress} />
      ),
    },
    {
      label: MSG.value,
      labelValues: undefined,
      item: detailsForAction.Amount && amount && (
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
    {
      label: MSG.author,
      labelValues: undefined,
      item: detailsForAction.Author && recipient?.walletAddress && (
        <UserDetail walletAddress={recipient.walletAddress} />
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
    {
      label: MSG.domainDescription,
      labelValues: undefined,
      item: detailsForAction.Description &&
        fromDomain?.metadata?.description && (
          <DomainDescriptionDetail
            description={fromDomain.metadata.description}
          />
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
      item: !!shortenedHash && type === ColonyActionType.Generic && (
        <TransactionLink
          className={styles.transactionHashLink}
          hash={transactionHash as string}
          text={shortenedHash}
          title={transactionHash}
        />
      ),
    },
  ].filter((detail) => !!detail.item);
};

export default getDetailItems;
