import { type ExternalLinkProps } from '~shared/ExternalLink/types.ts';

export interface TransactionLinkProps extends ExternalLinkProps {
  /** Transaction hash */
  hash: string;
}
