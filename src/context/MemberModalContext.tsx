import React, { createContext, useContext, useMemo, useState } from 'react';

import { User } from '~types/graphql.ts';

const MemberModalContext = createContext<
  | undefined
  | {
      isMemberModalOpen: boolean;
      setIsMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
      user?: User | null;
      setUser: (user: User | undefined | null) => void;
    }
>(undefined);

export const MemberModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);

  const value = useMemo(
    () => ({ user, setUser, isMemberModalOpen, setIsMemberModalOpen }),
    [user, setUser, isMemberModalOpen, setIsMemberModalOpen],
  );

  return (
    <MemberModalContext.Provider value={value}>
      {children}
    </MemberModalContext.Provider>
  );
};

export const useMemberModalContext = () => {
  const context = useContext(MemberModalContext);

  if (context === undefined) {
    throw new Error(
      'useMemberModalContext must be used within a MemberModalProvider',
    );
  }

  return context;
};
