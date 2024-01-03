import React from 'react';

import { Add, KeysAtLevel } from '~types/utilities';

export type FilterValue = {
  [key: string]: boolean | FilterValue;
};

export interface NestedItem<TValue extends FilterValue, TLevel extends number> {
  label: React.ReactNode;
  name: KeysAtLevel<TValue, TLevel>;
  items?: NestedItem<TValue, Add<TLevel, 1>>[];
}

export interface RootItem<TValue extends FilterValue> {
  name: keyof TValue;
  label: React.ReactNode;
  items: NestedItem<TValue, 2>[];
  iconName: string;
  title: React.ReactNode;
}

export interface FilterProps<TValue extends FilterValue> {
  items: RootItem<TValue>[];
  value: Partial<TValue>;
  onChange: (value: Partial<TValue>) => void;
  searchValue: string;
  onSearch: (value: string) => void;
}

export interface NestedFilterProps<
  TValue extends FilterValue,
  TLevel extends number,
> extends NestedItem<TValue, TLevel> {
  path: string;
  onChange: (value: Partial<TValue>) => void;
  value: Partial<TValue>;
}

export interface RootFilterProps<TValue extends FilterValue>
  extends RootItem<TValue> {
  path: string;
  onChange: (value: Partial<TValue>) => void;
  value: Partial<TValue>;
}

export interface FilterPillsProps<TValue extends FilterValue> {
  value: Partial<TValue>;
}
