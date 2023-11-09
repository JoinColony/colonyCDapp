import React, { useEffect } from 'react';

import { defineMessages } from 'react-intl';
import { WizardStepProps } from '~shared/Wizard';
import { ActionForm } from '~shared/Fields';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { useAppContext } from '~hooks';
import { useColonyCreationFlowContext } from '~routes/WizardRoute/WizardLayout';

import { FormValues, WizardProps } from '../CreateColonyWizard';
import { ButtonRow, HeaderRow } from './shared';
import CardRow from './CreateColonyCardRow';

const displayName = 'common.CreateColonyWizard.StepConfirmAllInput';

type Props = Pick<
  WizardStepProps<FormValues, WizardProps>,
  'nextStep' | 'wizardValues' | 'previousStep' | 'setStep' | 'wizardProps'
>;

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Confirm your Colony’s details',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Check to ensure your Colony’s details are correct as they can not be changed later.',
  },
});

const StepConfirmAllInput = ({
  nextStep,
  wizardValues,
  previousStep,
  setStep,
  wizardProps,
}: Props) => {
  const { user } = useAppContext();
  const { setCurrentStep } = useColonyCreationFlowContext();

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const updatedWizardValues = {
    ...wizardValues,
    tokenAvatar:
      wizardValues.tokenChoiceVerify === 'create'
        ? wizardValues.tokenAvatar
        : undefined,
    tokenThumbnail:
      wizardValues.tokenChoiceVerify === 'create'
        ? wizardValues.tokenThumbnail
        : undefined,
    token:
      wizardValues.tokenChoiceVerify === 'create' ? null : wizardValues.token,
    tokenChoice: wizardValues.tokenChoiceVerify,
    tokenAddress:
      wizardValues.tokenChoiceVerify === 'create'
        ? ''
        : wizardValues.tokenAddress,
    /**
     * Use tokenName/tokenSymbol if creating a new token,
     * or get the values from token object if using an existing one
     */
    tokenName: wizardValues.tokenName || wizardValues.token?.name,
    tokenSymbol:
      wizardValues.tokenSymbol?.toUpperCase() || wizardValues.token?.symbol,
    inviteCode: wizardProps.inviteCode,
    userId: user?.walletAddress || '',
  };

  const transform = mergePayload(updatedWizardValues);

  return (
    <ActionForm
      defaultValues={{}}
      actionType={ActionTypes.CREATE}
      transform={transform}
      onSuccess={() => nextStep(wizardValues)}
    >
      <HeaderRow
        heading={MSG.heading}
        description={MSG.description}
        descriptionValues={{ br: <br /> }}
      />
      <CardRow updatedWizardValues={updatedWizardValues} setStep={setStep} />
      <ButtonRow previousStep={previousStep} />
    </ActionForm>
  );
};

StepConfirmAllInput.displayName = displayName;

export default StepConfirmAllInput;
