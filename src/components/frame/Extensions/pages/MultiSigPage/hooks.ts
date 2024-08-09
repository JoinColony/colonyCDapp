import { ColonyRole, Id } from '@colony/colony-js';
import { useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ExtensionSaveSettingsContext } from '~context/ExtensionSaveSettingsContext/ExtensionSaveSettingsContext.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import {
  MultiSigThresholdType,
  type DomainThresholdConfig,
  type MultiSigSetupFormValues,
} from './types.ts';
import {
  getDomainThresholds,
  getInitialDomainConfig,
  getInitialGlobalThreshold,
  getThresholdType,
} from './utils.ts';

export const useBackNavigation = ({ extensionData }) => {
  const navigate = useNavigate();

  /*
   * If we arrive here but the extension is not installed go back to main extension details page
   */
  useEffect(() => {
    if (!isInstalledExtensionData(extensionData)) {
      navigate(-1);
    }
  }, [extensionData, navigate]);
};

export const useThresholdData = ({ extensionData }) => {
  const multiSigConfig = extensionData.params?.multiSig || null;

  const {
    colony: { colonyAddress, domains },
    colony,
  } = useColonyContext();

  const { user } = useAppContext();
  const userHasRoles = addressHasRoles({
    requiredRolesDomain: Id.RootDomain,
    colony,
    requiredRoles: [ColonyRole.Root],
    address: user?.walletAddress || '',
  });
  const isFormDisabled = !userHasRoles;

  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    reset,
  } = useForm<MultiSigSetupFormValues>({
    defaultValues: {
      globalThreshold: getInitialGlobalThreshold(multiSigConfig),
      colonyAddress,
    },
    mode: 'onChange',
  });

  const { handleSetVisible, handleSetActionType, resetAll, callbackRef } =
    useContext(ExtensionSaveSettingsContext);

  const [thresholdType, setThresholdType] = useState<MultiSigThresholdType>(
    getThresholdType(multiSigConfig?.colonyThreshold),
  );

  const [domainThresholdConfigs, setDomainThresholdConfigs] = useState<
    DomainThresholdConfig[]
  >([]);

  useEffect(() => {
    handleSetVisible(true);
    handleSetActionType(ActionTypes.MULTISIG_SET_THRESHOLDS);

    return () => {
      resetAll();
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFormDisabled) {
      handleSetVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormDisabled]);

  useEffect(() => {
    if (!domains || !domains.items || !multiSigConfig) {
      return;
    }

    const domainsExcludingRoot = domains.items.filter(
      (domain): domain is NonNullable<typeof domain> =>
        domain !== null && !domain.isRoot,
    );

    const tempDomainThresholdConfigs = domainsExcludingRoot.map((domain) => {
      const { threshold, ...rest } = getInitialDomainConfig(
        domain,
        multiSigConfig,
      );

      setValue(rest.name, threshold);

      return rest;
    });

    setDomainThresholdConfigs(tempDomainThresholdConfigs);
  }, [domains, multiSigConfig, setValue]);

  useImperativeHandle(
    callbackRef,
    () => ({
      getValues: async () => {
        const isValid = await trigger(undefined, { shouldFocus: true });
        if (!isValid)
          throw new Error('Error in MultiSig extension domain threshold form');

        const values = getValues();

        return {
          colonyAddress,
          globalThreshold:
            thresholdType === MultiSigThresholdType.MAJORITY_APPROVAL
              ? 0
              : values.globalThreshold,
          domainThresholds: getDomainThresholds(
            values,
            domainThresholdConfigs,
            thresholdType,
          ),
        };
      },
    }),
    [trigger, getValues, thresholdType, domainThresholdConfigs, colonyAddress],
  );

  const handleGlobalThresholdTypeChange = (
    newThresholdType: MultiSigThresholdType,
  ) => {
    setThresholdType(newThresholdType);
  };

  const handleDomainThresholdTypeChange = (
    id: string,
    newType: MultiSigThresholdType,
  ) => {
    setDomainThresholdConfigs((prevDomainSettings) =>
      prevDomainSettings.map((domain) =>
        domain.id === id ? { ...domain, type: newType } : domain,
      ),
    );
  };

  const handleThresholdValueChange = (id: string, value: number) => {
    setValue(id, value, { shouldDirty: true, shouldValidate: true });
  };

  return {
    isFormDisabled,
    thresholdType,
    isFixedThresholdError: !!errors.globalThreshold,
    fixedThresholdErrorMessage: errors.globalThreshold?.message,
    domainThresholdConfigs: domainThresholdConfigs.map((config) => ({
      ...config,
      isError: !!errors[config.name],
      errorMessage: errors[config.name]?.message,
    })),
    register,
    handleThresholdValueChange,
    handleGlobalThresholdTypeChange,
    handleDomainThresholdTypeChange,
  };
};
