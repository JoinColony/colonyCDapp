import React, { FC } from 'react';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

import CardWithStatusText from '~v5/shared/CardWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { VOTING_THRESHOLD } from '~constants';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import { DescriptionListItem } from './partials/DescriptionList/types';
import DescriptionList from './partials/DescriptionList';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.VotingStep';

const VotingStep: FC = () => {
  const items: DescriptionListItem[] = [
    {
      key: '1',
      label: formatText({ id: 'motion.votingStep.votingMethod' }),
      value: 'Reputation-weighted',
    },
    {
      key: '2',
      label: formatText({ id: 'motion.votingStep.teamReputation' }),
      value: (
        <MemberReputation
          userReputation="20"
          totalReputation="100"
          textClassName="text-sm"
        />
      ),
    },
    {
      key: '3',
      label: formatText({ id: 'motion.votingStep.rewardRange' }),
      value: '0.0006 - 12 CLNY',
    },
  ];

  return (
    <CardWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText({ id: 'motion.votingStep.statusText' }),
        textClassName: 'text-4',
        iconAlignment: 'top',
        content: (
          <ProgressBar
            progress={0}
            threshold={VOTING_THRESHOLD}
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
                <h4 className="text-2 mb-3 text-center">
                  {formatText({ id: 'motion.votingStep.title' })}
                </h4>
                <FormButtonRadioButtons
                  // @TODO: Replace this with const that will be merged by Asia C.
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
              <DescriptionList items={items} className="mb-6" />
              <Button
                mode="primarySolid"
                isFullSize
                text={formatText({ id: 'motion.votingStep.submit' })}
              />
            </ActionForm>
          ),
        },
      ]}
    />
  );
};

VotingStep.displayName = displayName;

export default VotingStep;
