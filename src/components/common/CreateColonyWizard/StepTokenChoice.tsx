import React from 'react';
import { defineMessages } from 'react-intl';

import { WizardStepProps } from '~shared/Wizard';
import DecisionHub from '~shared/DecisionHub';
import { HookForm as Form } from '~shared/Fields';
import { Heading3, Heading4, Heading6 } from '~shared/Heading';
import { Icons, SELECT_NATIVE_TOKEN_INFO as LEARN_MORE_URL } from '~constants';
import ExternalLink from '~shared/ExternalLink';

import { FormValues, Step2 } from '../CreateColonyWizard';
import { TruncatedName } from './shared';

import styles from './StepTokenChoice.css';

const displayName = 'common.CreateColonyWizard.StepTokenChoice';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Choose a native token for {colony}',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: `You earn reputation in a colony when it pays you in its native token.`,
  },
  subtitleWithExample: {
    id: `${displayName}.subtitleWithExample`,
    defaultMessage: `Leia completes a task for 5 FOX in the ShapeShift colony.
      Because FOX is the native token of the ShapeShift colony,
      she also earns 5 reputation in that colony.`,
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
    defaultMessage: 'For example: UNI, SUSHI, & AAVE',
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
    icon: Icons.QuestionMark,
    tooltip: MSG.tooltipCreate,
    dataTest: 'createNewToken',
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: Icons.QuestionMark,
    tooltip: MSG.tooltipSelect,
    dataTest: 'useExistingToken',
  },
];

interface InstructionsProps {
  colonyDisplayName: string;
}

const Instructions = ({ colonyDisplayName }: InstructionsProps) => {
  const headingText = { colony: TruncatedName(colonyDisplayName) };
  return (
    <div className={styles.instructions}>
      <Heading3 text={MSG.heading} textValues={headingText} />
      <Heading4 text={MSG.subtitle} />
      <Heading4
        text={MSG.subtitleWithExample}
        className={styles.subtitleWithExample}
      />
    </div>
  );
};

const LearnMore = () => (
  <div className={styles.learnMore}>
    <Heading6
      appearance={{
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
);

type Props = Pick<
  WizardStepProps<FormValues, Step2>,
  'nextStep' | 'wizardForm' | 'wizardValues' | 'setStepsValues'
>;

const handleSubmit = (
  values: Step2,
  setStepsValues: Props['setStepsValues'],
  nextStep: Props['nextStep'],
) => {
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

const StepTokenChoice = ({
  nextStep,
  wizardForm: { initialValues: defaultValues },
  wizardValues: { displayName: colonyName },
  setStepsValues,
}: Props) => {
  return (
    <Form<Step2>
      onSubmit={(values) => handleSubmit(values, setStepsValues, nextStep)}
      defaultValues={defaultValues}
    >
      <section className={styles.content}>
        <Instructions colonyDisplayName={colonyName} />
        <DecisionHub name="tokenChoice" options={options} />
        <LearnMore />
      </section>
    </Form>
  );
};

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
