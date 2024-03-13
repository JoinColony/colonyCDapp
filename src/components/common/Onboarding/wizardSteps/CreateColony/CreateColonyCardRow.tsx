import { Image } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

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
    token: existingToken,
    tokenName,
    tokenSymbol,
    tokenAvatar,
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
      text: existingToken ? existingToken.name : tokenName,
      subText: existingToken ? existingToken.symbol : tokenSymbol,
      step: 2,
      icon:
        tokenAvatar || existingToken ? (
          <Avatar
            avatar={tokenAvatar || existingToken?.avatar}
            seed={existingToken?.tokenAddress}
            size="s"
          />
        ) : (
          <div className="flex rounded-full bg-gray-200 p-2.5 text-gray-600">
            <Image size={16} />
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
          <h5 className="lowercase text-2 first-letter:uppercase">
            {formatText(
              typeof card.title === 'string' ? { id: card.title } : card.title,
            )}
          </h5>
          <div className="flex place-content-between rounded border border-gray-200 px-6 py-4">
            <div className="flex items-center gap-5">
              {card.icon && card.icon}
              <div>
                <p className="pb-1 text-1">{card.text}</p>
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
