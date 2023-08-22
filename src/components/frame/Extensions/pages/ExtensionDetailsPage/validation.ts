import { object, string } from 'yup';
import { createExtensionSetupValidationSchema } from '~common/Extensions/ExtensionSetup/utils';
import { formatText } from '~utils/intl';
import { GovernanceOptions } from '../ExtensionsPage/types';

export const getValidationSchema = ({ initializationParams }) => {
  const paramsSchema =
    createExtensionSetupValidationSchema(initializationParams);

  return object({
    option: string()
      .required(formatText({ id: 'validation.required' }))
      .oneOf(Object.values(GovernanceOptions)),
    params: paramsSchema,
  }).defined();
};
