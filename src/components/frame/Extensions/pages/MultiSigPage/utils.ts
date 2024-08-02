import {
  type DomainThresholdConfig,
  type MultiSigSetupFormValues,
  MultiSigThresholdType,
} from './types.ts';

export const getThresholdType = (value?: number) =>
  value && value > 0
    ? MultiSigThresholdType.FIXED_THRESHOLD
    : MultiSigThresholdType.MAJORITY_APPROVAL;

export const getInitialGlobalThreshold = (multiSigConfig) =>
  (multiSigConfig ? multiSigConfig.colonyThreshold : 0) || '';

export const getInitialDomainConfig = (domain, multiSigConfig) => {
  const { colonyThreshold } = multiSigConfig;

  const existingThreshold = multiSigConfig.domainThresholds?.find((item) => {
    return Number(item?.domainId) === domain.nativeId;
  })?.domainThreshold;
  let type = MultiSigThresholdType.INHERIT_FROM_COLONY;

  if (existingThreshold != null && existingThreshold !== colonyThreshold) {
    type = getThresholdType(existingThreshold);
  }

  const name = domain.metadata?.name || '';

  return {
    id: domain.id,
    nativeSkillId: Number(domain.nativeSkillId),
    type,
    name,
    threshold: existingThreshold || colonyThreshold || 0,
  };
};

export const getDomainThresholds = (
  values: MultiSigSetupFormValues,
  domainThresholdConfigs: DomainThresholdConfig[],
  thresholdType: MultiSigThresholdType,
) =>
  domainThresholdConfigs.map((domain) => {
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
