import React from 'react';

import { WizardStepProps } from '~shared/Wizard';
import { ActionForm } from '~shared/Fields';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';

import { FormValues, WizardProps } from '../CreateColonyWizard';
import { ButtonRow, HeaderRow } from './shared';
import CardRow from './CreateColonyCardRow';

const displayName = 'common.CreateColonyWizard.StepConfirmAllInput';

type Props = Pick<
  WizardStepProps<FormValues, WizardProps>,
  'nextStep' | 'wizardValues' | 'previousStep' | 'setStep' | 'wizardProps'
>;

const StepConfirmAllInput = ({
  nextStep,
  wizardValues,
  previousStep,
  setStep,
  wizardProps,
}: Props) => {
  const updatedWizardValues = {
    ...wizardValues,
    /**
     * Use tokenName/tokenSymbol if creating a new token,
     * or get the values from token object if using an existing one
     */
    tokenName: wizardValues.tokenName || wizardValues.token?.name,
    tokenSymbol:
      wizardValues.tokenSymbol?.toUpperCase() || wizardValues.token?.symbol,
    inviteCode: wizardProps.inviteCode,
  };

  const transform = mergePayload(updatedWizardValues);

  return (
    <ActionForm
      defaultValues={{}}
      actionType={ActionTypes.CREATE}
      transform={transform}
      onSuccess={() => nextStep(wizardValues)}
    >
      <section className="">
        <HeaderRow
          heading={{ id: 'createColonyWizard.step.confirm.heading' }}
          description={{
            id: 'createColonyWizard.step.confirm.description',
          }}
          descriptionValues={{ br: <br /> }}
        />
        <CardRow updatedWizardValues={updatedWizardValues} setStep={setStep} />
        <ButtonRow previousStep={previousStep} />
      </section>
    </ActionForm>
  );
};

StepConfirmAllInput.displayName = displayName;

export default StepConfirmAllInput;
