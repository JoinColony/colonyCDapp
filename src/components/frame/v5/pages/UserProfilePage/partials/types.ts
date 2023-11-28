import { UserFragment } from '~gql';

export type LeftColumnProps = {
  fieldTitle: React.ReactNode;
  fieldDescription: React.ReactNode;
};

export type UserProfileFormProps = {
  hasDisplayNameChanged?: boolean;
  bio?: string | null;
  username?: string | null;
  displayName?: string | null;
  location?: string | null;
  website?: string | null;
};

export interface UserProfilePageFormProps {
  user?: UserFragment | null;
  avatarUrl?: string | null;
  canChangeUsername: boolean;
  daysTillUsernameChange: number;
}
