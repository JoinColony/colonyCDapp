import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import styles from '../UserHub.module.css';
import { EmptyContentProps } from '../types';

const displayName = 'common.Extensions.UserHub.partials.EmptyContent';

const EmptyContent: FC<EmptyContentProps> = ({ contentName }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex relative h-full flex-col">
      <div className="flex flex-col items-center justify-center">
        <div className={styles.emptyContent}>
          <Icon name="binoculars" appearance={{ size: 'tiny' }} />
        </div>
        <p className="text-3 leading-5">
          {formatMessage({ id: 'empty.content.title' }, { contentName })}
        </p>
        <p className="text-xs text-gray-600">
          {formatMessage({ id: 'empty.content.subtitle' }, { contentName })}
        </p>
      </div>
    </div>
  );
};

EmptyContent.displayName = displayName;

export default EmptyContent;
