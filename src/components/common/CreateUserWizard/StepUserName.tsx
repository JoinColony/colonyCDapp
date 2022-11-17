import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
// import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import { ActionForm, Input } from '~shared/Fields';
import { ActionTypes } from '~redux/index';
import { WizardStepProps } from '~shared/Wizard';
import { pipe, mergePayload, withMeta } from '~utils/actions';
import ConfusableWarning from '~shared/ConfusableWarning';

import {
  FormValues,
  ContinueWizard,
  UserStepTemplate,
} from '../CreateUserWizard';


type Props = WizardStepProps<FormValues>;

const displayName = 'common.CreateUserWizard.StepUserName';

const NO_EMAIL_PROVIDED = 'NO_EMAIL_PROVIDED';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Create your user account',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `To use Colony, you must create a username for your account.
    {br}Choose carefully, it is not possible to change your username later.`,
  },
  label: {
    id: `${displayName}.label`,
    defaultMessage: 'Your Unique Username',
  },
  continue: {
    id: 'dashboard.CreateUserWizard.StepUserName.continue',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: `${displayName}.errorDomainTaken`,
    defaultMessage: 'This Username is already taken',
  },
  errorDomainInvalid: {
    id: `${displayName}.errorDomainInvalid`,
    defaultMessage: 'Only characters a-z, 0-9, - and . are allowed',
  },
});

const validationSchema = yup.object({
  username: yup.string().required().max(100).ensAddress(),
});

interface UsernameInputProps {
  username: string;
  disabled: boolean;
}
const UsernameInput = ({ username, disabled }: UsernameInputProps) => (
  <>
    <Input
      appearance={{ theme: 'fat' }}
      name="username"
      label={MSG.label}
      formattingOptions={{ blocks: [100] }}
      disabled={disabled}
    />
    {username && isConfusing(username) && <ConfusableWarning />}
  </>
);

const StepUserName = ({ wizardValues, nextStep, wizardForm }: Props) => {
  const navigate = useNavigate();

  // const checkDomainTaken = useCallback(
  //   async (values: FormValues) => {
  //     try {
  //       // const { data } = await apolloClient.query<
  //       //   UserAddressQuery,
  //       //   UserAddressQueryVariables
  //       // >({
  //       //   query: UserAddressDocument,
  //       //   variables: {
  //       //     name: values.username,
  //       //   },
  //       // });
  //       if (data && data.userAddress) return true;
  //       return false;
  //     } catch (e) {
  //       return false;
  //     }
  //   },
  //   [apolloClient],
  // );

  // const validateDomain = useCallback(
  //   async (values: FormValues) => {
  //     try {
  //       // Let's check whether this is even valid first
  //       validationSchema.validateSyncAt('username', values);
  //     } catch (caughtError) {
  //       // Just return. The actual validation will be done by the
  //       // validationSchema
  //       return {};
  //     }
  //     const taken = await checkDomainTaken(values);
  //     if (taken) {
  //       const errors = {
  //         username: MSG.errorDomainTaken,
  //       };
  //       return errors;
  //     }
  //     return {};
  //   },
  //   [checkDomainTaken],
  // );

  const transform = pipe(
    mergePayload({
      ...wizardValues,
      email: wizardValues.email || NO_EMAIL_PROVIDED,
    }),
    withMeta({ navigate }),
  );
  return (
    <ActionForm
      initialValues={{}}
      onSuccess={() => nextStep(wizardValues)}
      submit={ActionTypes.USERNAME_CREATE}
      success={ActionTypes.TRANSACTION_CREATED}
      error={ActionTypes.USERNAME_CREATE_ERROR}
      transform={transform}
      //validate={validateDomain}
      validationSchema={validationSchema}
    >
      {({ dirty, isValid, isSubmitting, values }) => (
        <UserStepTemplate
          heading={MSG.heading}
          description={MSG.description}
          descriptionValues={{ br: <br /> }}
          input={
            <UsernameInput username={values.username} disabled={isSubmitting} />
          }
          button={
            <ContinueWizard
              disabled={!isValid || !dirty || isSubmitting}
              loading={isSubmitting}
              data-test="claimUsernameConfirm"
            />
          }
        />
      )}
    </ActionForm>
  );
};

StepUserName.displayName = displayName;

export default StepUserName;
