import React from 'react';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText';
import SpecialHourInput from '~shared/Extensions/Accordion/partials/SpecialHourInput';
import SpecialPercentageInput from '~shared/Extensions/Accordion/partials/SpecialPercentageInput';
import { AccordionContent } from '~shared/Extensions/Accordion/types';
import { RadioItemProps } from '~shared/Extensions/Fields/RadioList/types';

export const mockedGovernance: RadioItemProps[] = [
  {
    value: 'radio-button-1',
    label: 'Speed over security',
    description: '3-day staking and voting periods, 60% quorum.',
  },
  {
    value: 'radio-button-2',
    label: 'Security over speed',
    description: '5-day staking and voting periods, 80% quorum.',
  },
  {
    value: 'radio-button-3',
    label: 'Testing governance',
    description: 'Do everything fast to figure out how things work.',
  },
  {
    value: 'radio-button-4',
    label: 'Custom (Advanced)',
    description: 'I know what I’m doing and want to configure it myself.',
  },
];

export const extensionContentSpeedOverSecurity: AccordionContent[] = [
  {
    id: 'step-0',
    title: 'Custom extension parameters',
    content: [
      {
        id: '0',
        textItem: <ContentTypeText title="Required Stake" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={50} />,
      },
      {
        id: '1',
        textItem: <ContentTypeText title="Voter Reward" />,
        inputItem: <SpecialPercentageInput defaultValue={20} maxValue={50} />,
      },
      {
        id: '2',
        textItem: <ContentTypeText title="Minimum Stake" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={100} />,
      },
      {
        id: '3',
        textItem: <ContentTypeText title="End Vote Threshold" />,
        inputItem: <SpecialPercentageInput defaultValue={60} maxValue={100} />,
      },
      {
        id: '4',
        textItem: <ContentTypeText title="Staking Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={72} maxValue={8760} />,
      },
      {
        id: '5',
        textItem: <ContentTypeText title="Voting Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={72} maxValue={8760} />,
      },
      {
        id: '6',
        textItem: <ContentTypeText title="Reveal Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={48} maxValue={8760} />,
      },
      {
        id: '7',
        textItem: <ContentTypeText title="Escalation Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={48} maxValue={8760} />,
      },
    ],
  },
];

export const extensionContentSecurityOverSpeed: AccordionContent[] = [
  {
    id: 'step-0',
    title: 'Custom extension parameters',
    content: [
      {
        id: '0',
        textItem: <ContentTypeText title="Required Stake" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={50} />,
      },
      {
        id: '1',
        textItem: <ContentTypeText title="Voter Reward" />,
        inputItem: <SpecialPercentageInput defaultValue={20} maxValue={50} />,
      },
      {
        id: '2',
        textItem: <ContentTypeText title="Minimum Stake" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={100} />,
      },
      {
        id: '3',
        textItem: <ContentTypeText title="End Vote Threshold" />,
        inputItem: <SpecialPercentageInput defaultValue={80} maxValue={100} />,
      },
      {
        id: '4',
        textItem: <ContentTypeText title="Staking Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={120} maxValue={8760} />,
      },
      {
        id: '5',
        textItem: <ContentTypeText title="Voting Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={120} maxValue={8760} />,
      },
      {
        id: '6',
        textItem: <ContentTypeText title="Reveal Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={72} maxValue={8760} />,
      },
      {
        id: '7',
        textItem: <ContentTypeText title="Escalation Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={72} maxValue={8760} />,
      },
    ],
  },
];

export const extensionContentTestingGovernance: AccordionContent[] = [
  {
    id: 'step-0',
    title: 'Custom extension parameters',
    content: [
      {
        id: '0',
        textItem: <ContentTypeText title="Required Stake" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={50} />,
      },
      {
        id: '1',
        textItem: <ContentTypeText title="Voter Reward" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={50} />,
      },
      {
        id: '2',
        textItem: <ContentTypeText title="Minimum Stake" />,
        inputItem: <SpecialPercentageInput defaultValue={1} maxValue={100} />,
      },
      {
        id: '3',
        textItem: <ContentTypeText title="End Vote Threshold" />,
        inputItem: <SpecialPercentageInput defaultValue={51} maxValue={100} />,
      },
      {
        id: '4',
        textItem: <ContentTypeText title="Staking Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={0.083} maxValue={8760} />,
      },
      {
        id: '5',
        textItem: <ContentTypeText title="Voting Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={0.083} maxValue={8760} />,
      },
      {
        id: '6',
        textItem: <ContentTypeText title="Reveal Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={0.083} maxValue={8760} />,
      },
      {
        id: '7',
        textItem: <ContentTypeText title="Escalation Phase Duration" />,
        inputItem: <SpecialHourInput defaultValue={0.083} maxValue={8760} />,
      },
    ],
  },
];
