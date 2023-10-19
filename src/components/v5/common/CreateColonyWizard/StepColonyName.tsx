import React from 'react';
import { useIntl } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';
import { useAppContext } from '~hooks';

import { ButtonRow } from './shared';
import { splitWalletAddress } from '~utils/splitWalletAddress';

import {
  FormValues,
  Step1,
  colonyNameValidationSchema as validationSchema,
} from '../CreateColonyWizard';

import NameInputs from './StepColonyNameInputs';

const displayName = 'common.CreateColonyWizard.StepColonyName';

type Props = Pick<
  WizardStepProps<FormValues, Step1>,
  'wizardForm' | 'nextStep' | 'wizardValues'
>;

const StepColonyName = ({
  wizardForm: { initialValues: defaultValues },
  nextStep,
}: Props) => {
  const { user } = useAppContext();
  const { formatMessage } = useIntl();

  const username =
    user?.profile?.displayName ?? splitWalletAddress(user?.walletAddress ?? '');

  return (
    <Form<Step1>
      onSubmit={nextStep}
      validationSchema={validationSchema}
      defaultValues={defaultValues}
    >
      {() => (
        <section className="">
          <div className="pb-4 border-b border-gray300">
            <h3 className="heading-3">
              {formatMessage(
                { id: 'createColonyWizard.step.colonyName.heading' },
                { username },
              )}
            </h3>
            <p className="text-sm text-gray-400">
              {formatMessage({
                id: 'createColonyWizard.step.colonyName.description',
              })}
            </p>
          </div>
          <NameInputs />
          <ButtonRow />
        </section>
      )}
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
