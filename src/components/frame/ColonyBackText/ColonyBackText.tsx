import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { getFullColonyByName } from '~gql';

const MSG = defineMessages({
  backText: {
    id: 'frame.ColonyBackText.backText',
    defaultMessage: `
      {displayName, select,
        undefined {Back to Colony}
        other {Back to {displayName}}
      }`,
  },
});

const componentDisplayName = 'frame.ColonyBackText';

const ColonyBackText = () => {
  const { colonyName } = useParams<{ colonyName: string }>();
  const { data } = useQuery(gql(getFullColonyByName), {
    variables: {
      name: colonyName,
    },
  });

  const [colony] = data?.getColonyByName?.items || [];

  if (!colony) {
    return null;
  }

  const {
    profile: { displayName },
  } = colony;

  return <FormattedMessage {...MSG.backText} values={{ displayName }} />;
};

ColonyBackText.displayName = componentDisplayName;

export default ColonyBackText;
