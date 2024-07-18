import { useContext, useEffect, useState } from 'react';
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
    handleSetValues,
    handleIsDisabled,
    handleIsVisible,
    handleSetActionType,
    resetAll,
  } = useContext(ExtensionSaveSettingsContext);

  const [fixedThreshold, setFixedThreshold] = useState<number | string>(
    defaultFixedThreshold || '',
  );
  const [isFixedThresholdError, setIsFixedThresholdError] = useState(false);

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

    return () => resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const domainThresholds = domainThresholdConfigs.map((domain) => {
      let threshold = 0;

      if (
        domain.type === MultiSigThresholdType.INHERIT_FROM_COLONY &&
        thresholdType === MultiSigThresholdType.FIXED_THRESHOLD
      ) {
        threshold = parseInt(fixedThreshold.toString(), 10);
      }

      if (domain.type === MultiSigThresholdType.FIXED_THRESHOLD) {
        threshold = domain.threshold;
      }
      return {
        skillId: domain.nativeSkillId,
        threshold,
      };
    });

    handleSetValues({
      colonyAddress,
      globalThreshold:
        thresholdType === MultiSigThresholdType.MAJORITY_APPROVAL
          ? 0
          : fixedThreshold,
      domainThresholds,
    });

    let hasGlobalFixedThresholdError = false;
    if (thresholdType === MultiSigThresholdType.FIXED_THRESHOLD) {
      hasGlobalFixedThresholdError = isFixedThresholdError || !fixedThreshold;
    }
    const hasDomainSettingError = !!domainThresholdConfigs.find(
      (domain) => domain.isError,
    );

    handleIsDisabled(hasGlobalFixedThresholdError || hasDomainSettingError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    domainThresholdConfigs,
    thresholdType,
    isFixedThresholdError,
    fixedThreshold,
    handleIsDisabled,
  ]);

  useEffect(() => {
    if (!domains || !domains.items || !multiSigConfig) {
      return;
    }

    const domainsExcludingRoot = domains.items.filter(
      (domain): domain is NonNullable<typeof domain> =>
        domain !== null && !domain.isRoot,
    );

    setDomainThresholdConfigs(
      domainsExcludingRoot.map((domain) => {
        const { colonyThreshold } = multiSigConfig;
        const existingThreshold = multiSigConfig.domainThresholds?.find(
          (item) => {
            return Number(item?.domainId) === domain.nativeId;
          },
        )?.domainThreshold;
        let type = MultiSigThresholdType.INHERIT_FROM_COLONY;

        if (
          existingThreshold != null &&
          existingThreshold !== colonyThreshold
        ) {
          if (existingThreshold === 0) {
            type = MultiSigThresholdType.MAJORITY_APPROVAL;
          } else {
            type = MultiSigThresholdType.FIXED_THRESHOLD;
          }
        }

        return {
          id: domain.id,
          nativeSkillId: Number(domain.nativeSkillId),
          type,
          name: domain.metadata?.name || '',
          threshold: existingThreshold || colonyThreshold || 0,
          isError: false,
        };
      }),
    );
  }, [domains, multiSigConfig]);

  const resetFixedThresholdFields = () => {
    setFixedThreshold('');
    setIsFixedThresholdError(false);
  };

  const handleThresholdChange = (newThreshold: number) => {
    if (thresholdType === MultiSigThresholdType.FIXED_THRESHOLD) {
      setFixedThreshold(newThreshold);
      setIsFixedThresholdError(newThreshold === 0);
    }
  };

  const handleThresholdTypeChange = (
    newThresholdType: MultiSigThresholdType,
  ) => {
    setThresholdType(newThresholdType);
    if (newThresholdType === MultiSigThresholdType.MAJORITY_APPROVAL) {
      resetFixedThresholdFields();
    }
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

  const handleDomainThresholdChange = (id: string, newThreshold: number) => {
    setDomainThresholdConfigs((prevDomainSettings) =>
      prevDomainSettings.map((domain) =>
        domain.id === id
          ? { ...domain, threshold: newThreshold, isError: !newThreshold }
          : domain,
      ),
    );
  };

  return {
    thresholdType,
    fixedThreshold,
    isFixedThresholdError,
    domainThresholdConfigs,
    handleThresholdChange,
    handleThresholdTypeChange,
    handleDomainThresholdTypeChange,
    handleDomainThresholdChange,
  };
};
