import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
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

    const domainsExcludingRoot = domains.items.filter(
      (domain): domain is NonNullable<typeof domain> =>
        domain !== null && !domain.isRoot,
    );

    for (const domain of domainsExcludingRoot) {
      const config = getInitialDomainConfig(domain, multiSigConfig);

      setValue(`domainThresholds.${config.id}`, config);
    }
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
    id: string,
    newType: MultiSigThresholdType,
  ) => {
    setValue(`domainThresholds.${id}.type`, newType, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return {
    register,
    thresholdType,
    isFixedThresholdError: !!errors.globalThreshold,
    fixedThresholdErrorMessage: errors.globalThreshold?.message?.toString(),
    domainThresholdConfigs: Object.values(domainThresholdConfigs ?? {}).map(
      (config) => ({
        ...config,
        isError: !!errors[config.domainName],
        errorMessage: errors[config.domainName]?.message?.toString(),
      }),
    ),
    handleGlobalThresholdTypeChange,
    handleDomainThresholdTypeChange,
  };
};
