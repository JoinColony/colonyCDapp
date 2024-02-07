import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';

import { getHasActionPermissions } from './helpers.ts';

export const useHasActionPermissions = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { watch } = useFormContext();
  const formValues = watch();

  const hasPermissions = getHasActionPermissions(
    colony,
    user?.walletAddress ?? '',
    formValues,
  );

  return hasPermissions;
};
