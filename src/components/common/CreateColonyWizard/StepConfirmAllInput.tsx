import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import Heading from '~shared/Heading';
import Button from '~shared/Button';
import { ActionHookForm as ActionForm } from '~shared/Fields';

import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';

import { FormValues, CardRow, Row } from '../CreateColonyWizard';

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
  continue: {
    id: `${displayName}.continue`,
    defaultMessage: `Continue`,
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
      submit={ActionTypes.CREATE}
      success={ActionTypes.CREATE_SUCCESS}
      error={ActionTypes.CREATE_ERROR}
      transform={transform}
      onSuccess={() => nextStep(wizardValues)}
    >
      {({ formState: { isSubmitting } }) => (
        <section className={styles.main}>
          <Heading
            appearance={{ size: 'medium', weight: 'bold', margin: 'none' }}
            text={MSG.title}
          />
          <p className={styles.paragraph}>
            <FormattedMessage {...MSG.subtitle} />
          </p>
          <div className={styles.finalContainer}>
            <CardRow cardOptions={options} values={wizardValues} />
          </div>
          <div className={styles.buttons}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              type="submit"
              data-test="userInputConfirm"
              text={MSG.continue}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </section>
      )}
    </ActionForm>
  );
};

StepConfirmAllInput.displayName = displayName;

export default StepConfirmAllInput;
