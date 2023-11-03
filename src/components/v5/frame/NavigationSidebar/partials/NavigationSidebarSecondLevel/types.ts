import { ButtonLinkProps, ButtonProps } from '~v5/shared/Button/types';

export interface NavigationSidebarSecondLevelProps {
  title: string;
  content: React.ReactNode;
  description?: string;
  onArrowClick?: VoidFunction;
  isExpanded?: boolean;
  bottomActionProps?: ButtonProps | ButtonLinkProps;
}
