import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncFunction, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { AnyExtensionData } from '~types';

export const useGetExtensionsViews = async () => {
  const colonyMetrics = 'https://api.thegraph.com/subgraphs/name/arrenv/colony-metrics-subgraph';
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

export const useExtensionDetailsPage = (extensionData: AnyExtensionData) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const extensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionData,
    };
  }, [colony?.colonyAddress, extensionData]);

  const submit = ActionTypes.EXTENSION_INSTALL;
  const error = ActionTypes.EXTENSION_INSTALL_ERROR;
  const success = ActionTypes.EXTENSION_INSTALL_SUCCESS;

  const asyncFunction = useAsyncFunction({ submit, error, success });

  const handleInstallClick = useCallback(async () => {
    try {
      await asyncFunction(extensionValues);
    } catch (err) {
      console.error(err);
    }
  }, [asyncFunction, extensionValues]);
  const handleEnableButtonClick = () => {
    navigate(`/colony/${colony?.name}/extensions/${extensionData?.extensionId}/setup`);
  };

  return {
    handleInstallClick,
    handleEnableButtonClick,
  };
};
