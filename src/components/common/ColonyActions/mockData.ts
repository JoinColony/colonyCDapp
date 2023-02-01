import { BigNumber } from 'ethers';
import { nanoid } from 'nanoid';

import {
  Address,
  ColonyActionType,
  ColonyMotions,
  FormattedAction,
  User,
} from '~types';

const paymentActionValues: {
  amount: string;
  tokenAddress: Address;
  address: Address;
} = {
  amount: BigNumber.from('100').toString(),
  tokenAddress: '0x2Ed17D7aA0A571ba5810EeAc16da56b70E5516eF',
  address: '0xCd96D435128415F3265c32f9eaeFaCc6Be53b7D7',
};

const colonyEditValues: {
  address: Address;
  actionInitiator?: string;
  colonyDisplayName: string | null;
  colonyAvatarHash?: string | null;
  colonyTokens?: string[];
  isWhitelistActivated?: boolean;
  verifiedAddresses?: string[];
} = {
  address: '0xCd96D435128415F3265c32f9eaeFaCc6Be53b7D7',
  colonyDisplayName: 'Pikachu',
  colonyAvatarHash: null,
  colonyTokens: ['0x2Ed17D7aA0A571ba5810EeAc16da56b70E5516eF'],
  isWhitelistActivated: false,
  verifiedAddresses: [],
};

const fakeUser: User = {
  walletAddress: '0xCd96D435128415F3265c32f9eaeFaCc6Be53b7D7',
  name: 'Steven',
  profile: {
    displayName: 'Steven',
  },
};

const coreData = {
  amount: '1',
  commentCount: 1,
  decimals: '18',
  fromDomain: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3_1',
  recipient: fakeUser,
  initiator: fakeUser,
  tokenAddress: '0x2Ed17D7aA0A571ba5810EeAc16da56b70E5516eF',
  tokenSymbol: 'A',
  toDomain: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3_2',
  transactionHash: '0x',
  roles: [],
  timeoutPeriods: 0,
  transactionStatus: 1,
  colonyAvatarHash: null,
  colonyTokens: [],
  blockNumber: 999,
  isWhitelistActivated: false,
  verifiedAddresses: [],
};

export const mockActionData: FormattedAction[] = [
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:00'),
    ...coreData,
    ...colonyEditValues,
    actionType: ColonyActionType.ColonyEdit,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-02-17T03:24:00'),
    ...coreData,
    actionType: ColonyActionType.CreateDomain,
  },
  {
    id: nanoid(),
    createdAt: new Date('1895-12-17T03:24:00'),
    ...coreData,
    actionType: ColonyActionType.EditDomain,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-18T03:24:00'),
    ...coreData,
    reputationChange: '1000000000000000000',
    actionType: ColonyActionType.EmitDomainReputationPenalty,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T05:24:00'),
    ...coreData,
    reputationChange: '4000000000000000000',
    actionType: ColonyActionType.EmitDomainReputationReward,
  },
  {
    id: nanoid(),
    createdAt: new Date('2001-01-17T03:24:00'),
    ...coreData,
    actionType: ColonyActionType.Generic,
  },
  {
    id: nanoid(),
    createdAt: new Date('2001-01-18T03:24:00'),
    ...coreData,
    actionType: ColonyActionType.MintTokens,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T13:24:00'),
    ...coreData,
    actionType: ColonyActionType.MoveFunds,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:01'),
    ...coreData,
    ...paymentActionValues,
    actionType: ColonyActionType.Payment,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:02'),
    ...coreData,
    actionType: ColonyActionType.Recovery,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:30'),
    ...coreData,
    roles: [{ id: 6, setTo: false }],
    actionType: ColonyMotions.SetUserRolesMotion,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-07T03:24:00'),
    ...coreData,
    roles: [
      { id: 1, setTo: true },
      { id: 2, setTo: false },
    ],
    actionType: ColonyActionType.SetUserRoles,
  },
  {
    id: nanoid(),
    createdAt: new Date('1959-12-17T03:24:00'),
    ...coreData,
    roles: [{ id: 1, setTo: true }],
    actionType: ColonyMotions.SetUserRolesMotion,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-11-17T03:24:00'),
    ...coreData,
    actionType: ColonyActionType.UnlockToken,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-27T03:24:00'),
    ...coreData,
    newVersion: '12',
    actionType: ColonyActionType.VersionUpgrade,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-25T03:24:00'),
    ...coreData,
    actionType: ColonyActionType.WrongColony,
  },
];
