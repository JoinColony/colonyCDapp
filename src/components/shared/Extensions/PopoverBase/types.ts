import { PropsGetterArgs } from 'react-popper-tooltip';
import { CardProps } from '../Card/types';

export interface PopoverBaseProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  classNames?: string;
  cardProps?: CardProps;
  withoutTooltipStyles?: boolean;
}
