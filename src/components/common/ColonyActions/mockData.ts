import { BigNumber } from 'ethers';
import { nanoid } from 'nanoid';
import { DomainColor } from '~gql';

import {
  Address,
  ColonyAction,
  ColonyActionType,
  ColonyMotions,
  User,
} from '~types';
import { MotionVote } from '~utils/colonyMotions';

const paymentActionValues: {
  tokenAddress: Address;
  address: Address;
} = {
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
  walletAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  name: 'Steven',
  profile: {
    displayName: 'Steven',
  },
};

const coreData = {
  amount: BigNumber.from('100000000000000000000').toString(),
  commentCount: 1,
  decimals: 18,
  fromDomain: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3_1',
  recipient: fakeUser,
  initiator: fakeUser,
  tokenAddress: '0x2Ed17D7aA0A571ba5810EeAc16da56b70E5516eF',
  colonyAddress: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
  tokenSymbol: 'A',
  toDomain: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3_2',
  roles: [],
  timeoutPeriods: 0,
  transactionStatus: 1,
  colonyAvatarHash: null,
  colonyTokens: [],
  blockNumber: 999,
  isWhitelistActivated: false,
  verifiedAddresses: [],
  newVersion: '12',
};

export const mockActionData: ColonyAction[] = [
  {
    id: nanoid(),
    createdAt: '1995-12-17T03:24:00',
    ...coreData,
    ...colonyEditValues,
    type: ColonyActionType.ColonyEdit,
    transactionHash:
      '0xb60f6e4719d73a84b3f5b116a807bbbc1fa5170ef1370921d3bad71c2c6b70fd',
  },
  {
    id: nanoid(),
    createdAt: '1995-02-17T03:24:00',
    ...coreData,
    ...colonyEditValues,
    type: ColonyMotions.ColonyEditMotion,
    transactionHash:
      '0x997c054a4397768e033fb483bfbefee50c4afae170df94ebcc5619c2f57aec1a',
  },
  {
    id: nanoid(),
    createdAt: '1995-02-17T03:24:00',
    ...coreData,
    type: ColonyActionType.CreateDomain,
    transactionHash:
      '0x2e5f2597092aa9caaa945e90e684aa85fed3ca6289685ee3bd626ced64e972d8',
  },
  {
    id: nanoid(),
    createdAt: '1895-12-17T03:24:00',
    ...coreData,
    type: ColonyActionType.EditDomain,
    transactionHash:
      '0x3352720603ddc6c9b48da70c643c1e2110dc1af6d659350a22ab7b059e6e6df0',
  },
  // {
  //   id: nanoid(),
  //   createdAt: '1995-12-18T03:24:00',
  //   ...coreData,
  //   reputationChange: '1000000000000000000',
  //   type: ColonyActionType.EmitDomainReputationPenalty,
  //   transactionHash:
  //     '0x41c789012a08f052184640e2665118d74a66575e7b1b404cb73abd59cd89edbb',
  // },
  // {
  //   id: nanoid(),
  //   createdAt: '1995-12-17T05:24:00',
  //   ...coreData,
  //   reputationChange: '4000000000000000000',
  //   type: ColonyActionType.EmitDomainReputationReward,
  //   transactionHash:
  //     '0x6679f1367d2a02a1591f885d6359a62f7905acdeffe3f48cc73c3ea4e192398e',
  // },
  {
    id: nanoid(),
    createdAt: '2001-01-17T03:24:00',
    ...coreData,
    type: ColonyActionType.Generic,
    transactionHash:
      '0xc218f482da7c8f27b04a42589e93aa33e06f61a152225390c6067b8a8c1d33a8',
  },
  {
    id: nanoid(),
    createdAt: '2001-01-18T03:24:00',
    ...coreData,
    type: ColonyActionType.MintTokens,
    transactionHash:
      '0x1bc9e5fbf057a968a8849e989c9553d06f7a0efc71ee2461866b6af25b920dbc',
  },
  {
    id: nanoid(),
    createdAt: '1995-12-17T13:24:00',
    ...coreData,
    type: ColonyActionType.MoveFunds,
    transactionHash:
      '0x70d602093e17e601a5887469d9f7c6ef93241c99aae5d5d48c94616dd89b74c9',
  },
  {
    id: nanoid(),
    createdAt: '1995-12-17T03:24:01',
    ...coreData,
    ...paymentActionValues,
    type: ColonyActionType.Payment,
    transactionHash:
      '0xd25fbc3b05efd8e380d95b33cd95f0cbb49f23fec683cb1f0df0e4436f725400',
  },
  // {
  //   id: nanoid(),
  //   createdAt: '1995-12-17T03:24:02'),
  //   ...coreData,
  //   type: ColonyActionType.Recovery,
  //   transactionHash:
  //     '0x2061a25a52762406ee45312cad86e5d75f04de7b01579d0a1da4521e9a67d218',
  // },
  // {
  //   id: nanoid(),
  //   createdAt: '1995-12-17T03:24:30',
  //   ...coreData,
  //   roles: [{ id: 6, setTo: false }],
  //   type: ColonyActionType.SetUserRoles,
  //   transactionHash:
  //     '0x9b1acb3ac5f18dcf27e66b7c583247472febf2a53f69ffcba11d6ddd8f64c115',
  // },
  // {
  //   id: nanoid(),
  //   createdAt: '1995-12-07T03:24:00',
  //   ...coreData,
  //   roles: [
  //     { id: 1, setTo: true },
  //     { id: 2, setTo: false },
  //   ],
  //   type: ColonyActionType.SetUserRoles,
  //   transactionHash:
  //     '0x20ac97b04196ed9e97c4c67a64131dde11d110f59c9f7f84b9fb338b435beed0',
  // },
  // {
  //   id: nanoid(),
  //   createdAt: '1959-12-17T03:24:00',
  //   ...coreData,
  //   roles: [{ id: 1, setTo: true }],
  //   type: ColonyActionType.SetUserRoles,
  //   transactionHash:
  //     '0xfc2c9ffb0499f998d02f39e690aacf172ef2f1b093a508d895689e2091e845c2',
  // },
  {
    id: nanoid(),
    createdAt: '1995-11-17T03:24:00',
    ...coreData,
    type: ColonyActionType.UnlockToken,
    transactionHash:
      '0xa0abac072bd521d2f1bfd1a988a979508e5c029350c792d754761b324894fc33',
  },
  // {
  //   id: nanoid(),
  //   createdAt: '1995-12-27T03:24:00',
  //   ...coreData,
  //   newVersion: '12',
  //   type: ColonyActionType.VersionUpgrade,
  //   transactionHash:
  //     '0x95239de6e9c4eeafc0e93b9587deeeb39398f81ab756f3e81931e59c27d0a1f5',
  // },
  {
    id: nanoid(),
    createdAt: '1995-12-25T03:24:00',
    ...coreData,
    type: ColonyActionType.WrongColony,
    transactionHash:
      '0x395d0acf7ae0d534f90e4ee45f51dba82770936b9981e83e147de1cb437c1b53',
  },
];

export type MockEvent = typeof mockEventData;

export const mockEventData = {
  domainMetadata: {
    color: DomainColor.Emeraldgreen,
    description: 'Purposeful purpose',
    name: 'Name name',
  },
  previousDomainMetadata: {
    color: DomainColor.Aqua,
    description: 'Old purpose',
    name: 'Old name',
  },
  emittedBy: '0xCd96D435128415F3265c32f9eaeFaCc6Be53b7D7',
  slot: 'SlotOne',
  stakeAmount: BigNumber.from(123),
  vote: MotionVote.Yay,
  staker: fakeUser,
  motionDomainId: '1',
};
