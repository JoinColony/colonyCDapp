import { type TextButtonProps } from '~v5/shared/Button/types.ts';
import { type LinkProps } from '~v5/shared/Link/types.ts';

export interface UserHubInfoSectionItem {
  key: string;
  label: string;
  labelTooltip?: string;
  value: React.ReactNode;
  valueTooltip?: string;
}

export interface UserHubInfoSectionProps {
  title: string;
  items: UserHubInfoSectionItem[];
  viewLinkProps?: TextButtonProps | LinkProps;
  className?: string;
}
