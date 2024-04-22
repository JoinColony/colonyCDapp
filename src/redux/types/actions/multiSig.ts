import { type BigNumber } from 'ethers';

import { type Address } from '~types/index.ts';

import { type ActionTypes } from '../../actionTypes.ts';

import {
  type MetaWithSetter,
  type ErrorActionType,
  type UniqueActionType,
  type UniqueActionTypeWithoutPayload,
  type ActionTypeWithMeta,
} from './index.ts';

export enum RootMultiSigMethodNames {
  MintTokens = 'mintTokens',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
}

export type MultiSigActionTypes =
  | UniqueActionType<
      ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD,
      {
        colonyAddress: Address;
        threshold: number;
      },
      object
    >
  | ErrorActionType<ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.MULTISIG_SET_GLOBAL_THRESHOLD_SUCCESS,
      object
    >
  | UniqueActionType<
      ActionTypes.ROOT_MULTISIG,
      {
        operationName: RootMultiSigMethodNames;
        customActionTitle: string;
        colonyAddress: Address;
        colonyName?: string;
        multiSigParams: [BigNumber] | [string];
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ROOT_MULTISIG_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ROOT_MULTISIG_SUCCESS,
      MetaWithSetter<object>
    >;
