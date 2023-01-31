import { Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { object } from 'yup';

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
  return object().shape(validationFields);
};

export const mapExtensionActionPayload = (
  extensionId: Extension,
  payload: any,
  initializationParams?: ExtensionInitParam[],
) => {
  if (extensionId === Extension.VotingReputation) {
    return initializationParams?.reduce((formattedPayload, { paramName }) => {
      if (paramName.endsWith('Period')) {
        return {
          ...formattedPayload,
          [paramName]: new Decimal(payload[paramName])
            .mul(3600)
            .toFixed(0, Decimal.ROUND_HALF_UP),
        };
      }
      return {
        ...formattedPayload,
        [paramName]: new Decimal(payload[paramName])
          .mul(new Decimal(10).pow(16))
          .toString(),
      };
    }, {});
  }

  return payload;
};
