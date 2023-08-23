import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { ActionTypes } from '~redux';
import { ActionTransformFnType } from '~utils/actions';

export type ActionFormProps = {
  useActionHook: () => {
    methods: UseFormReturn<Record<string, any>, any, undefined>;
    onSubmit: (values) => Promise<any>;
  };
};

export type ActionHookOptionsProps = {
  validationSchema: yup.ObjectSchema;
  defaultValues: Record<string, any>;
  actionType: ActionTypes;
  defaultAction?: ActionTypes;
  transform?: ActionTransformFnType;
};
