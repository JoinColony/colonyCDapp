import { ReactNode } from 'react';

export * from './keys';
export * from './actions';
export * from './motions';
export * from './extensions';
export * from './users';
export * from './tokens';
export * from './transactions';
export * from './contracts';
export * from './wallet';

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
 * For messages that cannot contain JSX - use with `Intl.formatMessage()`;
 */
export type SimpleMessageValues = Record<string, PrimitiveType>;

/**
 * For messages that contain JSX - use with FormattedMessage
 */
export type ComplexMessageValues = Record<string, ReactNode>;

/**
 * For messages that contain both JSX and Primitive values - use with FormattedMessage directly
 */
export type UniversalMessageValues = Record<string, PrimitiveType | ReactNode>;

/*
 Pick all the values from an object and make them `any` (handy for immutable default props)
 */
export type DefaultValues<V> = Record<keyof V, any>;

export interface RecordToJS<T> {
  toJS: (props: T) => void;
}
