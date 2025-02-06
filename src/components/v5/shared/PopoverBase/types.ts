import { type PropsGetterArgs } from 'react-popper-tooltip';

import { type CardProps } from '~v5/shared/Card/types.ts';

export interface PopoverBaseProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  className?: string;
  cardProps?: CardProps;
  withTooltipStyles?: boolean;
  isTopSectionWithBackground?: boolean;
  style?: any;
}
