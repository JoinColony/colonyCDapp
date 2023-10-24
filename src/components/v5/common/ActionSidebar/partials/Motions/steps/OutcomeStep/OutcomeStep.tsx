import React, { FC, useMemo } from 'react';
import { formatText } from '~utils/intl';
import { supportOption, opposeOption } from '../../consts';
import VoteStatus from './partials/VoteStatus';
import { MotionVote } from '~utils/colonyMotions';
import CardWithSections from '~v5/shared/CardWithSections';
import MembersAvatars from './partials/MembersAvatars';
import { OutcomeStepProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep';

const OutcomeStep: FC<OutcomeStepProps> = ({ motionData }) => {
  const {
    motionStakes: {
      percentage: { yay: yayPercent, nay: nayPercent },
    },
  } = motionData;

  const voteStatuses = useMemo(
    () => [
      {
        id: supportOption.id,
        iconName: supportOption.iconName,
        label: supportOption.label,
        progress: yayPercent,
        status: MotionVote.Yay,
      },
      {
        id: opposeOption.id,
        iconName: opposeOption.iconName,
        label: opposeOption.label,
        progress: nayPercent,
        status: MotionVote.Nay,
      },
    ],
    [supportOption, yayPercent, nayPercent],
  );

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
                ({ id, iconName, label = '', progress, status }) => (
                  <VoteStatus
                    key={id}
                    iconName={iconName}
                    label={label}
                    progress={progress}
                    status={status}
                  >
                    <MembersAvatars className="flex items-end flex-1" />
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
