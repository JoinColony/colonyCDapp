import { type ReactNode, type useState } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { type Maybe } from '~gql';

import type colonyMessages from '../i18n/en.json';

// export * from './keyboard';
// export * from './actions';
// export * from './extensions';
// export * from './transactions';
// export * from './wallet';
// export * from './graphql';
// export * from './rpcMethods';
// export * from './network';
// export * from './domains';
// export * from './safes';
// export * from './userStake';

export type WithKey = {
  key: any;
};

export type ExcludesNull = <T>(x: T | null) => x is T;
export type RequireProps<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// https://stackoverflow.com/questions/54607400/typescript-remove-entries-from-tuple-type
export type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? []
  : ((...b: T) => void) extends (a, ...b: infer I) => void
    ? I
    : [];

export interface DataObject<T> {
  data?: T;
  isFetching: boolean;
  error?: string;
}

export interface KeyedDataObject<T> extends DataObject<T> {
  key: string;
}

export type Address = string;

export type ENSName = string;

export type AddressOrENSName = Address | ENSName;

type PrimitiveType = string | number | boolean | null | undefined | Date;

/**
 * For messages that cannot contain JSX
 */
export type SimpleMessageValues = Record<string, PrimitiveType>;

/**
 * For messages that contain JSX
 */
export type ComplexMessageValues = Record<string, ReactNode>;

/**
 * For messages that contain both JSX and Primitive values
 */
export type AnyMessageValues = Record<
  string,
  PrimitiveType | JSX.Element | ((chunks: string[]) => JSX.Element)
>;

export type UniversalMessageValues =
  | SimpleMessageValues
  | ComplexMessageValues
  | AnyMessageValues;

export type TypedMessageDescriptor<M = typeof colonyMessages> = Omit<
  MessageDescriptor,
  'id'
> & {
  id: keyof M;
};

export type Message = string | MessageDescriptor | TypedMessageDescriptor;

/*
 Pick all the values from an object and make them `any` (handy for immutable default props)
 */
export type DefaultValues<V> = Record<keyof V, any>;

export interface RecordToJS<T> {
  toJS: (props: T) => void;
}

export type SetStateFn<T = any> = ReturnType<typeof useState<T>>[1];

export type Falsy = undefined | null | false;

export interface SelectedPickerItem {
  id: Address;
  profile: {
    displayName: string;
  };
  walletAddress: Address;
}

export type OptionalValue<T> = Maybe<T> | undefined;

export enum ManageVerifiedMembersOperation {
  Add = 'Add',
  Remove = 'Remove',
}
