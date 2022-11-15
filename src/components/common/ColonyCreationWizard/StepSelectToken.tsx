import { FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { string, object } from 'yup';

import { WizardProps } from '~shared/Wizard';
import { Form } from '~shared/Fields';
import Heading from '~shared/Heading';
import Button from '~shared/Button';

import { ADDRESS_ZERO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { multiLineTextEllipsis } from '~utils/strings';
import { intl } from '~utils/intl';
import { Token } from '~gql';

import TokenSelector from './TokenSelector';
import { FormValues } from './ColonyCreationWizard';

import styles from './StepSelectToken.css';

const displayName = 'common.ColonyCreationWizard.StepSelectToken';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Which ERC20 token would you like to use for {colony}',
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
});

const validationSchema = () => {
  const { formatMessage } = intl;

  return object({
    tokenAddress: string()
      .address(() => MSG.invalidAddress)
      .test(
        'is-not-addressZero',
        formatMessage(MSG.addressZeroError, {
          symbol: DEFAULT_NETWORK_TOKEN.symbol,
        }),
        (value) => value !== ADDRESS_ZERO,
      ),
    tokenSymbol: string().max(10),
    tokenName: string().max(256),
  });
};

type Props = Pick<
  WizardProps<FormValues>,
  'nextStep' | 'previousStep' | 'stepCompleted' | 'wizardForm' | 'wizardValues'
>;

export const switchTokenInputType = (
  type: FormValues['tokenChoice'],
  previousStep: Props['previousStep'],
  nextStep: Props['nextStep'],
  wizardValues: FormValues,
) => {
  /*
   * This is a custom link since it goes to a sibling step that appears
   * to be parallel to this one after the wizard steps diverge,
   * while making sure that the data form the previous wizard steps doesn't get lost
   */
  const wizardValuesCopy = { ...wizardValues };
  previousStep();
  wizardValuesCopy.tokenChoice = type;
  nextStep(wizardValuesCopy);
};

const StepSelectToken = ({
  nextStep,
  previousStep,
  stepCompleted,
  wizardForm: { initialValues },
  wizardValues,
}: Props) => {
  const goToCreateToken = () =>
    switchTokenInputType('create', previousStep, nextStep, wizardValues);

  const [tokenData, setTokenData] = useState<Token | undefined>();
  const [isLoadingAddress, setisLoadingAddress] = useState<boolean>(false);
  const [tokenSelectorHasError, setTokenSelectorHasError] =
    useState<boolean>(false);

  const handleTokenSelect = (
    checkingAddress: boolean,
    token: Token,
    setFieldValue: FormikHelpers<FormValues>['setFieldValue'],
  ) => {
    setTokenData(token);
    setisLoadingAddress(checkingAddress);

    setFieldValue('tokenName', token?.name || '');
    setFieldValue('tokenSymbol', token?.symbol || '');
  };

  const handleTokenSelectError = (hasError: boolean) => {
    setTokenSelectorHasError(hasError);
  };

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
        initialValues={initialValues}
      >
        {({ dirty, isValid, setFieldValue, values }) => (
          <div>
            <TokenSelector
              tokenAddress={values.tokenAddress}
              onTokenSelect={(checkingAddress: boolean, token: Token) => {
                handleTokenSelect(checkingAddress, token, setFieldValue);
              }}
              onTokenSelectError={handleTokenSelectError}
              tokenSelectorHasError={tokenSelectorHasError}
              isLoadingAddress={isLoadingAddress}
              tokenData={tokenData}
              extra={
                <button
                  type="button"
                  className={styles.linkToOtherStep}
                  tabIndex={-2}
                  onClick={goToCreateToken}
                >
                  <FormattedMessage {...MSG.link} />
                </button>
              }
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
                  (!dirty && !stepCompleted) ||
                  isLoadingAddress
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
