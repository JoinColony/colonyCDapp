import React from 'react';

import { defineMessages } from 'react-intl';
import { WizardStepProps } from '~shared/Wizard';
import { ActionForm } from '~shared/Fields';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';

import { ButtonRow, HeaderRow } from '../shared';

import { FormValues } from './CreateColonyWizard';
import CardRow from './CreateColonyCardRow';

const displayName = 'common.CreateColonyWizard.StepConfirmAllInput';

type Props = Pick<
  WizardStepProps<FormValues>,
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
  previousStep,
  setStep,
  wizardValues,
  wizardValues: {
    tokenChoice,
    tokenAvatar,
    tokenThumbnail,
    token,
    tokenAddress,
    tokenName,
    tokenSymbol,
  },
  wizardProps: { inviteCode },
}: Props) => {
  const updatedWizardValues = {
    ...wizardValues,
    tokenAvatar: tokenChoice === 'create' ? tokenAvatar : undefined,
    tokenThumbnail: tokenChoice === 'create' ? tokenThumbnail : undefined,
    token: tokenChoice === 'create' ? null : token,
    tokenAddress: tokenChoice === 'create' ? '' : tokenAddress,
    /**
     * Use tokenName/tokenSymbol if creating a new token,
     * or get the values from token object if using an existing one
     */
    tokenName: tokenName || token?.name,
    tokenSymbol: tokenSymbol?.toUpperCase() || token?.symbol,
    inviteCode,
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
