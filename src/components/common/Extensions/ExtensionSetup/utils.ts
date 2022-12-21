import * as yup from 'yup';

import { ExtensionInitParams } from '~types';

export const createExtensionSetupInitialValues = (
  initializationParams: ExtensionInitParams[],
) => {
  return initializationParams.reduce((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const createExtensionSetupValidationSchema = (
  initializationParams: ExtensionInitParams[],
) => {
  const validationFields = initializationParams.reduce((fields, param) => {
    return {
      ...fields,
      [param.paramName]: param.validation,
    };
  }, {});
  return yup.object().shape(validationFields);
};
