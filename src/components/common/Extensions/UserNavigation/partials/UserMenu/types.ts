import { PropsGetterArgs } from 'react-popper-tooltip';

export interface UserMenuProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive': boolean | undefined;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isWalletConnected: boolean;
}
