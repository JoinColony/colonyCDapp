import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { string, object } from 'yup';
import { FormikHelpers } from 'formik';

import { WizardStepProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';
import Heading from '~shared/Heading';
import Button from '~shared/Button';

import { ADDRESS_ZERO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { multiLineTextEllipsis } from '~utils/strings';
import { intl } from '~utils/intl';
import { GetTokenByAddressQuery } from '~gql';

import TokenSelector from './TokenSelector';
import { FormValues, Step3 } from './CreateColonyWizard';

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
  continue: {
    id: `${displayName}.continue`,
    defaultMessage: 'Continue',
  },
  invalidAddress: {
    id: `${displayName}.invalidAddress`,
    defaultMessage:
      'Not a valid token. Only ERC20 tokens with 18 decimals are supported.',
  },
  addressZeroError: {
    id: `${displayName}.addressZeroError`,
    defaultMessage:
      'You cannot use {symbol} token as a native token for colony.',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'I want to create a New Token',
  },
  requiredError: {
    id: `${displayName}.requiredError`,
    defaultMessage: 'Token Address is a required field',
  },
});

const validationSchema = () => {
  const { formatMessage } = intl();

  return object({
    tokenAddress: string()
      .required(() => MSG.requiredError)
      .address(() => MSG.invalidAddress)
      .notOneOf(
        [ADDRESS_ZERO],
        formatMessage(MSG.addressZeroError, {
          symbol: DEFAULT_NETWORK_TOKEN.symbol,
        }),
      ),
    tokenSymbol: string().max(10),
    tokenName: string().max(256),
  });
};

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
  setFieldValue: FormikHelpers<FormValues>['setFieldValue'],
) => {
  const token = getTokenByAddress?.items[0];
  const { name: tokenName, symbol: tokenSymbol } = token || {};
  setFieldValue('tokenName', tokenName || '');
  setFieldValue('tokenSymbol', tokenSymbol || '');
};

interface GoToCreateTokenButtonProps {
  goToCreateToken: () => void;
}

const GoToCreateTokenButton = ({
  goToCreateToken,
}: GoToCreateTokenButtonProps) => (
  <button
    type="button"
    className={styles.linkToOtherStep}
    tabIndex={-2}
    onClick={goToCreateToken}
  >
    <FormattedMessage {...MSG.link} />
  </button>
);

const StepSelectToken = ({
  nextStep,
  setStepsValues,
  wizardForm,
  wizardValues,
}: Props) => {
  const [isFetchingToken, setIsFetchingToken] = useState<boolean>(false);
  const [tokenSelectorHasError, setTokenSelectorHasError] =
    useState<boolean>(false);

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
                <span title={wizardValues.displayName}>
                  {multiLineTextEllipsis(wizardValues.displayName, 120)}
                </span>
              ),
            }}
          />
        </Heading>
      </div>
      <Form
        onSubmit={nextStep}
        validationSchema={validationSchema}
        {...wizardForm}
      >
        {({ dirty, isValid, setFieldValue }) => (
          <div>
            <TokenSelector
              handleComplete={(data: GetTokenByAddressQuery) =>
                handleFetchSuccess(data, setFieldValue)
              }
              setLoading={setIsFetchingToken}
              setError={setTokenSelectorHasError}
              extra={<GoToCreateTokenButton {...{ goToCreateToken }} />}
              appearance={{ theme: 'fat' }}
            />
            <div className={styles.buttons}>
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                type="submit"
                text={MSG.continue}
                disabled={
                  tokenSelectorHasError ||
                  !isValid ||
                  (!dirty && !wizardValues.tokenAddress) ||
                  isFetchingToken
                }
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
