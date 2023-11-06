import { EmailPermissions } from '~gql';

export type UserEmailPermission = `${EmailPermissions}`;
type UserEmailPermissions = Array<UserEmailPermission>;

export interface CreateUserFormValues {
  [k: string]: string | UserEmailPermissions;
  username: string;
  emailAddress: string;
  emailPermissions: UserEmailPermissions;
}
