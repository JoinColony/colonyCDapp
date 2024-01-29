import { Extension } from '@colony/colony-js';
import { object, string } from 'yup';

import { ExtensionInitParam } from '~types/extensions';
import { formatText } from '~utils/intl';

import { GovernanceOptions } from '../ExtensionsPage/types';

export const createExtensionSetupValidationSchema = (
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

export const getValidationSchema = ({ initializationParams }) => {
  const paramsSchema =
    createExtensionSetupValidationSchema(initializationParams);

  return object({
    type: string().oneOf(Object.values(Extension)).required(),
    option: string()
      .when('type', {
        is: Extension.VotingReputation,
        then: string()
          .required(formatText({ id: 'validation.required' }))
          .oneOf(Object.values(GovernanceOptions)),
        otherwise: string().notRequired(),
      })
      .defined(),
    params: paramsSchema,
  }).defined();
};
