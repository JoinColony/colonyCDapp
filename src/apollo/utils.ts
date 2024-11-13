import { authenticateWalletWithRetry } from '~auth';

export async function mutateWithAuthRetry(
  mutationFn: () => Promise<any>,
  maxRetries = 3,
) {
  let attempts = 0;
  let result: any;
  while (attempts < maxRetries) {
    attempts += 1;
    try {
      // eslint-disable-next-line no-await-in-loop
      result = await mutationFn();
      return result;
    } catch (error) {
      if (attempts >= maxRetries) {
        throw error;
      }

      // Re-attempt authentication on 403 status
      if (error.networkError?.statusCode === 403) {
        // eslint-disable-next-line no-await-in-loop
        await authenticateWalletWithRetry();
      }

      console.error(`Attempt ${attempts} failed, retrying...`, error);
    }
  }

  return result;
}
