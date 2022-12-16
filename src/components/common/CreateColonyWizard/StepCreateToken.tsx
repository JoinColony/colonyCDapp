import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { HookForm as Form } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';

import {
  FormValues,
  Step3,
  createTokenValidationSchema as validationSchema,
  switchTokenInputType,
  LinkToOtherStep,
} from '../CreateColonyWizard';
import { SubmitFormButton, TruncatedName } from './shared';
import TokenInputs from './StepCreateTokenInputs';

import styles from './StepCreateToken.css';

const displayName = `common.CreateColonyWizard.StepCreateToken`;

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Create new token for {colony}',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'I want to use an existing token',
  },
});

type Props = Pick<
  WizardStepProps<FormValues, Step3>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues'
>;

const StepCreateToken = ({
  nextStep,
  setStepsValues,
  wizardForm: { initialValues: defaultValues },
  wizardValues: { displayName: colonyName },
}: Props) => {
  const headingText = { colony: TruncatedName(colonyName) };
  const goToSelectToken = () => switchTokenInputType('select', setStepsValues);
  const handleSubmit = (values: Step3) => {
    nextStep({ ...values, tokenAddress: '' });
  };

  return (
    <Form<Step3>
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      defaultValues={defaultValues}
    >
      {({ formState: { isSubmitting, isValid } }) => (
        <section className={styles.main}>
          <Heading3 text={MSG.heading} textValues={headingText} />
          <TokenInputs
            disabled={isSubmitting}
            cleaveDefaultValue={defaultValues.tokenSymbol}
            extra={
              <LinkToOtherStep onClick={goToSelectToken} linkText={MSG.link} />
            }
          />
          <SubmitFormButton
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            dataTest="definedTokenConfirm"
          />
        </section>
      )}
    </Form>
  );
};

StepCreateToken.displayName = displayName;

export default StepCreateToken;
