import { BigNumber } from 'ethers';
import { nanoid } from 'nanoid';

import {
  Address,
  ColonyActions,
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
  status: 1,
  colonyAvatarHash: null,
  colonyTokens: [],
  blockNumber: 999,
  motionState: undefined,
  isWhitelistActivated: false,
  verifiedAddresses: [],
};

export const mockActionData: FormattedAction[] = [
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:00'),
    ...coreData,
    ...colonyEditValues,
    actionType: ColonyActions.ColonyEdit,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-02-17T03:24:00'),
    ...coreData,
    actionType: ColonyActions.CreateDomain,
  },
  {
    id: nanoid(),
    createdAt: new Date('1895-12-17T03:24:00'),
    ...coreData,
    actionType: ColonyActions.EditDomain,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-18T03:24:00'),
    ...coreData,
    reputationChange: '1000000000000000000',
    actionType: ColonyActions.EmitDomainReputationPenalty,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T05:24:00'),
    ...coreData,
    reputationChange: '4000000000000000000',
    actionType: ColonyActions.EmitDomainReputationReward,
  },
  {
    id: nanoid(),
    createdAt: new Date('2001-01-17T03:24:00'),
    ...coreData,
    actionType: ColonyActions.Generic,
  },
  {
    id: nanoid(),
    createdAt: new Date('2001-01-18T03:24:00'),
    ...coreData,
    actionType: ColonyActions.MintTokens,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T13:24:00'),
    ...coreData,
    actionType: ColonyActions.MoveFunds,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:01'),
    ...coreData,
    ...paymentActionValues,
    actionType: ColonyActions.Payment,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-17T03:24:02'),
    ...coreData,
    actionType: ColonyActions.Recovery,
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
    actionType: ColonyActions.SetUserRoles,
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
    actionType: ColonyActions.UnlockToken,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-27T03:24:00'),
    ...coreData,
    newVersion: '12',
    actionType: ColonyActions.VersionUpgrade,
  },
  {
    id: nanoid(),
    createdAt: new Date('1995-12-25T03:24:00'),
    ...coreData,
    actionType: ColonyActions.WrongColony,
  },
];
