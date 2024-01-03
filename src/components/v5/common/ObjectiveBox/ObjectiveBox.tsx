import React, { FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import ProgressBar from '~v5/shared/ProgressBar';

import { ObjectiveBoxProps } from './types';

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
        {objective?.description || formatMessage(MSG.noObjectiveBoxDescription)}
      </p>
      <ProgressBar progress={objective?.progress || 0} additionalText="%" />
    </div>
  );
};

ObjectiveBox.displayName = displayName;

export default ObjectiveBox;
