import { type ActionFormProps } from '~shared/Fields/Form/index.ts';

export interface ActionSidebarContentProps {
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
}
