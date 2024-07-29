import React from 'react';

import { UserHubTabs } from '../UserHub/types.ts';

interface UserHubContextValue {
  closeUserHub: () => void;
  activeTab: UserHubTabs;
  setActiveTab: (tab: UserHubTabs) => void;
}

export const UserHubContext = React.createContext<UserHubContextValue>({
  closeUserHub: () => {},
  activeTab: UserHubTabs.Balance,
  setActiveTab: () => {},
});

export const useUserHubContext = () => React.useContext(UserHubContext);
