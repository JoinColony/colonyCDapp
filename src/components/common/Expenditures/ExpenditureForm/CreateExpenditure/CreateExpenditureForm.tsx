import React from 'react';
import { FieldValues } from 'react-hook-form';

import { ActionForm } from '~shared/Fields';

import ExpenditureDomainSelector from '../ExpenditureDomainSelector/ExpenditureDomainSelector';
import { useColonyContext } from '~hooks';
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
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <ActionForm<T> {...actionFormProps}>
      {(formProps) => (
        <>
          <ExpenditureDomainSelector colony={colony} />
          {typeof children === 'function' ? children(formProps) : children}
        </>
      )}
    </ActionForm>
  );
};

export default CreateExpenditureForm;
