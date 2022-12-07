import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { UseFormSetValue } from 'react-hook-form';

import { WizardStepProps } from '~shared/Wizard';
import { HookForm as Form } from '~shared/Fields';
import Heading from '~shared/Heading';
import Button from '~shared/Button';

import { multiLineTextEllipsis } from '~utils/strings';
import { GetTokenByAddressQuery } from '~gql';

import {
  FormValues,
  Step3,
  selectTokenValidationSchema as validationSchema,
  TokenSelector,
} from '../CreateColonyWizard';

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
     * Clear state of Create Token when coming back from Select Token
     */
    if (steps[2] && type === 'create' && steps[2].tokenAddress !== '') {
      steps[2] = {};
    }
    return steps;
  });
};

const handleFetchSuccess = (
  { getTokenByAddress }: GetTokenByAddressQuery,
  setValue: UseFormSetValue<Step3>,
) => {
  const token = getTokenByAddress?.items[0];
  const { name: tokenName, symbol: tokenSymbol } = token || {};
  setValue('tokenName', tokenName || '');
  setValue('tokenSymbol', tokenSymbol || '');
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

  return (
    <section className={styles.main}>
      <div className={styles.title}>
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
      </div>
      <Form<Step3>
        onSubmit={nextStep}
        validationSchema={validationSchema}
        defaultValues={defaultValues}
      >
        {({ formState: { isValid, isValidating }, setValue }) => (
          <div>
            <TokenSelector
              handleComplete={(data: GetTokenByAddressQuery) =>
                handleFetchSuccess(data, setValue)
              }
              extra={
                <LinkToOtherStep
                  onClick={goToCreateToken}
                  linkText={MSG.link}
                />
              }
              appearance={{ theme: 'fat' }}
            />
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                type="submit"
                text={{ id: 'button.continue' }}
                disabled={!isValid || isValidating}
                data-test="definedTokenConfirm"
              />
            </div>
          </div>
        )}
      </Form>
    </section>
  );
};

StepSelectToken.displayName = displayName;

export default StepSelectToken;
