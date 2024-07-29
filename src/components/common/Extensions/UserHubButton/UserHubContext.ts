import React from 'react';

interface UserHubContextValue {
  closeUserHub: () => void;
}

export const UserHubContext = React.createContext<UserHubContextValue>({
  closeUserHub: () => {},
});

export const useUserHubContext = () => React.useContext(UserHubContext);
