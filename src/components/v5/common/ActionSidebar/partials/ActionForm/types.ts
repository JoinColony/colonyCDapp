import * as yup from 'yup';
import { ActionTypes } from '~redux';
import { ActionTransformFnType } from '~utils/actions';

export type ActionFormProps = {
  useActionHook: () => void;
};

export type ActionHookOptionsProps = {
  validationSchema: yup.ObjectSchema;
  defaultValues: Record<string, any>;
  actionType: ActionTypes;
  defaultAction?: ActionTypes;
  transform?: ActionTransformFnType;
};
