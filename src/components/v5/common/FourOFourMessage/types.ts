import { type ReactNode } from 'react';

export interface FourOFourMessageProps {
  description: string;
  links: ReactNode;
  primaryLinkButton: ReactNode;
  className?: string;
}
