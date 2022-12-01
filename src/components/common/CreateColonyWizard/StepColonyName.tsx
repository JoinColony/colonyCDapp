import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import { Form, Input } from '~shared/Fields';
import Heading from '~shared/Heading';
import Button from '~shared/Button';
import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import { multiLineTextEllipsis } from '~utils/strings';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { useAppContext, useMobile } from '~hooks';

import { validationSchema } from './validation';
import { FormValues, Step1 } from './CreateColonyWizard';

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
  colonyUniqueURL: {
    id: `${displayName}.colonyUniqueURL`,
    defaultMessage: 'Colony Unique URL',
  },
  colonyName: {
    id: `${displayName}.colonyName`,
    defaultMessage: 'Colony Name',
  },
  tooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage: `We use ENS to create a .{displayENSDomain} subdomain for your colony. You can use this to create a custom URL and invite people to join your colony.`,
  },
  keyRequired: {
    id: `${displayName}.keyRequired`,
    defaultMessage: `{key} is a required field`,
  },
});

type Props = Pick<
  WizardStepProps<FormValues, Step1>,
  'wizardForm' | 'nextStep' | 'wizardValues'
>;

const StepColonyName = ({ wizardForm, nextStep, wizardValues }: Props) => {
  const { user } = useAppContext();
  const username = user?.profile?.displayName || user?.name || '';
  const isMobile = useMobile();

  return (
    <Form
      onSubmit={nextStep}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ isValid, isSubmitting, dirty }) => {
        return (
          <section className={styles.main}>
            <Heading appearance={{ size: 'medium', weight: 'medium' }}>
              <FormattedMessage
                {...MSG.heading}
                values={{
                  /*
                   * @NOTE We need to use a JS string truncate here, rather then CSS,
                   * since we're dealing with a string that needs to be truncated,
                   * inside a sentence that does not
                   */
                  username: (
                    <span
                      /*
                       * @NOTE Needed so the user can get the full username on hover
                       * (But still, if it's too long, the browser will trucate it)
                       */
                      title={username}
                    >
                      {multiLineTextEllipsis(username, 38)}
                    </span>
                  ),
                }}
              />
            </Heading>
            <p className={styles.paragraph}>
              <FormattedMessage {...MSG.description} />
            </p>
            <div className={styles.nameForm}>
              <Input
                appearance={{ theme: 'fat' }}
                name="displayName"
                data-test="claimColonyDisplayNameInput"
                label={MSG.colonyName}
                disabled={isSubmitting}
              />
              <Input
                appearance={{ theme: 'fat' }}
                name="colonyName"
                data-test="claimColonyNameInput"
                // eslint-disable-next-line max-len
                extensionString={`.colony.${DEFAULT_NETWORK_INFO.displayENSDomain}`}
                label={MSG.colonyUniqueURL}
                formattingOptions={{ lowercase: true, blocks: [256] }}
                disabled={isSubmitting}
                extra={
                  <QuestionMarkTooltip
                    tooltipText={MSG.tooltip}
                    tooltipTextValues={{
                      displayENSDomain: DEFAULT_NETWORK_INFO.displayENSDomain,
                    }}
                    className={styles.iconContainer}
                    tooltipClassName={styles.tooltipContent}
                    tooltipPopperOptions={
                      isMobile
                        ? {
                            placement: 'left',
                          }
                        : undefined
                    }
                  />
                }
              />
              <div className={styles.buttons}>
                <Button
                  appearance={{ theme: 'primary', size: 'large' }}
                  type="submit"
                  data-test="claimColonyNameConfirm"
                  disabled={
                    !isValid ||
                    (!dirty && !wizardValues.colonyName) ||
                    isSubmitting
                  }
                  loading={isSubmitting}
                  text={{ id: 'button.continue' }}
                />
              </div>
            </div>
          </section>
        );
      }}
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
