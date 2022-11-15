import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import { WizardStepProps } from '~shared/Wizard';
import Heading from '~shared/Heading';
import ExternalLink from '~shared/ExternalLink';
import DecisionHub from '~shared/DecisionHub';
import { Form } from '~shared/Fields';
import { multiLineTextEllipsis } from '~utils/strings';
import { SELECT_NATIVE_TOKEN_INFO as LEARN_MORE_URL } from '~constants';

import { FormValues, Step2 } from './ColonyCreationWizard';

import queries from '~styles/queries.css';
import styles from './StepTokenChoice.css';

const displayName = 'common.ColonyCreationWizard.StepTokenChoice';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Choose a native token for {colony}',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: `You earn reputation in a colony when it pays you in its\
      native token.`,
  },
  subtitleWithExample: {
    id: `${displayName}.subtitleWithExample`,
    defaultMessage: `Leia completes a task for 5 FOX in the ShapeShift colony.
    Because FOX is the native token of the ShapeShift colony,
    she also earns 5 reputation in that colony.`,
  },
  button: {
    id: `${displayName}.button`,
    defaultMessage: 'Back',
  },
  notSure: {
    id: `${displayName}.notSure`,
    defaultMessage: 'Not sure?',
  },
  createTokenTitle: {
    id: `${displayName}.newToken`,
    defaultMessage: 'Create a new token',
  },
  selectTokenTitle: {
    id: `${displayName}.existingToken`,
    defaultMessage: 'Use an existing ERC20 token',
  },
  createTokenSubtitle: {
    id: `${displayName}.newTokenSubtitle`,
    defaultMessage: 'For example: MyAwesomeToken',
  },
  selectTokenSubtitle: {
    id: `${displayName}.existingTokenSubtitle`,
    defaultMessage: 'Add in the list of examples: UNI, SUSHI, & AAVE',
  },
  tooltipCreate: {
    id: `${displayName}.tooltipCreate`,
    defaultMessage: `Good for projects that don't already have a token or who want more control over their token`,
  },
  tooltipSelect: {
    id: `${displayName}.tooltipSelect`,
    defaultMessage: `Good for projects that already have their own token or want to use an existing one like DAI.`,
  },
});

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipCreate,
    dataTest: 'createNewToken',
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipSelect,
    dataTest: 'useExistingToken',
  },
];

type Props = Pick<
  WizardStepProps<FormValues>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues'
>;

const { query700: query } = queries;

const StepTokenChoice = ({
  nextStep,
  wizardForm,
  wizardValues,
  setStepsValues,
}: Props) => {
  const isMobile = useMediaQuery({ query });

  const handleSubmit = (values: Step2) => {
    setStepsValues((stepsValues) => {
      const oldStep2: Partial<Step2> = stepsValues[1];
      /*
       * If we change choice, reset step 3 (index 2) form state.
       * This is so the state from Select / Create token doesn't spill over into the other.
       */
      if (oldStep2 && oldStep2.tokenChoice !== values.tokenChoice) {
        const steps = [...stepsValues];
        steps[2] = {};
        return steps;
      }
      return stepsValues;
    });
    nextStep(values);
  };

  return (
    <Form onSubmit={handleSubmit} {...wizardForm}>
      <section className={styles.content}>
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
        <div className={styles.subtitle}>
          <Heading
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subtitle}
          />
        </div>
        <div className={styles.subtitleWithExampleBox}>
          <Heading
            className={styles.subtitleWithExample}
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subtitleWithExample}
          />
        </div>
        <DecisionHub name="tokenChoice" options={options} isMobile={isMobile} />
        <div className={styles.titleAndButton}>
          <Heading
            appearance={{
              size: 'tiny',
              weight: 'bold',
              margin: 'none',
            }}
            text={MSG.notSure}
          />
          <ExternalLink
            className={styles.link}
            text={{ id: 'text.learnMore' }}
            href={LEARN_MORE_URL}
          />
        </div>
      </section>
    </Form>
  );
};

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
