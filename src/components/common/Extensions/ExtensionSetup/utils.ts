import * as yup from 'yup';

import { ExtensionInitParam } from '~types';

export const createExtensionSetupInitialValues = (
  initializationParams: ExtensionInitParam[],
) => {
  return initializationParams.reduce((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const createExtensionSetupValidationSchema = (
  initializationParams: ExtensionInitParam[],
) => {
  const validationFields = initializationParams.reduce((fields, param) => {
    return {
      ...fields,
      [param.paramName]: param.validation,
    };
  }, {});
  return yup.object().shape(validationFields);
};
