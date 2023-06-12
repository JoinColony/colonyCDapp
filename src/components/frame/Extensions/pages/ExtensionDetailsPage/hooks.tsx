import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ColonyVersion, Extension, ExtensionVersion, isExtensionCompatible } from '@colony/colony-js';
import { useAsyncFunction, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { AnyExtensionData } from '~types';
import { mapPayload } from '~utils/actions';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';
import Toast from '~shared/Extensions/Toast';

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

  const transform = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    extensionId: extensionData.extensionId,
    version: extensionData.availableVersion,
  }));

  const asyncFunctionInstall = useAsyncFunction({
    submit: ActionTypes.EXTENSION_INSTALL,
    error: ActionTypes.EXTENSION_INSTALL_ERROR,
    success: ActionTypes.EXTENSION_INSTALL_SUCCESS,
  });

  const asyncFunctionUpgrade = useAsyncFunction({
    submit: ActionTypes.EXTENSION_UPGRADE,
    error: ActionTypes.EXTENSION_UPGRADE_ERROR,
    success: ActionTypes.EXTENSION_UPGRADE_SUCCESS,
    transform,
  });

  const isSupportedColonyVersion = (colony?.version as ColonyVersion) >= MIN_SUPPORTED_COLONY_VERSION;

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colony?.version as ColonyVersion,
  );

  const isUpgradeButtonDisabled = !isSupportedColonyVersion || !extensionCompatible;

  const navigateToExtensionSettingsPage = useCallback(() => {
    if (extensionData?.extensionId === Extension.VotingReputation) {
      navigate(`/colony/${colony?.name}/extensions/${extensionData?.extensionId}/setup`);
    } else {
      navigate(`/colony/${colony?.name}/extensions/${extensionData?.extensionId}`);
    }
  }, [navigate, colony?.name, extensionData?.extensionId]);

  const handleInstallClick = useCallback(async () => {
    try {
      await asyncFunctionInstall(extensionValues);
      navigateToExtensionSettingsPage();
    } catch (err) {
      console.error(err);
    }
  }, [asyncFunctionInstall, extensionValues, navigateToExtensionSettingsPage]);

  const handleUpdateVersionClick = useCallback(async () => {
    try {
      const response = await asyncFunctionUpgrade(extensionValues).then(() =>
        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionUpgrade.toast.title.success' }}
            description={{ id: 'extensionUpgrade.toast.description.success' }}
          />,
        ),
      );
      return response;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);

      return toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionUpgrade.toast.title.error' }}
          description={{ id: 'extensionUpgrade.toast.description.error' }}
        />,
      );
    }
  }, [asyncFunctionUpgrade, extensionValues]);

  return {
    handleInstallClick,
    handleUpdateVersionClick,
    isUpgradeButtonDisabled,
  };
};
