import React from 'react';
import { DeepPartial } from 'utility-types';

import { Add, KeysAtLevel } from '~types/utilities';

export type FiltersValue = {
  [key: string]: boolean | FiltersValue;
};

export interface NestedItem<
  TValue extends FiltersValue,
  TLevel extends number,
> {
  label: React.ReactNode;
  name: KeysAtLevel<TValue, TLevel>;
  items?: NestedItem<TValue, Add<TLevel, 1>>[];
}

export interface RootItem<TValue extends FiltersValue> {
  name: keyof TValue;
  label: React.ReactNode;
  items: NestedItem<TValue, 2>[];
  icon: React.ReactNode;
  title: React.ReactNode;
}

interface CommonFilterProps<TValue extends FiltersValue> {
  value: DeepPartial<TValue>;
  onChange: (value: DeepPartial<TValue>) => void;
}

export interface FiltersProps<TValue extends FiltersValue>
  extends CommonFilterProps<TValue> {
  items: RootItem<TValue>[];
  searchValue: string;
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  customLabel?: React.ReactNode;
}

export interface NestedFilterProps<
  TValue extends FiltersValue,
  TLevel extends number,
> extends NestedItem<TValue, TLevel>,
    CommonFilterProps<TValue> {
  path: string;
}

export interface RootFilterProps<TValue extends FiltersValue>
  extends RootItem<TValue>,
    CommonFilterProps<TValue> {
  path: string;
}

export interface RootPickedFilterProps<TValue extends FiltersValue> {
  items: NestedItem<TValue, 2>[];
  value: DeepPartial<TValue>;
  label: React.ReactNode;
  onRemove: () => void;
}

export interface NestedPickedFilterProps<
  TValue extends FiltersValue,
  TLevel extends number,
> {
  items?: NestedItem<TValue, TLevel>[];
  value: DeepPartial<TValue>;
  label: React.ReactNode;
}
