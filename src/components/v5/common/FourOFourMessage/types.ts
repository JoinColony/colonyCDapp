export interface FourOFourMessageProps {
  description: string;
  links: {
    type: 'external' | 'internal';
    text: string;
    location: string;
  }[];
  primaryLinkButton: {
    onClick?: () => void;
    text: string;
    location: string;
  };
}
