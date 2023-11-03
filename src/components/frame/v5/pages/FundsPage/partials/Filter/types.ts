export interface NestedItem {
  label: string;
  key: string;
  items?: NestedItem[];
}

export interface RootItem {
  key: string;
  label: string;
  items: NestedItem[];
  iconName: string;
}

export type FilterValue = {
  [key: string]: boolean | FilterValue;
};

export interface FilterProps {
  items: RootItem[];
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export interface FilterItemProps extends Omit<RootItem, 'key'> {
  parentKey: string;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}
