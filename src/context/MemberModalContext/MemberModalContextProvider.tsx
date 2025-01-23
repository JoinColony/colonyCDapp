import React, { useMemo, useState } from 'react';

import useCloseModals from '~hooks/useCloseModals.ts';
import { type User } from '~types/graphql.ts';

import { MemberModalContext } from './MemberModalContext.ts';

const MemberModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);

  useCloseModals(() => setIsMemberModalOpen(false));

  const value = useMemo(
    () => ({ user, setUser, isMemberModalOpen, setIsMemberModalOpen }),
    [user, isMemberModalOpen],
  );

  return (
    <MemberModalContext.Provider value={value}>
      {children}
    </MemberModalContext.Provider>
  );
};

export default MemberModalContextProvider;
