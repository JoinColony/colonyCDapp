import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from 'react';

import { type User } from '~types/graphql.ts';

export const MemberModalContext = createContext<
  | undefined
  | {
      isMemberModalOpen: boolean;
      setIsMemberModalOpen: Dispatch<SetStateAction<boolean>>;
      user?: User | null;
      setUser: (user: User | undefined | null) => void;
    }
>(undefined);

export const useMemberModalContext = () => {
  const context = useContext(MemberModalContext);

  if (context === undefined) {
    throw new Error(
      'useMemberModalContext must be used within a MemberModalProvider',
    );
  }

  return context;
};
