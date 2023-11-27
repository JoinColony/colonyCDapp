import { ExternalLinks } from '~gql';

export interface SocialLinksTableProps {
  name: string;
}

export interface SocialLinksTableModel {
  key: string;
  linkType: ExternalLinks;
  url: string;
}

export interface SocialLinksButtonsProps {
  type: ExternalLinks;
  icon: JSX.Element;
}
