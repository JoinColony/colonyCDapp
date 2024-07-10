import { useCallback } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';

import {
  waitForColonyPermissions,
  waitForDbAfterExtensionAction,
} from './utils.tsx';

export const useGetExtensionsViews = async () => {
  const colonyMetrics =
    'https://api.thegraph.com/subgraphs/name/arrenv/colony-metrics-subgraph';
  const metricsRes = fetch(colonyMetrics, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
          votingReputationExtensions(first: 5) {
            installs
          }
          oneTxPaymentExtensions(first: 5) {
            installs
          }
        }`,
      variables: {},
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.error(e);
    });

  const [metricsOutput] = await Promise.all([metricsRes]);
  return metricsOutput.data;
};

export const useCheckExtensionEnabled = (extensionId) => {
  const { refetchColony } = useColonyContext();
  const { extensionData, refetchExtensionData } = useExtensionData(
    extensionId ?? '',
  );

  const checkExtensionEnabled = useCallback(async () => {
    /* Wait for permissions first, so that the permissions warning doesn't flash in the ui */
    await waitForColonyPermissions({ extensionData, refetchColony });
    await waitForDbAfterExtensionAction({
      method: ExtensionMethods.ENABLE,
      refetchExtensionData,
    });
  }, [extensionData, refetchColony, refetchExtensionData]);

  return { checkExtensionEnabled };
};
