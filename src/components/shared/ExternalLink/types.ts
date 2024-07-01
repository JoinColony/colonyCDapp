import { type HTMLProps } from 'react';

export interface ExternalLinkProps extends HTMLProps<HTMLAnchorElement> {
  hasHover?: boolean;
}
