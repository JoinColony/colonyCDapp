import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { ActionHookForm as ActionForm } from '~shared/Fields';

import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';

import { FormValues } from '../CreateColonyWizard';
import { HeadingText, SubmitFormButton } from './shared';
import CardRow, { Row } from './CreateColonyCardRow';

import styles from './StepConfirmAllInput.css';

const displayName = 'common.CreateColonyWizard.StepConfirmAllInput';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `Does this look right?`,
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: `Please double check that these details
      are correct, they cannot be changed later.`,
  },
  userName: {
    id: `${displayName}.userName`,
    defaultMessage: `Your username`,
  },
  colonyName: {
    id: `${displayName}.colonyName`,
    defaultMessage: `Your colony`,
  },
  tokenName: {
    id: `${displayName}.tokenName`,
    defaultMessage: `Your colony's native token`,
  },
});

const options: Row[] = [
  {
    title: MSG.userName,
    valueKey: 'username',
  },
  {
    title: MSG.colonyName,
    valueKey: 'colonyName',
  },
  {
    title: MSG.tokenName,
    valueKey: ['tokenSymbol', 'tokenName'],
  },
];

type Props = Pick<WizardStepProps<FormValues>, 'nextStep' | 'wizardValues'>;

const StepConfirmAllInput = ({ nextStep, wizardValues }: Props) => {
  const transform = mergePayload({
    ...wizardValues,
  });

  return (
    <ActionForm
      defaultValues={{}}
      actionType={ActionTypes.CREATE}
      transform={transform}
      onSuccess={() => nextStep(wizardValues)}
    >
      {({ formState: { isSubmitting } }) => (
        <section className={styles.main}>
          <HeadingText
            appearance={{ margin: 'none' }}
            text={MSG.title}
            paragraph={MSG.subtitle}
          />
          <div className={styles.finalContainer}>
            <CardRow cardOptions={options} values={wizardValues} />
          </div>
          <SubmitFormButton
            dataTest="userInputConfirm"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </section>
      )}
    </ActionForm>
  );
};

StepConfirmAllInput.displayName = displayName;

export default StepConfirmAllInput;
