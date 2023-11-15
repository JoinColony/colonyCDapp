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
import TokenSelectorInput from './TokenSelectorInput';
import { MSG } from './StepTokenChoice';

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
  return (
    <Form<Step3>
      onSubmit={nextStep}
      validationSchema={validationSchema}
      defaultValues={{ ...defaultValues, tokenChoiceVerify: tokenChoice }}
    >
      {({ watch }) => {
        const currentTokenChoice = watch('tokenChoiceVerify');

        return (
          <>
            <HeaderRow
              heading={MSG.heading}
              description={MSG.description}
              descriptionValues={{ br: <br /> }}
            />
            <TokenChoiceOptions tokenChoiceOptions={['create', 'select']} />
            {currentTokenChoice === 'create' ? (
              <TokenInputs
                wizardTokenName={tokenName || ''}
                wizardTokenSymbol={tokenSymbol || ''}
              />
            ) : (
              <TokenSelectorInput wizardTokenAddress={tokenAddress} />
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
