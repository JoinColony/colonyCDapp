import { ReactNode, useState } from 'react';
import { MessageDescriptor } from 'react-intl';

export * from './keyboard';
export * from './actions';
export * from './extensions';
export * from './transactions';
export * from './wallet';
export * from './graphql';
export * from './rpcMethods';
export * from './network';
export * from './domains';

export type WithKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export type AnyMessageValues = Record<string, PrimitiveType | ReactNode>;

export type UniversalMessageValues =
  | SimpleMessageValues
  | ComplexMessageValues
  | AnyMessageValues;

export type Message = MessageDescriptor | string;

/*
 Pick all the values from an object and make them `any` (handy for immutable default props)
 */
export type DefaultValues<V> = Record<keyof V, any>;

export interface RecordToJS<T> {
  toJS: (props: T) => void;
}

export type SetStateFn = ReturnType<typeof useState>[1];

export type Falsy = undefined | null | false;
