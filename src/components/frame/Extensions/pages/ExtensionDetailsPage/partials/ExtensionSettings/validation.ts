import { Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { array, number, object, string } from 'yup';

import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import {
  type AnyExtensionData,
  type ExtensionInitParam,
} from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { MultiSigThresholdType } from './MultiSigSettings/types.ts';

const createInitializationParamsValidationSchema = (
  initializationParams: ExtensionInitParam[],
) => {
  const validationFields = initializationParams.reduce((fields, param) => {
    return {
      ...fields,
      [param.paramName]: param.validation,
    };
  }, {});
  return object().shape(validationFields).defined();
};

const msgPrefix = 'pages.ExtensionPage.ExtensionSettings';

const MSG = defineMessages({
  thresholdMinError: {
    id: `${msgPrefix}.thresholdMinError`,
    defaultMessage: 'Threshold must be at least 1',
  },
  thresholdMaxError: {
    id: `${msgPrefix}.thresholdMaxError`,
    defaultMessage: 'Threshold must be less than or equal to 99999',
  },
});

export const getValidationSchema = (extensionData: AnyExtensionData) => {
  const paramsSchema = createInitializationParamsValidationSchema(
    extensionData.initializationParams ?? [],
  );

  switch (extensionData.extensionId) {
    case Extension.VotingReputation: {
      return object({
        option: string()
          .required(formatText({ id: 'validation.required' }))
          .oneOf(Object.values(GovernanceOptions)),
      })
        .concat(paramsSchema)
        .defined();
    }
    case Extension.MultisigPermissions: {
      return object({
        thresholdType: string().required(
          formatText({ id: 'validation.required' }),
        ),
        globalThreshold: number().when('thresholdType', {
          is: MultiSigThresholdType.FIXED_THRESHOLD,
          then: number()
            .typeError(formatText({ id: 'validation.required' }))
            .min(1, formatText(MSG.thresholdMinError))
            .max(99999, formatText(MSG.thresholdMaxError)),
        }),
        domainThresholds: array().of(
          object().shape({
            type: string().required(formatText({ id: 'validation.required' })),
            threshold: number().when('type', {
              is: MultiSigThresholdType.FIXED_THRESHOLD,
              then: number()
                .typeError(formatText({ id: 'validation.required' }))
                .min(1, formatText(MSG.thresholdMinError))
                .max(99999, formatText(MSG.thresholdMaxError)),
            }),
          }),
        ),
      }).defined();
    }
    default: {
      return paramsSchema.defined();
    }
  }
};
