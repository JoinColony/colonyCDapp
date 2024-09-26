import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { notNull } from '~utils/arrays/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import {
  type MultiSigSettingsFormValues,
  type MultiSigThresholdType,
} from './types.ts';
import { getInitialDomainConfig } from './utils.ts';

export const useThresholdData = (extensionData: AnyExtensionData) => {
  const multiSigConfig = isInstalledExtensionData(extensionData)
    ? extensionData.params?.multiSig || null
    : null;

  const {
    colony: { domains },
  } = useColonyContext();

  const {
    setValue,
    register,
    formState: { errors },
    watch,
  } = useFormContext<MultiSigSettingsFormValues>();

  const thresholdType = watch('thresholdType');
  const domainThresholdConfigs = watch('domainThresholds');

  useEffect(() => {
    if (!domains || !domains.items || !multiSigConfig) {
      return;
    }

    const domainsExcludingRoot = domains.items
      .filter(notNull)
      .filter((domain) => !domain.isRoot);

    domainsExcludingRoot.forEach((domain, index) => {
      const config = getInitialDomainConfig(domain, multiSigConfig);

      setValue(`domainThresholds.${index}`, config);
    });
  }, [domains, multiSigConfig, setValue]);

  const handleGlobalThresholdTypeChange = (
    newThresholdType: MultiSigThresholdType,
  ) => {
    setValue('thresholdType', newThresholdType, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleDomainThresholdTypeChange = (
    index: number,
    newType: MultiSigThresholdType,
  ) => {
    setValue(`domainThresholds.${index}.type`, newType, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return {
    register,
    thresholdType,
    isFixedThresholdError: !!errors.globalThreshold,
    fixedThresholdErrorMessage: errors.globalThreshold?.message?.toString(),
    domainThresholdConfigs: domainThresholdConfigs.map((config, index) => ({
      ...config,
      errorMessage:
        errors.domainThresholds?.[index]?.threshold?.message?.toString(),
    })),
    handleGlobalThresholdTypeChange,
    handleDomainThresholdTypeChange,
  };
};
