import { object, number, string, type InferType } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  CHAIN_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
  ManageEntityOperation,
} from '~v5/common/ActionSidebar/consts.ts';
import { type CardSelectOption } from '~v5/common/Fields/CardSelect/types.ts';

export const getManageSupportedChainsOptions = (): {
  manageSupportedChainsOptions: CardSelectOption<any>[];
} => {
  return {
    manageSupportedChainsOptions: [
      {
        label: formatText({ id: 'actionSidebar.option.addSupportedChain' }),
        value: ManageEntityOperation.Add,
      },
      {
        label: formatText({ id: 'actionSidebar.option.removeSupportedChain' }),
        value: ManageEntityOperation.Remove,
      },
    ],
  };
};

export const validationSchema = object()
  .shape({
    [CREATED_IN_FIELD_NAME]: number().defined(),
    [DECISION_METHOD_FIELD_NAME]: string().defined(),
    [DESCRIPTION_FIELD_NAME]: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    [CHAIN_FIELD_NAME]: string().required(
      formatText({ id: 'errors.chain.required' }),
    ),
    [MANAGE_SUPPORTED_CHAINS_FIELD_NAME]: string()
      .oneOf(Object.values(ManageEntityOperation))
      .required(formatText({ id: 'errors.manageSupportedChain.required' })),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageSupportedChainsFormValues = InferType<
  typeof validationSchema
>;
