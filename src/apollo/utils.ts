import { backOff } from 'exponential-backoff';

import { authenticateWalletWithRetry } from '~auth';

export async function mutateWithAuthRetry(
  mutationFn: () => Promise<any>,
  maxRetries = 3,
) {
  return backOff(() => mutationFn(), {
    numOfAttempts: maxRetries,
    retry: async (error) => {
      console.error(error);
      if (error.networkError?.statusCode === 403) {
        await authenticateWalletWithRetry();
      }
      return true;
    },
  });
}
