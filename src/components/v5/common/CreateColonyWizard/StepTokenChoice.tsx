import React, { ReactNode } from 'react';

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
  title: string;
  description: string;
  register?: UseFormRegister<FieldValues>;
}

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
        <span className="text-1 pt-4">{formatText({ id: title })}</span>
        <span className="description-1">{formatText({ id: description })}</span>
      </Card>
    </label>
  );
};

const StepTokenChoice = ({
  wizardForm: { initialValues: defaultValues },
  previousStep,
  nextStep,
}: Props) => {
  return (
    <Form<Step2> onSubmit={nextStep} defaultValues={defaultValues}>
      <HeaderRow
        heading={{ id: 'createColonyWizard.step.selectToken.heading' }}
        description={{
          id: 'createColonyWizard.step.selectToken.description',
        }}
      />
      <div className="flex gap-6">
        <TokenSelector
          name="create"
          title="createColonyWizard.step.selectToken.createOptionTitle"
          description="createColonyWizard.step.selectToken.createOptionDescription"
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
          title="createColonyWizard.step.selectToken.selectOptionTitle"
          description="createColonyWizard.step.selectToken.selectOptionDescription"
          icon={<Icon name="hand-coins" appearance={{ size: 'medium' }} />}
        />
      </div>
      <ButtonRow previousStep={previousStep} />
    </Form>
  );
};

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
