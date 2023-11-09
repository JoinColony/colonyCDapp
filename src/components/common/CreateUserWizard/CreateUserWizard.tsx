import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Props as FormattedMessageProps } from 'react-intl/src/components/message';

import Heading from '~shared/Heading';
import ColonyButton from '~shared/Button';
import WizardTemplate from '~frame/WizardTemplate';
import withWizard from '~shared/Wizard/withWizard';

import {
  FormValues,
  initialValues,
  StepUserName,
  StepUserEmail,
} from '../CreateUserWizard';

import styles from './CreateUserWizard.css';

const steps = [StepUserEmail, StepUserName];

const CreateUserContainer = withWizard<FormValues>({
  initialValues,
  steps,
})(WizardTemplate);

interface UserStepTemplateProps {
  heading: MessageDescriptor | string;
  description: MessageDescriptor;
  descriptionValues?: FormattedMessageProps['values'];
  input: JSX.Element;
  button: JSX.Element;
}

export const UserStepTemplate = ({
  heading,
  description,
  descriptionValues,
  input,
  button,
}: UserStepTemplateProps) => (
  <section className={styles.main}>
    <div>
      <Heading appearance={{ size: 'medium' }} text={heading} />
      <p className={styles.paragraph}>
        <FormattedMessage {...description} values={descriptionValues} />
      </p>
      <div className={styles.nameForm}>
        {input}
        <div className={styles.buttons}>{button}</div>
      </div>
    </div>
  </section>
);

interface ContinueWizardProps {
  disabled: boolean;
  loading: boolean;
  dataTest?: string;
}
export const ContinueWizard = ({
  disabled,
  loading,
  dataTest,
}: ContinueWizardProps) => (
  <ColonyButton
    appearance={{ theme: 'primary', size: 'large' }}
    type="submit"
    disabled={disabled}
    loading={loading}
    text={{ id: 'button.continue' }}
    data-test={dataTest}
  />
);

export default CreateUserContainer;
