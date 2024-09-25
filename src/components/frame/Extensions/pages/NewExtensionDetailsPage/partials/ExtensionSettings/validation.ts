import { Extension } from '@colony/colony-js';
import { object, string } from 'yup';

import { GovernanceOptions } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import {
  type AnyExtensionData,
  type ExtensionInitParam,
} from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';

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
    default: {
      return paramsSchema.defined();
    }
  }
};
