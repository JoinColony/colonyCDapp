import { type PropsGetterArgs } from 'react-popper-tooltip';

export interface UserMenuProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isVerified?: boolean;
  hideColonies?: boolean;
}

export enum UserMenuItemName {
  CONTACT_AND_SUPPORT = 'userMenu.contactAndSupportTitle',
  DEVELOPERS = 'userMenu.developersTitle',
  LEGAL_AND_PRIVACY = 'userMenu.legalAndPrivacyTitle',
  CURRENCY = 'userMenu.supportedCurrenciesTitle',
}
