import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { isAddress } from '~utils/web3';
import { FETCH_ABORTED, SAFE_NAMES_MAP } from '~constants';
// import { ColonySafe } from '~data/generated';
import { intl } from '~utils/intl';

import { getTxServiceBaseUrl } from './helpers';
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
});

type LoadingState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
type AbortControllerState = [
  AbortController | undefined,
  React.Dispatch<React.SetStateAction<AbortController | undefined>>,
];

const handleTestCompletion = (
  result: true | yup.ValidationError,
  loadingState: LoadingState,
): Promise<true | yup.ValidationError> => {
  const isFetchAborted = result !== true && result.message === FETCH_ABORTED;
  const [, setIsLoadingState] = loadingState;

  if (!isFetchAborted) {
    setIsLoadingState(false);
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
): yup.ValidationError {
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
  safes: Array<any>, // ColonySafe[],
  loadingSafeState: LoadingState,
  // loadingModuleState: LoadingState,
) => {
  const [abortController, setAbortController] = abortControllerState;

  return yup
    .object()
    .shape({
      chainId: yup.number().required(),
      contractAddress: yup
        .string()
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
                  safe?.contractAddress === contractAddress,
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
              ): Promise<yup.ValidationError | true> => {
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
              return handleTestCompletion(result, loadingSafeState);
            });
          },
        ),
      safeName: yup
        .string()
        .required(() => MSG.safeNameError)
        .max(20),
    })
    .defined();
};
