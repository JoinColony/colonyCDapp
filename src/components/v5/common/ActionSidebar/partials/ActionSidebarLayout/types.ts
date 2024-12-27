import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';

export interface ActionSidebarLayoutProps {
  onCloseClick: () => void;
  additionalTopContent?: React.ReactNode;
  statusPill?: React.ReactNode;
  className?: string;
  shareButtonProps?: Omit<TooltipProps, 'tooltipContent'> & {
    tooltipContent?: React.ReactNode;
    onShareButtonClick: () => void;
  };
  isLoading?: boolean;
  maxSize?: 'small' | 'big';
}
