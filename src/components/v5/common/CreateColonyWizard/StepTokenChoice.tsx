import React, { ReactNode } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

import { UseFormRegister, FieldValues, useFormContext } from 'react-hook-form';
import Icon from '~shared/Icon';
import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';

import { FormValues, Step2 } from '../CreateColonyWizard';
import { ButtonRow, HeaderRow } from './shared';

import Card from '~v5/shared/Card';
import { formatText } from '~utils/intl';

const displayName = 'common.CreateColonyWizard.StepTokenChoice';

type Props = Pick<
  WizardStepProps<FormValues, Step2>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues' | 'previousStep'
>;

interface TokenSelectorProps {
  name: string;
  icon: ReactNode;
  title: MessageDescriptor | string;
  description: MessageDescriptor | string;
  register?: UseFormRegister<FieldValues>;
}

export const MSG = defineMessages({
  heading: {
    id: 'createColonyWizard.step.selectToken.heading',
    defaultMessage: 'Creating a new native token or use existing?',
  },
  description: {
    id: 'createColonyWizard.step.selectToken.description',
    defaultMessage:
      'We highly recommend creating a new token, you will have greater control of your token going forward, support all features of Colony, and potential save a lot of cost if on another chain.',
  },
  createOptionTitle: {
    id: 'createColonyWizard.step.selectToken.createOptionTitle',
    defaultMessage: 'Create a new token',
  },
  createOptionDescription: {
    id: 'createColonyWizard.step.selectToken.createOptionDescription',
    defaultMessage:
      'Quickest, easiest, and best option for greater control over your token using your Colony.',
  },
  selectOptionTitle: {
    id: 'createColonyWizard.step.selectToken.selectOptionTitle',
    defaultMessage: 'Use an existing token',
  },
  selectOptionDescription: {
    id: 'createColonyWizard.step.selectToken.selectOptionDescription',
    defaultMessage:
      'Suitable for public tokens. Requires token to be on the same blockchain as the Colony.',
  },
});

const TokenSelector = ({
  name,
  icon,
  title,
  description,
}: TokenSelectorProps) => {
  const { register } = useFormContext();

  const registerField = register && register('tokenChoice');

  return (
    <label htmlFor={name}>
      <Card className="flex flex-col items-center cursor-pointer text-center h-full">
        <input
          {...registerField}
          type="radio"
          value={name}
          id={name}
          className="mb-4"
        />
        {icon}
        <span className="text-1 pt-4">{formatText(title)}</span>
        <span className="description-1">{formatText(description)}</span>
      </Card>
    </label>
  );
};

const StepTokenChoice = ({
  wizardForm: { initialValues: defaultValues },
  wizardValues: { tokenChoiceVerify },
  previousStep,
  nextStep,
}: Props) => {
  return (
    <Form<Step2>
      onSubmit={nextStep}
      defaultValues={{
        tokenChoice: tokenChoiceVerify || defaultValues.tokenChoice,
      }}
    >
      <HeaderRow heading={MSG.heading} description={MSG.description} />
      <div className="flex gap-6">
        <TokenSelector
          name="create"
          title={MSG.createOptionTitle}
          description={MSG.createOptionDescription}
          icon={
            <Icon
              style={{ transform: 'rotate(90deg)' }}
              name="coin-vertical"
              appearance={{ size: 'medium' }}
            />
          }
        />
        <TokenSelector
          name="select"
          title={MSG.selectOptionTitle}
          description={MSG.selectOptionDescription}
          icon={<Icon name="hand-coins" appearance={{ size: 'medium' }} />}
        />
      </div>
      <ButtonRow previousStep={previousStep} />
    </Form>
  );
};

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
