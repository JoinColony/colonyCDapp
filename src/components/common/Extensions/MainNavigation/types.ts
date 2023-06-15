import { PropsGetterArgs } from 'react-popper-tooltip';

export interface MainNavigationProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isMenuOpen: boolean;
}
