import { type WidgetBoxProps } from '../WidgetBox/types.ts';

export interface WidthBoxItem extends WidgetBoxProps {
  key: string;
}

export interface WidgetBoxListProps {
  items: WidthBoxItem[];
  className?: string;
  isVertical?: boolean;
}
