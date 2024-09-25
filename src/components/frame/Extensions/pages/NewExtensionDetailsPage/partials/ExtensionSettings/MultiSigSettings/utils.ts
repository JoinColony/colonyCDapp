import { type Domain } from '~types/graphql.ts';

import {
  type DomainThresholdConfig,
  MultiSigThresholdType,
  type MultiSigParams,
  type MultiSigSettingsFormValues,
} from './types.ts';

export const getGlobalThresholdType = (globalThreshold: number) => {
  return globalThreshold === 0
    ? MultiSigThresholdType.MAJORITY_APPROVAL
    : MultiSigThresholdType.FIXED_THRESHOLD;
};

export const getDomainThresholdType = (
  globalThreshold: number,
  domainThreshold: number | undefined,
) => {
  if (domainThreshold === undefined || globalThreshold === domainThreshold) {
    return MultiSigThresholdType.INHERIT_FROM_COLONY;
  }

  return domainThreshold === 0
    ? MultiSigThresholdType.MAJORITY_APPROVAL
    : MultiSigThresholdType.FIXED_THRESHOLD;
};

export const getInitialDomainConfig = (
  domain: Domain,
  params: MultiSigParams,
): DomainThresholdConfig => {
  const { colonyThreshold } = params;

  const existingThreshold = params.domainThresholds?.find((item) => {
    return Number(item?.domainId) === domain.nativeId;
  })?.domainThreshold;

  const type = getDomainThresholdType(colonyThreshold, existingThreshold);

  const domainName = domain.metadata?.name || '';

  return {
    id: domain.id,
    type,
    domainName,
    threshold: existingThreshold || colonyThreshold || 0,
    domainSkillId: domain.nativeSkillId,
  };
};

export const getDomainThresholds = (values: MultiSigSettingsFormValues) => {
  if (!values.domainThresholds) return [];

  return Object.values(values.domainThresholds).map((config) => {
    // Default to 0 if domain threshold type is MultiSigThresholdType.MAJORITY_APPROVAL
    let threshold = 0;

    if (
      config.type === MultiSigThresholdType.INHERIT_FROM_COLONY &&
      values.thresholdType === MultiSigThresholdType.FIXED_THRESHOLD
    ) {
      threshold = Number(values.globalThreshold);
    }

    if (config.type === MultiSigThresholdType.FIXED_THRESHOLD) {
      threshold = config.threshold;
    }
    return {
      skillId: config.domainSkillId,
      threshold,
    };
  });
};
