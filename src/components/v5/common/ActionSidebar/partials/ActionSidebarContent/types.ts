import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/index.ts';

export interface ActionSidebarContentProps {
  formRef: React.RefObject<UseFormReturn<object, any, undefined>>;
  defaultValues: ActionFormProps<any>['defaultValues'];
}
