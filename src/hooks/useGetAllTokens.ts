import { useMemo } from 'react';

import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import { notNull } from '~utils/arrays';

import useColonyContext from './useColonyContext';

export const useGetAllTokens = () => {
  const { colony } = useColonyContext();
  const predefinedTokens = getTokenList();
  const colonyTokens = useMemo(
    () => colony.tokens?.items.filter(notNull) || [],
    [colony.tokens?.items],
  );

  return useMemo(
    () => [...colonyTokens, ...predefinedTokens],
    [colonyTokens, predefinedTokens],
  );
};
