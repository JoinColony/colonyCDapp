import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Colony } from '~types';

import { ExpenditureFormType } from '../types';
import StagedPaymentsFormFields from './StagedPaymentFormFields';
import AdvancedPaymentsFormFields from './AdvancedPaymentsFormFields';

interface ExpenditureFormFieldsProps {
  colony: Colony;
}

const ExpenditureFormFields = ({ colony }: ExpenditureFormFieldsProps) => {
  const { watch } = useFormContext();

  const formType: ExpenditureFormType = watch('formType');

  switch (formType) {
    case ExpenditureFormType.Advanced:
      return <AdvancedPaymentsFormFields colony={colony} />;
    case ExpenditureFormType.Staged:
      return <StagedPaymentsFormFields colony={colony} />;
    default:
      return null;
  }
};

export default ExpenditureFormFields;
