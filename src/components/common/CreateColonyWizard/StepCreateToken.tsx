import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { HookForm as Form, HookFormInput as Input } from '~shared/Fields';
import Heading from '~shared/Heading';
import Button from '~shared/Button';

import { multiLineTextEllipsis } from '~utils/strings';

import {
  FormValues,
  Step3,
  createTokenValidationSchema as validationSchema,
  switchTokenInputType,
  LinkToOtherStep,
} from '../CreateColonyWizard';

import styles from './StepCreateToken.css';

const displayName = `common.CreateColonyWizard.StepCreateToken`;

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Create new token for {colony}',
  },
  nextButton: {
    id: `${displayName}.confirmButton`,
    defaultMessage: 'Continue',
  },
  backButton: {
    id: `${displayName}.backButton`,
    defaultMessage: 'Back',
  },
  labelTokenName: {
    id: `${displayName}.labelTokenName`,
    defaultMessage: 'Token Name',
  },
  labelTokenSymbol: {
    id: `${displayName}.labelTokenSymbol`,
    defaultMessage: 'Token Symbol',
  },
  helpTokenSymbol: {
    id: `${displayName}.helpTokenSymbol`,
    defaultMessage: '(e.g., MAT, AMEX)',
  },
  helpTokenName: {
    id: `${displayName}.helpTokenName`,
    defaultMessage: '(e.g., My Awesome Token)',
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

const formatting = {
  tokenSymbol: { uppercase: true, blocks: [5] },
};

const StepCreateToken = ({
  nextStep,
  setStepsValues,
  wizardForm: { initialValues: defaultValues },
  wizardValues: { displayName: colonyName },
}: Props) => {
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
        <div className={styles.main}>
          <section className={styles.titleSection}>
            <Heading appearance={{ size: 'medium', weight: 'bold' }}>
              <FormattedMessage
                {...MSG.heading}
                values={{
                  /*
                   * @NOTE We need to use a JS string truncate here, rather then CSS,
                   * since we're dealing with a string that needs to be truncated,
                   * inside a sentence that does not
                   */
                  colony: (
                    <span title={colonyName}>
                      {multiLineTextEllipsis(colonyName, 120)}
                    </span>
                  ),
                }}
              />
            </Heading>
          </section>
          <section className={styles.inputFields}>
            <div className={styles.inputFieldWrapper}>
              <Input
                name="tokenName"
                appearance={{ theme: 'fat' }}
                label={MSG.labelTokenName}
                help={MSG.helpTokenName}
                data-test="defineTokenName"
                disabled={isSubmitting}
                extra={
                  <LinkToOtherStep
                    onClick={goToSelectToken}
                    linkText={MSG.link}
                  />
                }
              />
            </div>
            <div className={styles.inputFieldWrapper}>
              <Input
                name="tokenSymbol"
                value={defaultValues.tokenSymbol}
                appearance={{ theme: 'fat' }}
                maxLength={5}
                data-test="defineTokenSymbol"
                formattingOptions={formatting.tokenSymbol}
                label={MSG.labelTokenSymbol}
                help={MSG.helpTokenSymbol}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <section className={styles.actionsContainer}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={MSG.nextButton}
              type="submit"
              data-test="definedTokenConfirm"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            />
          </section>
        </div>
      )}
    </Form>
  );
};

StepCreateToken.displayName = displayName;

export default StepCreateToken;
