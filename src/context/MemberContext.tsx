import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { User } from '~types';

import noop from '~utils/noop';

export const MemberContext = createContext<{
  isMemberModalOpen: boolean;
  setIsMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User | null;
  setUser: (user: User | undefined | null) => void;
}>({
  isMemberModalOpen: false,
  setIsMemberModalOpen: noop,
  setUser: noop,
  user: undefined,
});

export const MemberContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [user, setUser] = useState<User | undefined | null>(undefined);

  const value = useMemo(
    () => ({ isMemberModalOpen, setIsMemberModalOpen, user, setUser }),
    [isMemberModalOpen, user],
  );

  return (
    <MemberContext.Provider {...{ value }}>{children}</MemberContext.Provider>
  );
};

export const useMemberContext = () => useContext(MemberContext);
