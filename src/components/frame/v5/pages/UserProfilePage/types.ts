import { MessageDescriptor } from 'react-intl';

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
  Tab0 = 0,
  Tab1 = 1,
  Tab2 = 2,
}
