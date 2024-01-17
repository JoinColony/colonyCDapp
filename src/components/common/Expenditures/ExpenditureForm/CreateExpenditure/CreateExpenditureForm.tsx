import React from 'react';
import { FieldValues } from 'react-hook-form';

import { ActionForm } from '~shared/Fields';
import { ActionFormProps } from '~shared/Fields/Form';

import { ExpenditureFormValues } from '../types';

type CreateExpenditureFormProps<T extends FieldValues> = Pick<
  ActionFormProps<T>,
  'defaultValues' | 'actionType' | 'transform' | 'children'
>;

const CreateExpenditureForm = <T extends ExpenditureFormValues>({
  children,
  ...actionFormProps
}: CreateExpenditureFormProps<T>) => {
  return (
    <ActionForm<T> {...actionFormProps}>
      {(formProps) => (
        <>{typeof children === 'function' ? children(formProps) : children}</>
      )}
    </ActionForm>
  );
};

export default CreateExpenditureForm;
