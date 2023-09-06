import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Colony } from '~types';

import { ExpenditureFormType } from '../types';
import ExpenditurePayoutsField from './ExpenditurePayoutsField';
import ExpenditureStagesField from './ExpenditureStagesField';

interface ExpenditureFormFieldsProps {
  colony: Colony;
}

const ExpenditureFormFields = ({ colony }: ExpenditureFormFieldsProps) => {
  const { watch } = useFormContext();

  const formType: ExpenditureFormType = watch('formType');

  return (
    <div>
      <ExpenditurePayoutsField
        colony={colony}
        singlePayout={formType === ExpenditureFormType.Staged}
      />

      {formType === ExpenditureFormType.Staged && (
        <ExpenditureStagesField colony={colony} />
      )}
    </div>
  );
};

export default ExpenditureFormFields;
