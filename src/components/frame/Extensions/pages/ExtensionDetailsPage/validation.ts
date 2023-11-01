import { Extension } from '@colony/colony-js';
import { object, string } from 'yup';
import { createExtensionSetupValidationSchema } from '~common/Extensions/ExtensionSetup/utils';
import { formatText } from '~utils/intl';
import { GovernanceOptions } from '../ExtensionsPage/types';

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
