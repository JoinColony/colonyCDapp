import { WidgetBoxProps } from '../WidgetBox/types';

export interface WidthBoxItem extends WidgetBoxProps {
  key: string;
}

export interface WidgetBoxListProps {
  items: WidthBoxItem[];
  className?: string;
  isVertical?: boolean;
}
