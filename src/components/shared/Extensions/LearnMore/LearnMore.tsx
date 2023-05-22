import React, { PropsWithChildren, FC } from 'react';

import { FormattedMessage } from 'react-intl';
import ExternalLink from '~shared/Extensions/ExternalLink';

import { LearnMoreProps } from './types';
import Icon from '~shared/Icon';

const displayName = 'Extensions.LearnMore';

const LearnMore: FC<PropsWithChildren<LearnMoreProps>> = ({ message, href }) => {
  const { id, defaultMessage } = message;

  return (
    <div className="text-sm flex justify-center items-center font-normal text-gray-900">
      <Icon name="question" appearance={{ size: 'tiny' }} />
      <span className="block ml-2">
        <FormattedMessage
          id={id}
          defaultMessage={defaultMessage}
          values={{
            // eslint-disable-next-line react/no-unstable-nested-components
            a: (chunks) => (
              <ExternalLink className="underline font-semibold ml-px" href={href}>
                {chunks}
              </ExternalLink>
            ),
          }}
        />
      </span>
    </div>
  );
};

LearnMore.displayName = displayName;

export default LearnMore;
