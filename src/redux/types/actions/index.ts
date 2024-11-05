import { type NavigateFunction } from 'react-router-dom';

import { type ArbitraryActionTypes } from './arbitrary.ts';
import { type ColonyActionTypes } from './colony.ts';
import { type ColonyActionsActionTypes } from './colonyActions.ts';
import { type DecisionActionTypes } from './decisions.ts';
import { type ExpendituresActionTypes } from './expenditures.ts';
import { type GasPricesActionTypes } from './gasPrices.ts';
import { type IpfsActionTypes } from './ipfs.ts';
import { type MessageActionTypes } from './message.ts';
import { type MotionActionTypes } from './motion.ts';
import { type MultiSigActionTypes } from './multiSig.ts';
import { type TransactionActionTypes } from './transaction.ts';
import { type UserActionTypes } from './user.ts';
import { type MetacolonyVestingTypes } from './vesting.ts';
import { type WalletActionTypes } from './wallet.ts';

export { RootMotionMethodNames } from './motion.ts';

/*
 * Type that represents an action (bare minimum).
 *
 * T: the action type, e.g. `COLONY_CREATE`
 */
export interface ActionType<T extends string> {
  type: T;
}

/*
 * Type that represents an action with a `payload` property.
 *
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `key: *`
 */
export interface ActionTypeWithPayload<T extends string, P>
  extends ActionType<T> {
  type: T;
  payload: P;
}

/*
 * Type that represents an action with a `meta` property.
 *
 * M: any additional `meta` properties, e.g. `key: *`
 */
export interface ActionTypeWithMeta<
  T extends string,
  M extends Record<string, unknown>,
> extends ActionType<T> {
  type: T;
  meta: M;
}

/*
 * Type that represents an action with `payload` and `meta` properties.
 *
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `key: *`
 */
export interface ActionTypeWithPayloadAndMeta<T extends string, P, M>
  extends ActionType<T> {
  type: T;
  meta: M;
  payload: P;
}

/*
 * Type that represents a unique action (e.g. from `ActionForm`).
 */
export interface UniqueActionType<T extends string, P, M> {
  type: T;
  payload: P;
  meta: {
    id: string;
  } & M;
}

/*
 * Type that represents a unique action without a payload
 */
export interface UniqueActionTypeWithoutPayload<T extends string, M> {
  type: T;
  meta: {
    id: string;
  } & M;
}

/*
 * Type that represents an error action.
 */
export interface ErrorActionType<T extends string, M extends object>
  extends ActionTypeWithPayloadAndMeta<T, Error, M> {
  error: true;
}

/*
 * This is the type that contains ALL of our actions in the app.
 */
export type AllActions =
  | ColonyActionTypes
  | ColonyActionsActionTypes
  | GasPricesActionTypes
  | IpfsActionTypes
  | TransactionActionTypes
  | MessageActionTypes
  | UserActionTypes
  | MotionActionTypes
  | MultiSigActionTypes
  | MetacolonyVestingTypes
  | WalletActionTypes
  | DecisionActionTypes
  | ExpendituresActionTypes
  | ArbitraryActionTypes;

export type Action<T extends AllActions['type']> = Extract<
  AllActions,
  { type: T }
>;

export type ActionTypeString = AllActions['type'];

export type TakeFilter = (action: AllActions) => boolean;

export type MetaWithSetter<M> = {
  // Once new UI has been completed, 'navigate' can be removed.
  // Keeping only to maintain compatibility with old UI while we transition.
  navigate?: NavigateFunction;
  // And setTxHash can become required
  setTxHash?: (txHash: string) => void;
  updateUser?:
    | ((
        address: string | undefined,
        shouldBackgroundUpdate?: boolean | undefined,
      ) => Promise<void>)
    | undefined;
  colonyName?: string;
} & M;
