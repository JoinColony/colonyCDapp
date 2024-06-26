import { CoinVertical, HandCoins } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { type MessageDescriptor } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { type WizardStepProps } from '~shared/Wizard/index.ts';
import { formatText } from '~utils/intl.ts';
import MenuContainer from '~v5/shared/MenuContainer/index.ts';

import ButtonRow from '../ButtonRow.tsx';
import HeaderRow from '../HeaderRow.tsx';
import { MSGTokenChoice as MSG } from '../shared.ts';

import { type FormValues, type Step2 } from './types.ts';

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
}

const TokenSelector = ({
  name,
  icon,
  title,
  description,
}: TokenSelectorProps) => {
  const { register, watch } = useFormContext();

  const registerField = register && register('tokenChoice');
  const checked = name === watch('tokenChoice');

  return (
    <label htmlFor={`id-${name}`}>
      <MenuContainer
        checked={checked}
        className={clsx(
          'flex h-full cursor-pointer flex-col items-center text-center md:hover:border-blue-200 md:hover:shadow-default',
        )}
      >
        <div className="mb-4">
          <input
            {...registerField}
            type="radio"
            value={name}
            id={`id-${name}`}
            className="relative h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 appearance-none rounded-full border border-gray-200 transition ease-in checked:border-blue-400 checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:block checked:after:h-[7.02px] checked:after:w-[7.02px] checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:rounded-full checked:after:bg-blue-400 checked:after:content-['']"
          />
        </div>
        {icon}
        <span className="pt-4 text-1">{formatText(title)}</span>
        <span className="pt-1 description-1">{formatText(description)}</span>
      </MenuContainer>
    </label>
  );
};

const StepTokenChoice = ({
  wizardForm: { initialValues: defaultValues },
  wizardValues: { tokenChoice },
  previousStep,
  nextStep,
}: Props) => (
  <Form<Step2>
    onSubmit={nextStep}
    defaultValues={{
      tokenChoice: tokenChoice || defaultValues.tokenChoice,
    }}
  >
    <HeaderRow heading={MSG.heading} description={MSG.description} />
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <TokenSelector
        name="create"
        title={MSG.createOptionTitle}
        description={MSG.createOptionDescription}
        icon={<CoinVertical className="rotate-90" size={22} />}
      />
      <TokenSelector
        name="select"
        title={MSG.selectOptionTitle}
        description={MSG.selectOptionDescription}
        icon={<HandCoins size={22} />}
      />
    </div>
    <ButtonRow previousStep={previousStep} />
  </Form>
);

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
