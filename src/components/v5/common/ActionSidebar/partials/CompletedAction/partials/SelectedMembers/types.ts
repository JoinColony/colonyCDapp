import { type User } from '~types/graphql.ts';

export enum SelectedMemberType {
  USER = 'user',
  ADDRESS = 'address',
}

type UserMember = {
  type: SelectedMemberType.USER;
  data: User;
};

type AddressMember = {
  type: SelectedMemberType.ADDRESS;
  data: {
    walletAddress: string;
  };
};

export type SelectedMember = UserMember | AddressMember;
