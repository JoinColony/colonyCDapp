import React, { useEffect, useMemo, useState } from 'react';

import { type User } from '~types/graphql.ts';

import { MemberModalContext } from './MemberModalContext.ts';

const MemberModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleCloseModals = () => {
      setIsMemberModalOpen(false);
    };

    window.addEventListener('closeModals', handleCloseModals);

    return () => window.removeEventListener('closeModals', handleCloseModals);
  }, []);

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
