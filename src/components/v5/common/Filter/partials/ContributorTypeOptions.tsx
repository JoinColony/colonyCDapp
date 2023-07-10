import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { contributorTypes } from './consts';

const displayName = 'v5.common.Filter.partials.ContributorTypeOptions';

const ContributorTypeOptions: FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <ul>
        {contributorTypes.map(({ id, title }) => (
          <li key={id}>{formatMessage(title)}</li>
        ))}
      </ul>
    </div>
  );
};

ContributorTypeOptions.displayName = displayName;

export default ContributorTypeOptions;
