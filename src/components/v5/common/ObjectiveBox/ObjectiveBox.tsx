import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import ProgressBar from '~v5/shared/ProgressBar';
import { ObjectiveBoxProps } from './types';

const displayName = 'v5.common.ObjectiveBox';

const ObjectiveBox: FC<ObjectiveBoxProps> = ({
  title,
  description,
  progress,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="p-6 bg-base-white border border-gray-200 rounded-lg">
      <h6 className="text-1 mb-1">
        {formatMessage(
          title || { id: 'colonyDetailsPage.noObjectiveBoxTitle' },
        )}
      </h6>
      <p className="text-sm text-gray-600 mb-[1.125rem]">
        {formatMessage(
          description || { id: 'colonyDetailsPage.noObjectiveBoxDescription' },
        )}
      </p>
      <div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

ObjectiveBox.displayName = displayName;

export default ObjectiveBox;
