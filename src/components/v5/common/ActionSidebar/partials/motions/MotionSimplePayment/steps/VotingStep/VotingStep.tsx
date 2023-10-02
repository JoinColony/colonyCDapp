import React, { FC } from 'react';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

import CardWithStatusText from '~v5/shared/CardWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import { VotingStepItem } from './types';
import Icon from '~shared/Icon';
import TextWithValue from './partials/TextWithValue';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.VotingStep';

const VotingStep: FC = () => {
  const items: VotingStepItem[] = [
    {
      key: '1',
      text: formatText({ id: 'motion.votingStep.votingMethod' }),
      children: <span className="text-sm">Reputation-weighted</span>,
    },
    {
      key: '2',
      text: formatText({ id: 'motion.votingStep.teamReputation' }),
      children: (
        <div className="flex items-center gap-1">
          <Icon name="star" appearance={{ size: 'tiny' }} />
          <span className="text-sm">17.61%</span>
        </div>
      ),
    },
    {
      key: '3',
      text: formatText({ id: 'motion.votingStep.rewardRange' }),
      children: <span className="text-sm">0.0006 - 12 CLNY</span>,
    },
  ];

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: (
          <p className="text-4">
            {formatText({ id: 'motion.votingStep.statusText' })}
          </p>
        ),
        iconAlignment: 'top',
        content: (
          <ProgressBar
            progress={0}
            minimumProgress={40}
            additionalText={formatText({
              id: 'motion.votingStep.additionalText',
            })}
          />
        ),
      }}
      sections={[
        {
          key: '1',
          content: (
            <ActionForm actionType={ActionTypes.MOTION_VOTE}>
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-2 mb-3 text-center">
                  {formatText({ id: 'motion.votingStep.title' })}
                </p>
                <FormButtonRadioButtons
                  items={[
                    {
                      label: formatText({ id: 'motion.oppose' }),
                      id: 'oppose',
                      value: 'oppose',
                      colorClassName: 'text-negative-300',
                      iconName: 'thumbs-down',
                    },
                    {
                      label: formatText({ id: 'motion.support' }),
                      id: 'support',
                      value: 'support',
                      colorClassName: 'text-purple-200',
                      iconName: 'thumbs-up',
                    },
                  ]}
                  name="vote"
                />
              </div>
              <ul className="mb-6">
                {items.map(({ key, ...item }) => (
                  <li key={key} className="mb-2 last:mb-0">
                    <TextWithValue {...item} />
                  </li>
                ))}
              </ul>
              <Button mode="primarySolid" isFullSize text="Submit vote" />
            </ActionForm>
          ),
        },
      ]}
    />
  );
};

VotingStep.displayName = displayName;

export default VotingStep;
