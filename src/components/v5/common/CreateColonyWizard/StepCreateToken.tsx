import React from 'react';
import { defineMessages } from 'react-intl';

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

const displayName = `common.CreateColonyWizard.StepCreateToken`;

export const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Your Colony’s native token',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Your native token is your organization’s unit of ownership, and powers key features within your Colony.{br}{br}Tokens are initially locked and not transferable by recipients. You must unlock your token if you wish it to become tradable.',
  },
});

type Props = Pick<
  WizardStepProps<FormValues, Step3>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues' | 'previousStep'
>;

const StepCreateToken = ({
  nextStep,
  wizardForm: { initialValues: defaultValues },
  wizardValues: {
    tokenChoice,
    tokenName,
    tokenSymbol,
    tokenAddress,
    tokenChoiceVerify,
  },
  previousStep,
}: Props) => {
  return (
    <Form<Step3>
      onSubmit={nextStep}
      validationSchema={validationSchema}
      defaultValues={{
        ...defaultValues,
        tokenChoiceVerify: tokenChoiceVerify || tokenChoice,
      }}
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
