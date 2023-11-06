import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import Avatar from '~v5/shared/Avatar';

import { FormValues, WizardProps } from '../CreateColonyWizard';

const displayName = 'common.CreateColonyWizard.CardRow';

interface CardRowProps {
  updatedWizardValues: FormValues;
  setStep: WizardStepProps<FormValues, WizardProps>['setStep'];
}

const MSG = defineMessages({
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native token',
  },
  blockchain: {
    id: `${displayName}.blockchain`,
    defaultMessage: 'Blockchain',
  },
});

const CardRow = ({ updatedWizardValues, setStep }: CardRowProps) => {
  const cards = [
    {
      title: 'colonyDetailsPage.title',
      text: updatedWizardValues.displayName,
      subText: `app.colony.io/${updatedWizardValues.colonyName}`,
      step: 0,
    },
    {
      title: MSG.nativeToken,
      text: updatedWizardValues.tokenName,
      subText: updatedWizardValues.tokenSymbol,
      step: 2,
      icon: (
        <Avatar
          avatar={updatedWizardValues.tokenAvatar}
          seed={
            updatedWizardValues.tokenAddress || updatedWizardValues.tokenSymbol
          }
          size="s"
        />
      ),
    },
    /* Not yet implemented
     * {
     *   title: { id: 'createColonyWizard.step.confirm.blockchain' },
     *   valueKey: 'blockChain',
     * }, */
  ];

  return (
    <div className="flex flex-col gap-6">
      {cards.map((card) => (
        <div className="flex flex-col gap-3.5" key={`option ${card.title}`}>
          <h5 className="text-2 lowercase first-letter:uppercase">
            {formatText(
              typeof card.title === 'string' ? { id: card.title } : card.title,
            )}
          </h5>
          <div className="border border-gray-200 rounded px-6 py-4 flex place-content-between">
            <div className="flex gap-5 items-center">
              {card.icon && card.icon}
              <div>
                <p className="text-1 pb-1">{card.text}</p>
                <p className="text-sm text-gray-600">{card.subText}</p>
              </div>
            </div>
            <Button
              text={{ id: 'button.edit' }}
              onClick={() => setStep(card.step)}
              mode="primaryOutline"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

CardRow.displayName = displayName;

export default CardRow;
