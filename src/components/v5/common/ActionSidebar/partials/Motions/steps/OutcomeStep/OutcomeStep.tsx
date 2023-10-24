import React, { FC } from 'react';
import { formatText } from '~utils/intl';

import VoteStatus from './partials/VoteStatus';
import CardWithSections from '~v5/shared/CardWithSections';
import MembersAvatars from '~v5/shared/MembersAvatars';
import { OutcomeStepProps } from './types';
import { useMemberAvatars, useOutcomeStep } from './hooks';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData }) => {
  const { yayPercent, nayPercent, voteStatuses } = useOutcomeStep(motionData);
  const { loading, watchers } = useMemberAvatars();

  return (
    <CardWithSections
      sections={[
        {
          key: '1',
          content: (
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-1 mb-2">
                {formatText({
                  id:
                    yayPercent > nayPercent
                      ? 'motion.outcomeStep.win.title'
                      : 'motion.outcomeStep.lost.title',
                })}
              </h3>
              {voteStatuses.map(
                ({ id, iconName, label = '', progress = '', status }) => (
                  <VoteStatus
                    key={id}
                    iconName={iconName}
                    label={label}
                    progress={progress}
                    status={status}
                  >
                    <MembersAvatars
                      className="flex items-end flex-1"
                      watchers={watchers}
                      loading={loading}
                    />
                  </VoteStatus>
                ),
              )}
            </div>
          ),
        },
      ]}
    />
  );
};

OutcomeStep.displayName = displayName;

export default OutcomeStep;
