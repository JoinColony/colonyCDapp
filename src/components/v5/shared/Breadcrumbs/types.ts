import { CardSelectOption } from '~v5/common/Fields/CardSelect/types';

export interface BreadcrumbDropdownOption
  extends Omit<CardSelectOption<string>, 'value'> {
  href: string;
  color?: string;
}

export type BreadcrumbsItem = { key: string } & (
  | { label: string; href: string }
  | { dropdownOptions: BreadcrumbDropdownOption[]; selectedValue: string }
);

export interface BreadcrumbsProps {
  items: BreadcrumbsItem[];
  className?: string;
}
