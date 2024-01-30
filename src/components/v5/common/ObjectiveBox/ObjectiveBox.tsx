import React, { type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { MAX_OBJECTIVE_DESCRIPTION_LENGTH } from '~constants/index.ts';
import { multiLineTextEllipsis } from '~utils/strings/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';

import { type ObjectiveBoxProps } from './types.ts';

const displayName = 'v5.common.ObjectiveBox';

const MSG = defineMessages({
  noObjectiveBoxTitle: {
    id: `${displayName}.noObjectiveBoxTitle`,
    defaultMessage: 'No objective set',
  },
  noObjectiveBoxDescription: {
    id: `${displayName}.noObjectiveBoxDescription`,
    defaultMessage:
      'There are no objectives set for the Colony. Once created, the objective will update here.',
  },
});

const ObjectiveBox: FC<ObjectiveBoxProps> = ({ objective }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="p-6 bg-base-white border border-gray-200 rounded-lg">
      <h6 className="text-1 mb-1">
        {objective?.title || formatMessage(MSG.noObjectiveBoxTitle)}
      </h6>
      <p className="text-sm text-gray-600 mb-[1.125rem]">
        {objective
          ? multiLineTextEllipsis(
              objective.description,
              MAX_OBJECTIVE_DESCRIPTION_LENGTH,
            )
          : formatMessage(MSG.noObjectiveBoxDescription)}
      </p>
      <ProgressBar progress={objective?.progress || 0} additionalText="%" />
    </div>
  );
};

ObjectiveBox.displayName = displayName;

export default ObjectiveBox;
