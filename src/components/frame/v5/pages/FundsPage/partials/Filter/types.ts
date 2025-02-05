import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';

import { type Add, type KeysAtLevel } from '~types/utilities.ts';

export type FilterValue = {
  [key: string]: boolean | FilterValue;
};

export interface NestedItem<TValue extends FilterValue, TLevel extends number> {
  label: ReactNode;
  name: KeysAtLevel<TValue, TLevel>;
  icon?: Icon;
  symbol?: string;
  // @ts-ignore
  items?: NestedItem<TValue, Add<TLevel, 1>>[];
}

export interface RootItem<TValue extends FilterValue> {
  name: keyof TValue;
  label: ReactNode;
  items: NestedItem<TValue, 2>[];
  icon: Icon;
  title: ReactNode;
  filterName: string;
  containerClassName?: string;
}

export interface FilterProps<TValue extends FilterValue> {
  items: RootItem<TValue>[];
  value: Partial<TValue>;
  onChange: (value: Partial<TValue>) => void;
  searchValue: string;
  onSearch: (value: string) => void;
  searchInputLabel: string;
  searchInputPlaceholder: string;
  filtersHeader?: string;
  buttonText?: string;
}

export interface ExtendedFilterProps<TValue extends FilterValue>
  extends FilterProps<TValue> {
  tokenAddressesGroupedByChain: {
    chainId: string;
    tokenAddresses: string[];
  }[];
  isButtonDisabled?: boolean;
  shouldShowButton?: boolean;
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
  extends Omit<RootItem<TValue>, 'filterName'> {
  path: string;
  onChange: (value: Partial<TValue>) => void;
  value: Partial<TValue>;
}

export interface FilterPillsProps<TValue extends FilterValue> {
  value: Partial<TValue>;
}
