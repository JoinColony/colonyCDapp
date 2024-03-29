import { type ExternalLinks } from '~gql';

export interface SocialLinksTableProps {
  name: string;
}

export interface SocialLinksTableModel {
  key: string;
  name: ExternalLinks;
  link: string;
}
