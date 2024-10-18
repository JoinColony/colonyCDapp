export interface FeedbackButtonProps {
  onClick?: () => void;
  isPopoverMode?: boolean;
  widgetPlacement?: {
    alignment?: 'left' | 'right';
    verticalPadding?: number;
    horizontalPadding?: number;
  };
}
