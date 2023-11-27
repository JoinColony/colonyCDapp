export interface WidgetBoxProps {
  title?: React.ReactNode;
  value: React.ReactNode;
  additionalContent?: React.ReactNode;
  className?: string;
  href?: string;
  iconName?: string;
  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
}
