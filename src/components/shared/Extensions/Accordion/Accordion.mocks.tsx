import React from 'react';
import { AccordionMocksContent } from './Accordion.types';
import ContentTypeText from './Partials/ContentTypeText';

/*
 * @TODO: display data from API, update components
 */

export const accordionMocksContent: AccordionMocksContent[] = [
  {
    id: 0,
    textItem: (
      <ContentTypeText
        title="Required Stake"
        subTitle="What percentage of the team’s reputation, 
        in token terms, should need to stake on each side of a motion?"
      />
    ),
    /*
     * @TODO: add custom input component
     */
    inputItem: <input placeholder="1%" />,
    accordionItem: [
      {
        id: 0,
        header: (
          <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md">
            Example scenario
          </div>
        ),
        content: (
          <div className="text-sm font-normal text-gray-600 pt-2">
            If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to
            be staked to either support or object to a motion.
          </div>
        ),
      },
    ],
  },
  {
    id: 1,
    textItem: (
      <ContentTypeText
        title="Voter Reward"
        subTitle="In a dispute, what percentage of the losing side’s stake should be awarded to the voters?"
      />
    ),
    inputItem: <input placeholder="20%" />,
    accordionItem: [
      {
        id: 0,
        header: (
          <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md">
            Example scenario
          </div>
        ),
        content: (
          <div className="text-sm font-normal text-gray-600 pt-2">
            If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to
            be staked to either support or object to a motion.
          </div>
        ),
      },
      {
        id: 1,
        header: (
          <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md">
            Example scenario
          </div>
        ),
        content: (
          <div className="text-sm font-normal text-gray-600 pt-2">
            If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to
            be staked to either support or object to a motion.
          </div>
        ),
      },
    ],
  },
];
