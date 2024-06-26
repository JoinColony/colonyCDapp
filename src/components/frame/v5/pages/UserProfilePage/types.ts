import { type MessageDescriptor } from 'react-intl';

export type LeftColumnProps = {
  fieldTitle: MessageDescriptor;
  fieldDescription: MessageDescriptor;
  className?: string;
};

export type UserProfileFormProps = {
  hasDisplayNameChanged?: boolean;
  bio?: string | null;
  username?: string | null;
  displayName?: string | null;
  location?: string | null;
  website?: string | null;
};

export enum TabId {
  Profile = 0,
  Preferences = 1,
  Advanced = 2,
  CryptoToFiat = 3,
}
