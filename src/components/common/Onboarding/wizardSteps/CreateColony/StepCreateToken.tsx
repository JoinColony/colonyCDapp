import React from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';

import ButtonRow from '../ButtonRow.tsx';
import HeaderRow from '../HeaderRow.tsx';

import { TokenChoiceOptions } from './StepCreateTokenComponents.tsx';
import TokenInputs from './StepCreateTokenInputs.tsx';
import TokenSelectorInput from './TokenSelectorInput.tsx';
import { type FormValues, type Step3, TokenChoice } from './types.ts';
import { tokenValidationSchema as validationSchema } from './validation.ts';

const displayName = `common.CreateColonyWizard.StepCreateToken`;

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: `Your Colony's native token`,
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `Your native token is your organization's unit of ownership, and powers key features within your Colony.{br}{br}Tokens are initially locked and not transferable by recipients. You must unlock your token if you wish it to become tradable.`,
  },
});

type Props = Pick<
  WizardStepProps<FormValues, Step3>,
  'nextStep' | 'wizardValues' | 'setStepsValues' | 'previousStep'
>;

const StepCreateToken = ({
  nextStep,
  wizardValues: {
    tokenChoice,
    tokenName,
    tokenSymbol,
    tokenAddress,
    tokenAvatar,
  },
  previousStep,
}: Props) => (
  <Form<Step3>
    onSubmit={nextStep}
    validationSchema={validationSchema}
    defaultValues={{ tokenChoice }}
  >
    {({ watch }) => {
      const currentTokenChoice = watch('tokenChoice');

      return (
        <>
          <HeaderRow
            heading={MSG.heading}
            description={MSG.description}
            descriptionValues={{ br: <br /> }}
          />
          <TokenChoiceOptions
            tokenChoiceOptions={[TokenChoice.Create, TokenChoice.Select]}
          />
          {currentTokenChoice === TokenChoice.Create ? (
            <TokenInputs
              wizardTokenName={tokenName || ''}
              wizardTokenSymbol={tokenSymbol || ''}
              wizardTokenAvatar={tokenAvatar || ''}
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

StepCreateToken.displayName = displayName;

export default StepCreateToken;
