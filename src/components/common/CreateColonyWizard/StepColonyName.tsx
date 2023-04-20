import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { HookForm as Form } from '~shared/Fields';
import { useAppContext, useMobile } from '~hooks';

import { FormValues, Step1, colonyNameValidationSchema as validationSchema } from '../CreateColonyWizard';
import { HeadingText, SubmitFormButton, TruncatedName } from './shared';
import NameInputs from './StepColonyNameInputs';

import styles from './StepColonyName.css';

const displayName = 'common.CreateColonyWizard.StepColonyName';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: `Welcome @{username}, let's begin creating your colony.`,
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `What would you like to name your colony? Note, it is not possible to change it later.`,
  },
});

type Props = Pick<WizardStepProps<FormValues, Step1>, 'wizardForm' | 'nextStep' | 'wizardValues'>;

const StepColonyName = ({ wizardForm: { initialValues: defaultValues }, nextStep }: Props) => {
  const { user } = useAppContext();
  const username = user?.profile?.displayName || user?.name || '';
  const isMobile = useMobile();
  const headingText = { username: TruncatedName(username, 38) };

  return (
    <Form<Step1> onSubmit={nextStep} validationSchema={validationSchema} defaultValues={defaultValues}>
      {({ formState: { isValid, isSubmitting } }) => (
        <section className={styles.main}>
          <HeadingText
            text={MSG.heading}
            textValues={headingText}
            paragraph={MSG.description}
            appearance={{ weight: 'medium' }}
          />
          <div className={styles.nameForm}>
            <NameInputs disabled={isSubmitting} isMobile={isMobile} cleaveDefaultValue={defaultValues.colonyName} />
            <SubmitFormButton
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              dataTest="claimColonyNameConfirm"
              className={styles.submitButton}
            />
          </div>
        </section>
      )}
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
