import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useQuery, gql } from '@apollo/client';

import { getFullColonyByName } from '~gql';

const MSG = defineMessages({
  backText: {
    id: 'pages.ColonyBackText.backText',
    defaultMessage: `
      {displayName, select,
        undefined {Back to Colony}
        other {Back to {displayName}}
      }`,
  },
});

const ColonyBackText = () => {
  const { colonyName } = useParams<{ colonyName: string }>();
  const { data } = useQuery(gql(getFullColonyByName), {
    variables: {
      name: colonyName,
    },
  });

  const [displayName, ensName] = data?.getColonyByName?.items || [];

  return (
    <FormattedMessage
      {...MSG.backText}
      values={{ displayName: displayName || ensName }}
    />
  );
};

export default ColonyBackText;
