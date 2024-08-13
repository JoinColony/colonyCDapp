import { type Config as PopperConfig } from 'react-popper-tooltip';

export interface ColonySwitcherProps {
  isLogoButton?: boolean;
  offset?: PopperConfig['offset'];
  className?: string;
  enableMobileAndDesktopLayoutBreakpoints?: boolean;
}
