export type SubNavigationItemProps = {
  iconName: string;
  title: string;
  shouldBeTooltipVisible?: boolean;
  onClick?: () => void;
  isCopyTriggered?: boolean;
  tooltipText?: string[];
};
