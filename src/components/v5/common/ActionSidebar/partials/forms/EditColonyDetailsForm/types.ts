import { type ExternalLink } from '~gql';

export interface EditColonyDetailsFormValues {
  avatar?: {
    image?: string | null;
    thumbnail?: string | null;
  };
  colonyName: string;
  createdIn: string;
  decisionMethod: string;
  description?: string;
  colonyDescription: string;
  title?: string;
  externalLinks: ExternalLink[];
}
