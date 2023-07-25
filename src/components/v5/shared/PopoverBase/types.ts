import { PropsGetterArgs } from 'react-popper-tooltip';

import { CardProps } from '~v5/shared/Card/types';

export interface PopoverBaseProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  classNames?: string;
  cardProps?: CardProps;
  withTooltipStyles?: boolean;
  isTopSectionWithBackground?: boolean;
}
