import { MessageDescriptor } from 'react-intl';

export type LeftColumnProps = {
  fieldTitle: MessageDescriptor;
  fieldDecription: MessageDescriptor;
};

export type UserProfileFormProps = {
  email?: string | null;
  bio?: string | null;
  username?: string | null;
  displayName?: string | null;
  location?: string | null;
  website?: string | null;
};
