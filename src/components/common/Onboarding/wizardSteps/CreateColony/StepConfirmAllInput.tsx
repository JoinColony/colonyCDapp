import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';
import { mergePayload, pipe, withMeta } from '~utils/actions.ts';

import ButtonRow from '../ButtonRow.tsx';
import HeaderRow from '../HeaderRow.tsx';

import CardRow from './CreateColonyCardRow.tsx';
import { type FormValues, TokenChoice } from './types.ts';

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
  const navigate = useNavigate();

  const updatedWizardValues = {
    ...wizardValues,
    tokenAvatar: tokenChoice === TokenChoice.Create ? tokenAvatar : undefined,
    tokenThumbnail:
      tokenChoice === TokenChoice.Create ? tokenThumbnail : undefined,
    token: tokenChoice === TokenChoice.Create ? null : token,
    tokenAddress: tokenChoice === TokenChoice.Create ? '' : tokenAddress,
    /**
     * Use tokenName/tokenSymbol if creating a new token,
     * or get the values from token object if using an existing one
     */
    tokenName: tokenName || token?.name,
    tokenSymbol: tokenSymbol?.toUpperCase() || token?.symbol,
    inviteCode,
  };

  const transform = pipe(
    mergePayload(updatedWizardValues),
    withMeta({ navigate }),
  );

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
