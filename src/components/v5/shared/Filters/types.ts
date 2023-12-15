import React from 'react';
import { DeepPartial } from 'utility-types';

import { TuplifyUnion } from '~types/utilities';

export type FiltersValue = {
  [key: string]: any;
};

type FilterValueToKeysTuple<TValue extends FiltersValue> = TuplifyUnion<
  keyof TValue
>;

type NestedItems<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  Keys extends [...any[]],
> = {
  [Index in keyof Keys]: NestedItem<
    TValue[Keys[Index]],
    TFullValue,
    Keys[Index]
  >;
};

type RootItems<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  Keys extends [...any[]],
> = {
  [Index in keyof Keys]: RootItem<TValue[Keys[Index]], TFullValue, Keys[Index]>;
};

interface NestedItem<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  TName extends keyof TValue,
> {
  label?: React.ReactNode;
  name: TName;
  items?: NestedItems<
    TValue,
    TFullValue,
    FilterValueToKeysTuple<TValue>
  >[number][];
  popoverClassName?: string;
  render?: (props: {
    value: DeepPartial<TValue>;
    onChange: (value: DeepPartial<TValue> | undefined) => void;
  }) => React.ReactNode;
  renderPickedLabel?: (props: {
    value: DeepPartial<TValue>;
    label: React.ReactNode;
  }) => React.ReactNode;
}

interface RootItem<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  TName extends keyof TValue,
> {
  name: TName;
  label: React.ReactNode;
  items: NestedItems<
    TValue,
    TFullValue,
    FilterValueToKeysTuple<TValue>
  >[number][];
  icon: React.ReactNode;
  title: React.ReactNode;
  popoverClassName?: string;
}

interface CommonFilterProps<TValue extends FiltersValue> {
  value: DeepPartial<TValue>;
  onChange: (value: DeepPartial<TValue>) => void;
}

export interface FiltersProps<TValue extends FiltersValue>
  extends CommonFilterProps<TValue> {
  items: RootItems<TValue, TValue, FilterValueToKeysTuple<TValue>>[number][];
  searchValue: string;
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  popoverClassName?: string;
}

export interface NestedFilterProps<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  TName extends keyof TValue,
> extends NestedItem<TValue, TFullValue, TName>,
    CommonFilterProps<TFullValue> {
  path: string;
}

export interface RootFilterProps<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
  TName extends keyof TValue,
> extends RootItem<TValue, TFullValue, TName>,
    CommonFilterProps<TFullValue> {
  path: string;
}

export interface RootPickedFilterProps<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
> {
  items: NestedItems<
    TValue,
    TFullValue,
    FilterValueToKeysTuple<TValue>
  >[number][];
  value: DeepPartial<TFullValue>;
  label: React.ReactNode;
  onRemove: () => void;
}

export interface NestedPickedFilterProps<
  TValue extends FiltersValue,
  TFullValue extends FiltersValue,
> {
  items?: NestedItems<
    TValue,
    TFullValue,
    FilterValueToKeysTuple<TValue>
  >[number][];
  value: DeepPartial<TFullValue>;
  label: React.ReactNode;
}
