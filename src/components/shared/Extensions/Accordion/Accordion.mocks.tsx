import React from 'react';
import { AccordionMocksContent } from './Accordion.types';

export const accordionMocksContent: AccordionMocksContent[] = [
  {
    id: 0,
    textItem: (
      <div>
        <div className="font-medium text-gray-900 text-md pb-1">Required Stake</div>
        <div className="text-sm font-normal text-gray-600  max-w-[28.5625rem]">
          What percentage of the team’s reputation, in token terms, should need to stake on each side of a motion?
        </div>
      </div>
    ),
    inputItem: <input placeholder="1%" />,
    accordionItem: [
      {
        id: 0,
        header: (
          <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md my-6">
            Example scenario
            <span>*</span>
          </div>
        ),
        content: (
          <div className="text-sm font-normal text-gray-600">
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
      <div>
        <div className="font-medium text-gray-900 text-md pb-1">Voter Reward</div>
        <div className="text-sm font-normal text-gray-600 max-w-[28.5625rem]">
          In a dispute, what percentage of the losing side’s stake should be awarded to the voters?
        </div>
      </div>
    ),
    inputItem: <input placeholder="20%" />,
    accordionItem: [
      {
        id: 0,
        header: (
          <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md my-6">
            Example scenario
            <span>*</span>
          </div>
        ),
        content: (
          <div className="text-sm font-normal text-gray-600">
            If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to
            be staked to either support or object to a motion.
          </div>
        ),
      },
      {
        id: 1,
        header: (
          <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md my-6">
            Example scenario
            <span>*</span>
          </div>
        ),
        content: (
          <div className="text-sm font-normal text-gray-600">
            If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to
            be staked to either support or object to a motion.
          </div>
        ),
      },
    ],
  },
];
