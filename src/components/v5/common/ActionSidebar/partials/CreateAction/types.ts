import { type ActionFormProps } from '~shared/Fields/Form/index.ts';

export interface CreateActionProps {
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
}
