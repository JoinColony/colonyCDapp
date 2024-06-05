export enum FourOFourMessageLinkType {
  Internal = 'internal',
  External = 'external',
}

export interface FourOFourMessageProps {
  description: string;
  links: {
    type: FourOFourMessageLinkType;
    text: string;
    location: string;
  }[];
  primaryLinkButton: {
    onClick?: () => void;
    text: string;
    location?: string;
  };
}
