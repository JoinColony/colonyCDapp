import { ActionTypes } from '~redux';
import { ExtensionInitParams } from '~types';

export const createExtensionInitialValues = (
  initializationParams: ExtensionInitParams[],
) => {
  return initializationParams.reduce((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const getButtonAction = (
  actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS',
  extensionId: string,
) => {
  const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;
  let actionBeginning: string;

  switch (extensionId) {
    default:
      actionBeginning = 'EXTENSION';
  }

  return ActionTypes[`${actionBeginning}_ENABLE${actionEnd}`];
};
