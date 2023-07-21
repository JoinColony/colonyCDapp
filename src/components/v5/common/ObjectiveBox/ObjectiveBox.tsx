import React, { FC } from 'react';
import { useIntl } from 'react-intl';
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
        <div className="flex items-center">
          <div className="relative w-full h-2 rounded bg-gray-200">
            <span
              className="bg-blue-400 h-full absolute left-0 top-0 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-3 text-gray-600 ml-3">{progress || 0}%</span>
        </div>
      </div>
    </div>
  );
};

ObjectiveBox.displayName = displayName;

export default ObjectiveBox;
