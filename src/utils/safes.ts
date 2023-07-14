import { ADDRESS_ZERO } from '~constants';
import { Safe } from '~gql';
import { Address } from '~types';
import { SafeBalance, SelectedSafe } from '~types/safes';

export const getSafe = (safes: Safe[], selectedSafe: SelectedSafe | null) => {
  if (!selectedSafe) return undefined;

  return safes.find(
    (safe) =>
      safe.address === selectedSafe.profile.walletAddress &&
      safe.moduleContractAddress === selectedSafe.id,
  );
};

export const getSelectedSafeBalance = (
  safeBalances?: SafeBalance[] | null,
  selectedTokenAddress?: Address,
) =>
  safeBalances?.find(
    (balance) =>
      balance.tokenAddress === selectedTokenAddress ||
      (!balance.tokenAddress && selectedTokenAddress === ADDRESS_ZERO),
  );
