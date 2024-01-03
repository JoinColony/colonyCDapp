import { defineMessages } from 'react-intl';
import { ValidationError, object, string, number } from 'yup';

import { FETCH_ABORTED, SAFE_NAMES_MAP } from '~constants';
import { Address, Safe } from '~types';
import { intl } from '~utils/intl';
import { getTxServiceBaseUrl } from '~utils/safes';
import { isAddress } from '~utils/web3';

import { displayName } from './AddExistingSafeDialog';

const { formatMessage } = intl({
  [`${displayName}.fetchFailedError`]:
    'Could not fetch {type} details. Please check your connection and try again.',
});

const MSG = defineMessages({
  contractAddressError: {
    id: `${displayName}.contractAddressError`,
    defaultMessage: 'Please enter a contract address',
  },
  safeAlreadyExistsError: {
    id: `${displayName}.safeAlreadyExistsError`,
    defaultMessage: 'Safe already exists in this colony.',
  },
  safeNotFoundError: {
    id: `${displayName}.safeNotFoundError`,
    defaultMessage: `Safe not found on {selectedChain}`,
  },
  safeNameError: {
    id: `${displayName}.safeNameError`,
    defaultMessage: 'Please enter a safe name',
  },
  moduleAddressError: {
    id: `${displayName}.moduleAddressError`,
    defaultMessage: 'Please enter a module address',
  },
  moduleNotConnectedError: {
    id: `${displayName}.moduleNotConnectedError`,
    defaultMessage: `Module not connected to Safe on {selectedChain}`,
  },
  moduleNotFoundError: {
    id: `${displayName}.moduleNotFoundError`,
    defaultMessage: `Module not found on {selectedChain}`,
  },
});

type LoadingState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
type AbortControllerState = [
  AbortController | undefined,
  React.Dispatch<React.SetStateAction<AbortController | undefined>>,
];

const handleTestCompletion = (
  result: true | ValidationError,
  loadingState?: LoadingState,
): Promise<true | ValidationError> => {
  const isFetchAborted = result !== true && result.message === FETCH_ABORTED;

  if (!isFetchAborted) {
    if (loadingState) {
      const [, setIsLoadingState] = loadingState;
      setIsLoadingState(false);
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  }

  // If fetching was aborted, don't show error.
  return new Promise((resolve) => {
    resolve(true);
  });
};

function getFetchErrorMsg(
  error: Error,
  type: 'Safe' | 'Module',
): ValidationError {
  // If fetch was aborted
  if (error instanceof DOMException && error.message.includes('abort')) {
    return this.createError({
      message: FETCH_ABORTED,
    });
  }

  // If fetching produces an error (e.g. network error)
  return this.createError({
    message: formatMessage({ id: `${displayName}.fetchFailedError` }, { type }),
  });
}

export const getValidationSchema = (
  stepIndex: number,
  abortControllerState: AbortControllerState,
  safes: Safe[],
  loadingModuleState: LoadingState,
) => {
  const [abortController, setAbortController] = abortControllerState;

  return object()
    .shape({
      chainId: number().required(),
      contractAddress: string()
        .address()
        .required(() => MSG.contractAddressError)
        .test(
          'is-address-valid',
          'Invalid Address Error',
          async function contractAddressTest(contractAddress) {
            /*
             * Return if address is invalid. This ensures yup doesn't wait for fetching to complete before
             * returning the "address" or "required" error messages.
             */
            if (!contractAddress || !isAddress(contractAddress)) {
              return false;
            }

            // Only run if we're on the "Check safe" page.
            if (stepIndex !== 1) {
              return true;
            }

            /*
             * Aborts outstanding previous fetch requests.
             * Avoids race conditions on slow connections and prevents
             * the incorrect error from being displayed.
             */
            const controller = new AbortController();
            setAbortController(controller);
            if (abortController) {
              abortController.abort();
            }

            const validateAddress = async () => {
              const isSafeAlreadyAdded = safes.find(
                (safe) =>
                  safe?.chainId === this.parent.chainId &&
                  safe?.address === contractAddress,
              );

              if (isSafeAlreadyAdded) {
                return this.createError({
                  message: formatMessage(MSG.safeAlreadyExistsError),
                });
              }

              const selectedChain: string = SAFE_NAMES_MAP[this.parent.chainId];
              const baseURL = getTxServiceBaseUrl(selectedChain);

              const getSafeData = async (
                url: string,
              ): Promise<ValidationError | true> => {
                try {
                  // Check if safe exists
                  const response = await fetch(url, {
                    signal: controller.signal,
                  });

                  // If safe exists on selected chain
                  if (response.status === 200) {
                    return true;
                  }

                  // If fetching is successful but returns any status code other than 200
                  return this.createError({
                    message: formatMessage(MSG.safeNotFoundError, {
                      selectedChain,
                    }),
                  });
                } catch (e) {
                  return getFetchErrorMsg.call(this, e, 'Safe');
                }
              };

              return getSafeData(`${baseURL}/v1/safes/${contractAddress}/`);
            };

            return validateAddress().then((result) => {
              return handleTestCompletion(result);
            });
          },
        ),
      safeName: string()
        .required(() => MSG.safeNameError)
        .max(20),
      annotation: string().max(4000),
      moduleContractAddress: string()
        .address()
        .required(() => MSG.moduleAddressError)
        .test(
          'does-module-exist',
          'Invalid Module Error',
          async function moduleAddressTest(moduleAddress) {
            if (!moduleAddress || !isAddress(moduleAddress)) {
              return false;
            }

            // Don't run if we're on the "Check safe" page.
            if (stepIndex === 1) {
              return true;
            }

            const controller = new AbortController();
            setAbortController(controller);
            if (abortController) {
              abortController.abort();
            }

            const fetchModule = async (): Promise<ValidationError | true> => {
              const selectedChain: string = SAFE_NAMES_MAP[this.parent.chainId];
              const baseURL = getTxServiceBaseUrl(selectedChain);
              try {
                const response = await fetch(
                  `${baseURL}/v1/modules/${moduleAddress}/safes`,
                  { signal: controller.signal },
                );
                if (response.status === 200) {
                  const { safes: connectedSafes }: { safes: Address[] } =
                    await response.json();
                  if (connectedSafes.includes(this.parent.contractAddress)) {
                    return true;
                  }
                  return this.createError({
                    message: formatMessage(MSG.moduleNotConnectedError, {
                      selectedChain,
                    }),
                  });
                }
                return this.createError({
                  message: formatMessage(MSG.moduleNotFoundError, {
                    selectedChain,
                  }),
                });
              } catch (e) {
                return getFetchErrorMsg.call(this, e, 'Module');
              }
            };

            return fetchModule().then((result) => {
              return handleTestCompletion(result, loadingModuleState);
            });
          },
        ),
    })
    .defined();
};
