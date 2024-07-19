import { useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ExtensionSaveSettingsContext } from '~context/ExtensionSaveSettingsContext/ExtensionSaveSettingsContext.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import { MultiSigThresholdType, type DomainThresholdConfig } from './types.ts';

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

  const defaultFixedThreshold = multiSigConfig
    ? multiSigConfig.colonyThreshold
    : 0;

  const {
    colony: { colonyAddress, domains },
  } = useColonyContext();

  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid },
    reset,
  } = useForm<any>({
    defaultValues: { globalThreshold: defaultFixedThreshold || '' },
    mode: 'onChange',
  });

  const { handleIsVisible, handleSetActionType, resetAll, callback } =
    useContext(ExtensionSaveSettingsContext);

  const [thresholdType, setThresholdType] = useState<MultiSigThresholdType>(
    multiSigConfig && multiSigConfig.colonyThreshold > 0
      ? MultiSigThresholdType.FIXED_THRESHOLD
      : MultiSigThresholdType.MAJORITY_APPROVAL,
  );

  const [domainThresholdConfigs, setDomainThresholdConfigs] = useState<
    DomainThresholdConfig[]
  >([]);

  useEffect(() => {
    handleIsVisible(true);
    handleSetActionType(ActionTypes.MULTISIG_SET_THRESHOLDS);

    return () => {
      resetAll();
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue('colonyAddress', colonyAddress);
  }, [colonyAddress, setValue]);

  useEffect(() => {
    if (!domains || !domains.items || !multiSigConfig) {
      return;
    }

    const domainsExcludingRoot = domains.items.filter(
      (domain): domain is NonNullable<typeof domain> =>
        domain !== null && !domain.isRoot,
    );

    const tempDomainThresholdConfigs = domainsExcludingRoot.map((domain) => {
      const { colonyThreshold } = multiSigConfig;
      const existingThreshold = multiSigConfig.domainThresholds?.find(
        (item) => {
          return Number(item?.domainId) === domain.nativeId;
        },
      )?.domainThreshold;
      let type = MultiSigThresholdType.INHERIT_FROM_COLONY;

      if (existingThreshold != null && existingThreshold !== colonyThreshold) {
        if (existingThreshold === 0) {
          type = MultiSigThresholdType.MAJORITY_APPROVAL;
        } else {
          type = MultiSigThresholdType.FIXED_THRESHOLD;
        }
      }

      const name = domain.metadata?.name || '';
      setValue(name, existingThreshold || colonyThreshold || 0);

      return {
        id: domain.id,
        nativeSkillId: Number(domain.nativeSkillId),
        type,
        name,
      };
    });

    setDomainThresholdConfigs(tempDomainThresholdConfigs);
  }, [domains, multiSigConfig, setValue]);

  useImperativeHandle(callback, () => ({
    getValues: async () => {
      await trigger(undefined, { shouldFocus: true });
      if (!isValid) throw new Error('Error within form');

      const values = getValues();

      const domainThresholds = domainThresholdConfigs.map((domain) => {
        let threshold = 0;

        if (
          domain.type === MultiSigThresholdType.INHERIT_FROM_COLONY &&
          thresholdType === MultiSigThresholdType.FIXED_THRESHOLD
        ) {
          threshold = Number(values.globalThreshold);
        }

        if (domain.type === MultiSigThresholdType.FIXED_THRESHOLD) {
          threshold = Number(values[domain.name]);
        }
        return {
          skillId: domain.nativeSkillId,
          threshold,
        };
      });

      return {
        colonyAddress,
        globalThreshold:
          thresholdType === MultiSigThresholdType.MAJORITY_APPROVAL
            ? 0
            : values.globalThreshold,
        domainThresholds,
      };
    },
  }));

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
    domainThresholdConfigs: domainThresholdConfigs.map((config) => ({
      ...config,
      isError: !!errors[config.name],
    })),
    register,
    handleThresholdValueChange,
    handleGlobalThresholdTypeChange,
    handleDomainThresholdTypeChange,
  };
};
