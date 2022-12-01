import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { object, string } from 'yup';

import { WizardStepProps } from '~shared/Wizard';
import { Form, FormStatus, Input } from '~shared/Fields';
import Heading from '~shared/Heading';
import Button from '~shared/Button';

import { multiLineTextEllipsis } from '~utils/strings';
import { intl } from '~utils/intl';

import { FormValues, Step3 } from './CreateColonyWizard';
import { switchTokenInputType } from './StepSelectToken';

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
  errorTokenSymbol: {
    id: `${displayName}.errorTokenSymbol`,
    defaultMessage: `The token symbol can only contain letters and numbers, and
      can only have a length of 5`,
  },
  keyRequired: {
    id: `${displayName}.keyRequired`,
    defaultMessage: `{key} is a required field`,
  },
});

const { formatMessage } = intl();

const validationSchema = object({
  tokenName: string()
    .max(256)
    .required(
      formatMessage(MSG.keyRequired, {
        key: formatMessage(MSG.labelTokenName),
      }),
    ),
  tokenSymbol: string()
    .required(
      formatMessage(MSG.keyRequired, {
        key: formatMessage(MSG.labelTokenSymbol),
      }),
    )
    .max(5, () => MSG.errorTokenSymbol),
});

type Props = Pick<
  WizardStepProps<FormValues, Step3>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues'
>;
const StepCreateToken = ({
  nextStep,
  setStepsValues,
  wizardForm,
  wizardValues,
}: Props) => {
  const goToSelectToken = () => switchTokenInputType('select', setStepsValues);

  const handleSubmit = (values: Step3) => {
    nextStep({ ...values, tokenAddress: '' });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ dirty, isSubmitting, isValid, status }) => (
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
                    <span title={wizardValues.displayName}>
                      {multiLineTextEllipsis(wizardValues.displayName, 120)}
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
                  <button
                    type="button"
                    className={styles.linkToOtherStep}
                    tabIndex={-2}
                    onClick={goToSelectToken}
                  >
                    <FormattedMessage {...MSG.link} />
                  </button>
                }
              />
            </div>
            <div className={styles.inputFieldWrapper}>
              <Input
                name="tokenSymbol"
                appearance={{ theme: 'fat' }}
                maxLength={5}
                data-test="defineTokenSymbol"
                formattingOptions={{ uppercase: true, blocks: [5] }}
                label={MSG.labelTokenSymbol}
                help={MSG.helpTokenSymbol}
                disabled={isSubmitting}
              />
            </div>
          </section>
          <FormStatus status={status} />
          <section className={styles.actionsContainer}>
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              text={MSG.nextButton}
              type="submit"
              data-test="definedTokenConfirm"
              disabled={
                !isValid || (!dirty && !wizardValues.tokenName) || isSubmitting
              }
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
