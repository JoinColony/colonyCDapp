import { Add, KeysAtLevel } from '~types/utilities';

export type FilterValue = {
  [key: string]: boolean | FilterValue;
};

export interface NestedItem<TValue extends FilterValue, TLevel extends number> {
  label: string;
  key: KeysAtLevel<TValue, TLevel>;
  items?: NestedItem<TValue, Add<TLevel, 1>>[];
}

export interface RootItem<TValue extends FilterValue> {
  key: keyof TValue;
  label: string;
  items: NestedItem<TValue, 2>[];
  iconName: string;
}

export interface FilterProps<TValue extends FilterValue> {
  items: RootItem<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}

export interface FilterItemProps extends Omit<RootItem, 'key'> {
  parentKey: string;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}
