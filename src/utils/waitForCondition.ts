type CheckConditionFunction = () => Promise<boolean>;

export function waitForCondition(
  checkCondition: CheckConditionFunction,
  options: {
    interval?: number;
    timeout?: number;
    customError?: string;
  },
): Promise<void> {
  const {
    interval = 1000,
    timeout = 30000,
    customError = `After ${timeout / 1000} seconds, failed to meet condition`,
  } = options;

  return new Promise<void>((resolve, reject) => {
    const initTime = new Date().valueOf();
    const intervalId = setInterval(async () => {
      // Check if the timeout has been reached
      if (new Date().valueOf() - initTime > timeout) {
        // After timeout, assume something went wrong
        clearInterval(intervalId);
        reject(new Error(customError));
        return;
      }

      // Check the condition
      const conditionMet = await checkCondition();

      if (conditionMet) {
        clearInterval(intervalId);
        resolve();
      }
    }, interval);
  });
}
