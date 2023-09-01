import React, { ReactNode } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { Id } from '@colony/colony-js';

import { DEFAULT_TOKEN_DECIMALS, SAFE_NAMES_MAP } from '~constants';
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
  normalizeRolesForAction,
  ActionPageDetails,
  getDetailItemsKeys,
} from '~utils/colonyActions';
import { findDomainByNativeId } from '~utils/domains';
import { splitTransactionHash } from '~utils/strings';
import { getAddedSafe, getRemovedSafes } from '~utils/safes';

import {
  UserDetail,
  ActionTypeDetail,
  TeamDetail,
  AmountDetail,
  DomainDescriptionDetail,
  ReputationChangeDetail,
  RolesDetail,
  SafeTransactionDetail,
} from '../DetailsWidget';

import SafeValueDetail from './SafeValueDetail';
import SafeDetail from './SafeDetail';
import AddressDetail from './AddressDetail';

import styles from './DetailsWidget.css';

const displayName = 'DetailsWidget';

export const MSG = defineMessages({
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
  safe: {
    id: `${displayName}.safe`,
    defaultMessage: '{removedSafeCount, plural, one {Safe} other {Safes}}',
  },
  chain: {
    id: `${displayName}.chain`,
    defaultMessage: 'Chain',
  },
  safeAddress: {
    id: `${displayName}.safeAddress`,
    defaultMessage: 'Safe Address',
  },
  safeName: {
    id: `${displayName}.safeName`,
    defaultMessage: 'Safe Name',
  },
  moduleAddress: {
    id: `${displayName}.moduleAddress`,
    defaultMessage: 'Module Address',
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
  label?: MessageDescriptor;
  item: ReactNode;
  isListItem?: boolean;
  labelValues?: UniversalMessageValues;
}

const getDetailItemsMap = (
  colony: Colony,
  actionData: ColonyAction,
): { [key in ActionPageDetails]: DetailItemConfig } => {
  const {
    type,
    transactionHash,
    fromDomain,
    toDomain,
    amount,
    recipientAddress,
    initiatorAddress,
    token,
    roles,
    motionData,
    isMotion,
    pendingColonyMetadata,
    pendingDomainMetadata,
    safeTransaction,
  } = actionData;

  const shortenedHash = getShortenedHash(transactionHash || '');
  const normalizedRoles = roles ? normalizeRolesForAction(roles) : [];

  const isSmiteAction = type.includes(
    ColonyActionType.EmitDomainReputationPenalty,
  );
  const extendedActionType = getExtendedActionType(
    actionData,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );
  const motionDomain = findDomainByNativeId(
    Number(motionData?.nativeMotionDomainId ?? Id.RootDomain),
    colony,
  );
  const domainMetadata = fromDomain?.metadata || pendingDomainMetadata;
  const addedSafe = getAddedSafe(actionData);
  const removedSafes = getRemovedSafes(actionData);

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
      item: domainMetadata && <TeamDetail domainMetadata={domainMetadata} />,
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
      item: recipientAddress && <UserDetail walletAddress={recipientAddress} />,
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
      item: initiatorAddress && <UserDetail walletAddress={initiatorAddress} />,
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
    [ActionPageDetails.Permissions]: {
      label: MSG.roles,
      labelValues: undefined,
      item: roles && <RolesDetail roles={normalizedRoles} />,
    },
    [ActionPageDetails.Description]: {
      label: MSG.domainDescription,
      labelValues: undefined,
      item: domainMetadata?.description && (
        <DomainDescriptionDetail description={domainMetadata.description} />
      ),
    },
    [ActionPageDetails.Name]: {
      label: MSG.colonyName,
      labelValues: undefined,
      item: colony.metadata?.displayName,
    },
    [ActionPageDetails.Motion]: {
      label: MSG.motionDomain,
      labelValues: undefined,
      item: motionDomain?.metadata && (
        <TeamDetail domainMetadata={motionDomain.metadata} />
      ),
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
    [ActionPageDetails.SafeAddress]: {
      label: MSG.safeAddress,
      labelValues: undefined,
      item: !!addedSafe && <AddressDetail address={addedSafe.address} />,
    },
    [ActionPageDetails.SafeName]: {
      label: MSG.safeName,
      labelValues: undefined,
      item: !!addedSafe && <SafeValueDetail safeValue={addedSafe.name} />,
    },
    [ActionPageDetails.ChainName]: {
      label: MSG.chain,
      labelValues: undefined,
      item: !!addedSafe && (
        <SafeValueDetail safeValue={SAFE_NAMES_MAP[addedSafe.chainId]} />
      ),
    },
    [ActionPageDetails.ModuleAddress]: {
      label: MSG.moduleAddress,
      labelValues: undefined,
      item: !!addedSafe && (
        <AddressDetail address={addedSafe.moduleContractAddress} />
      ),
    },
    [ActionPageDetails.Safe]: {
      label: MSG.safe,
      labelValues: {
        removedSafeCount: removedSafes?.length,
      },
      item:
        !!removedSafes &&
        removedSafes.map((safe) => (
          <SafeDetail
            key={`${safe.chainId}-${safe.address}`}
            removedSafe={safe}
          />
        )),
      isListItem: true,
    },
    [ActionPageDetails.SafeTransaction]: {
      label: undefined,
      labelValues: undefined,
      item: safeTransaction && (
        <SafeTransactionDetail
          key={safeTransaction.id}
          actionData={actionData}
        />
      ),
      isListItem: true,
    },
  };
};

const getDetailItems = (
  actionData: ColonyAction,
  colony: Colony,
): DetailItemConfig[] => {
  const detailItemsMap = getDetailItemsMap(colony, actionData);
  const extendedActionType = getExtendedActionType(actionData, colony.metadata);
  const detailItemKeys = getDetailItemsKeys(extendedActionType);

  const detailItems = detailItemKeys
    .map<DetailItemConfig | undefined>((itemKey) => detailItemsMap[itemKey])
    .filter((detail): detail is DetailItemConfig => !!detail?.item);

  return detailItems as DetailItemConfig[];
};

export default getDetailItems;
