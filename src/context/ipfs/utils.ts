export const raceAgainstTimeout = async ({
  promise,
  ms,
  err,
  cleanup,
}: {
  promise: Promise<any>;
  ms: number;
  err?: Error;
  cleanup?: () => any;
}) => {
  let timeout;
  const throwError = err || new Error('Timed out');
  const timeoutPromise = new Promise((resolve, reject) => {
    timeout = setTimeout(() => reject(throwError), ms);
  });
  try {
    // To be able to use the async error handling here, we need to explicitly
    // use `await`
    const result = await Promise.race([timeoutPromise, promise]);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    if (typeof cleanup === 'function') cleanup();
    clearTimeout(timeout);
  }
};
