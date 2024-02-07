import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';
import { formatText } from '~utils/intl.ts';
import Avatar from '~v5/shared/Avatar/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { type FormValues } from './types.ts';

const displayName = 'common.CreateColonyWizard.CardRow';

interface CardRowProps {
  updatedWizardValues: FormValues;
  setStep: WizardStepProps<FormValues>['setStep'];
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
  const {
    displayName: colonyDisplayName,
    tokenName,
    tokenSymbol,
    tokenAvatar,
    tokenAddress,
    colonyName,
  } = updatedWizardValues;

  const cards = [
    {
      title: 'navigation.admin.colonyDetails',
      text: colonyDisplayName,
      subText: `app.colony.io/${colonyName}`,
      step: 0,
    },
    {
      title: MSG.nativeToken,
      text: tokenName,
      subText: tokenSymbol,
      step: 2,
      icon:
        tokenAvatar || tokenAddress ? (
          <Avatar avatar={tokenAvatar} seed={tokenAddress} size="s" />
        ) : (
          <div className="bg-gray-200 text-gray-600 p-2.5 rounded-full flex">
            <Icon
              name="image"
              appearance={{
                size: 'extraSmall',
              }}
            />
          </div>
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
              mode="quinary"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

CardRow.displayName = displayName;

export default CardRow;
