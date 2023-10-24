import React from 'react';

import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';

import {
  FormValues,
  Step3,
  tokenValidationSchema as validationSchema,
} from '../CreateColonyWizard';
import { ButtonRow, HeaderRow } from './shared';
import TokenInputs from './StepCreateTokenInputs';
import { TokenChoiceOptions } from './StepCreateTokenComponents';
import ExistingInput from './StepExistingTokenInputs';

const displayName = `common.CreateColonyWizard.StepCreateToken`;

type Props = Pick<
  WizardStepProps<FormValues, Step3>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues' | 'previousStep'
>;

const StepCreateToken = ({
  nextStep,
  wizardForm: { initialValues: defaultValues },
  wizardValues: { tokenChoice, tokenName, tokenSymbol, tokenAddress },
  previousStep,
}: Props) => {
  const handleSubmit = (values: Step3) => {
    nextStep({ ...values, tokenAddress: '' });
  };

  return (
    <Form<Step3>
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      defaultValues={{ ...defaultValues, tokenChoice }}
    >
      {({ getValues }) => {
        const currentTokenChoice = getValues('tokenChoice');

        return (
          <>
            <HeaderRow
              heading={{ id: 'createColonyWizard.step.nativeToken.heading' }}
              description={{
                id: 'createColonyWizard.step.nativeToken.description',
              }}
              descriptionValues={{ br: <br /> }}
            />
            <TokenChoiceOptions tokenChoiceOptions={['create', 'select']} />
            {currentTokenChoice === 'create' ? (
              <TokenInputs
                wizardTokenName={tokenName || ''}
                wizardTokenSymbol={tokenSymbol || ''}
              />
            ) : (
              <ExistingInput wizardTokenAddress={tokenAddress} />
            )}
            <ButtonRow previousStep={previousStep} />
          </>
        );
      }}
    </Form>
  );
};

StepCreateToken.displayName = displayName;

export default StepCreateToken;
