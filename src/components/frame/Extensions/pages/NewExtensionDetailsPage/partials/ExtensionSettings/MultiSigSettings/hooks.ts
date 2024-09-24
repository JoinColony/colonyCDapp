import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import {
  type MultiSigThresholdType,
  type DomainThresholdConfig,
} from './types.ts';
import { getInitialDomainConfig, getThresholdType } from './utils.ts';

export const useThresholdData = (extensionData: AnyExtensionData) => {
  const multiSigConfig = isInstalledExtensionData(extensionData)
    ? extensionData.params?.multiSig || null
    : null;

  const {
    colony: { domains },
  } = useColonyContext();

  const {
    setValue,

    formState: { errors },
  } = useFormContext();
  const [thresholdType, setThresholdType] = useState<MultiSigThresholdType>(
    getThresholdType(multiSigConfig?.colonyThreshold),
  );

  const [domainThresholdConfigs, setDomainThresholdConfigs] = useState<
    DomainThresholdConfig[]
  >([]);

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

  // Will be needed for mapping payload
  // getValues: async () => {
  //   const isValid = await trigger(undefined, { shouldFocus: true });
  //   if (!isValid)
  //     throw new Error('Error in MultiSig extension domain threshold form');

  //   const values = getValues();

  //   return {
  //     colonyAddress,
  //     globalThreshold:
  //       thresholdType === MultiSigThresholdType.MAJORITY_APPROVAL
  //         ? 0
  //         : values.globalThreshold,
  //     domainThresholds: getDomainThresholds(
  //       values,
  //       domainThresholdConfigs,
  //       thresholdType,
  //     ),
  //   };
  // },

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
    thresholdType,
    isFixedThresholdError: !!errors.globalThreshold,
    fixedThresholdErrorMessage: errors.globalThreshold?.message?.toString(),
    domainThresholdConfigs: domainThresholdConfigs.map((config) => ({
      ...config,
      isError: !!errors[config.name],
      errorMessage: errors[config.name]?.message?.toString(),
    })),
    handleThresholdValueChange,
    handleGlobalThresholdTypeChange,
    handleDomainThresholdTypeChange,
  };
};
