import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import {
  ColonyVersion,
  Extension,
  ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';
import { useAsyncFunction, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { AnyExtensionData } from '~types';
import { mapPayload } from '~utils/actions';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';
import Toast from '~shared/Extensions/Toast';

export const useFetchActiveInstallsExtension = () => {
  const [oneTxPaymentData, setOneTxPaymentData] = useState<string>();
  const [votingReputationData, setVotingReputationData] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios({
          method: 'post',
          url: 'https://api.thegraph.com/subgraphs/name/arrenv/colony-metrics-subgraph',
          data: {
            query: `{
                votingReputationExtensions(first: 5) {
                  installs
                }
                oneTxPaymentExtensions(first: 5) {
                  installs
                }
              }`,
          },
        });
        setOneTxPaymentData(
          responseData.data.data.oneTxPaymentExtensions[0].installs,
        );
        setVotingReputationData(
          responseData.data.data.votingReputationExtensions[0].installs,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return { votingReputationData, oneTxPaymentData };
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

  const isSupportedColonyVersion =
    (colony?.version as ColonyVersion) >= MIN_SUPPORTED_COLONY_VERSION;

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colony?.version as ColonyVersion,
  );

  const isUpgradeButtonDisabled =
    !isSupportedColonyVersion || !extensionCompatible;

  const navigateToExtensionSettingsPage = useCallback(() => {
    navigate(
      `/colony/${colony?.name}/extensions/${extensionData?.extensionId}/setup`,
    );
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
