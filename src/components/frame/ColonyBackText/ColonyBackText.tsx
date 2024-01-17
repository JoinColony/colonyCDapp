import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext } from '~hooks';

const componentDisplayName = 'frame.ColonyBackText';

const MSG = defineMessages({
  backText: {
    id: `${componentDisplayName}.backText`,
    defaultMessage: `
      {displayName, select,
        undefined {Back to Colony}
        other {Back to {displayName}}
      }`,
  },
});

const ColonyBackText = () => {
  const {
    colony: { metadata },
  } = useColonyContext();
  const { displayName } = metadata || {};

  return <FormattedMessage {...MSG.backText} values={{ displayName }} />;
};

ColonyBackText.displayName = componentDisplayName;

export default ColonyBackText;
