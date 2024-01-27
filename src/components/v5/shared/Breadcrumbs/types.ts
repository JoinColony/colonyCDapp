import { CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export interface BreadcrumbDropdownOption
  extends Omit<CardSelectOption<string>, 'value'> {
  href: string;
  color?: string;
}

export type BreadcrumbsItem = { key: string } & (
  | { label: string; href?: string }
  | BreadCrumbsCardSelectItem
);

export interface BreadcrumbsProps {
  items: BreadcrumbsItem[];
  className?: string;
}

export interface BreadCrumbsCardSelectItem {
  dropdownOptions: BreadcrumbDropdownOption[];
  selectedValue: string;
}
