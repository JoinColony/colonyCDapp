import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';
import { Heading3 } from '~shared/Heading';
import TokenSelector from '~shared/TokenSelector';

import {
  FormValues,
  Step3,
  selectTokenValidationSchema as validationSchema,
} from '../CreateColonyWizard';
import { SubmitFormButton, TruncatedName } from './shared';

import styles from './StepSelectToken.css';

const displayName = 'common.CreateColonyWizard.StepSelectToken';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Which ERC20 token would you like to use for {colony}?',
  },
  symbolHint: {
    id: `${displayName}.symbolHint`,
    defaultMessage: 'Max of 5 characters',
  },
  tokenName: {
    id: `${displayName}.tokenName`,
    defaultMessage: 'Token Name',
  },
  tokenSymbol: {
    id: `${displayName}.tokenSymbol`,
    defaultMessage: 'Token Symbol',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'I want to create a New Token',
  },
});

type Props = Pick<
  WizardStepProps<FormValues, Step3>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues'
>;

/*
 * This is a custom link since it goes to a sibling step that appears
 * to be parallel to this one after the wizard steps diverge,
 * while making sure that the data form the previous wizard steps doesn't get lost
 */
export const switchTokenInputType = (
  type: FormValues['tokenChoice'],
  setStepsValues: Props['setStepsValues'],
) => {
  setStepsValues((stepsValues) => {
    const steps = [...stepsValues];
    steps[1] = { tokenChoice: type };
    /*
     * Clear token state when switching between create/use existing
     */
    steps[2] = {};
    return steps;
  });
};

interface LinkToOtherStepProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  linkText: MessageDescriptor;
}

export const LinkToOtherStep = ({
  onClick,
  linkText,
}: LinkToOtherStepProps) => (
  <button
    type="button"
    className={styles.linkToOtherStep}
    tabIndex={-2}
    onClick={onClick}
  >
    <FormattedMessage {...linkText} />
  </button>
);

const StepSelectToken = ({
  nextStep,
  setStepsValues,
  wizardForm: { initialValues: defaultValues },
  wizardValues: { displayName: colonyName },
}: Props) => {
  const goToCreateToken = () => switchTokenInputType('create', setStepsValues);
  const headingText = { colony: TruncatedName(colonyName) };
  return (
    <section className={styles.main}>
      <Heading3 text={MSG.heading} textValues={headingText} />
      <Form<Step3>
        onSubmit={nextStep}
        validationSchema={validationSchema}
        defaultValues={defaultValues}
      >
        {({ formState: { isValid, isValidating, isSubmitting } }) => (
          <div>
            <TokenSelector
              extra={
                <LinkToOtherStep
                  onClick={goToCreateToken}
                  linkText={MSG.link}
                />
              }
              appearance={{ theme: 'fat' }}
            />
            <SubmitFormButton
              disabled={!isValid || isValidating}
              loading={isSubmitting}
              dataTest="definedTokenConfirm"
            />
          </div>
        )}
      </Form>
    </section>
  );
};

StepSelectToken.displayName = displayName;

export default StepSelectToken;
