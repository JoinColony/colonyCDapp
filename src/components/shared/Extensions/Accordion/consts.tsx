import React from 'react';
import { AccordionContent } from './types';
import ContentTypeAccordionContent from './partials/ContentTypeAccordionContent';
import ContentTypeAccordionHeader from './partials/ContentTypeAccordionHeader';
import ContentTypeText from './partials/ContentTypeText';
import SpecialHourInput from './partials/SpecialHourInput';
import SpecialPercentageInput from './partials/SpecialPercentageInput';

/*
 * @TODO: display data from API, update components
 */

export const accordionMocksContent: AccordionContent[] = [
  {
    id: 'step-0',
    title: 'Show extension parameters',
    content: [
      {
        id: 0,
        textItem: (
          <ContentTypeText
            title="Required Stake"
            subTitle="What percentage of the team’s reputation, 
            in token terms, should need to stake on each side of a motion?"
          />
        ),
        inputItem: <SpecialHourInput maxValue={8766} />,
        accordionItem: [
          {
            id: 'step-0-0',
            header: <ContentTypeAccordionHeader>Example scenario</ContentTypeAccordionHeader>,
            content: (
              <ContentTypeAccordionContent>
                If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need
                to be staked to either support or object to a motion.
              </ContentTypeAccordionContent>
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'step-1',
    title: 'Show extension parameters 2',
    content: [
      {
        id: 1,
        textItem: (
          <ContentTypeText
            title="Voter Reward"
            subTitle="In a dispute, what percentage of the losing side’s stake should be awarded to the voters?"
          />
        ),
        inputItem: <SpecialPercentageInput maxValue={50} />,
        accordionItem: [
          {
            id: 'step-1-0',
            header: <ContentTypeAccordionHeader>Example scenario 1</ContentTypeAccordionHeader>,
            content: <ContentTypeAccordionContent>content 1</ContentTypeAccordionContent>,
          },
          {
            id: 'step-1-1',
            header: <ContentTypeAccordionHeader>Example scenario 2</ContentTypeAccordionHeader>,
            content: <ContentTypeAccordionContent>content 2</ContentTypeAccordionContent>,
          },
          {
            id: 'step-1-2',
            header: <ContentTypeAccordionHeader>Example scenario 3</ContentTypeAccordionHeader>,
            content: <ContentTypeAccordionContent>content 3</ContentTypeAccordionContent>,
          },
        ],
      },
    ],
  },
  {
    id: 'step-2',
    title: 'Show extension parameters 3',
    content: [
      {
        id: 1,
        textItem: (
          <ContentTypeText
            title="Voter Reward"
            subTitle="In a dispute, what percentage of the losing side’s stake should be awarded to the voters?"
          />
        ),
        inputItem: <SpecialPercentageInput maxValue={100} />,
      },
    ],
  },
];
