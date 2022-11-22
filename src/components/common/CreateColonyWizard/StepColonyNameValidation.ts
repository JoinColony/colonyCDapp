import gql from 'graphql-tag';
import { string, object } from 'yup';

import { ContextModule, getContext } from '~context';
import {
  getColonyByName,
  GetColonyByNameQuery,
  GetColonyByNameQueryVariables,
} from '~gql';
import { intl } from '~utils/intl';

const { formatMessage } = intl({
  'error.keyRequired': '{key} is a required field',
  'error.nameTaken': 'This colony name is already taken',
  'error.network': 'There was a problem with the connection. Please try again',
  'label.colonyUniqueURL': 'Colony Unique URL',
  'label.colonyName': 'Colony Name',
});

const apolloClient = getContext(ContextModule.ApolloClient);

export const validationSchema = object({
  displayName: string().required(
    // use 'UI' fieldname in error message
    formatMessage(
      { id: 'error.keyRequired' },
      {
        key: formatMessage({ id: 'label.colonyName' }),
      },
    ),
  ),
  colonyName: string()
    .required(
      // use 'UI' fieldname in error message
      formatMessage(
        { id: 'error.keyRequired' },
        {
          key: formatMessage({ id: 'label.colonyUniqueURL' }),
        },
      ),
    )
    .colonyName()
    .test(
      'isNameTaken',
      formatMessage({ id: 'error.nameTaken' }),
      async function isNameTaken(name: string) {
        if (!name) {
          return false;
        }

        try {
          const { data } = await apolloClient.query<
            GetColonyByNameQuery,
            GetColonyByNameQueryVariables
          >({
            query: gql(getColonyByName),
            variables: {
              name,
            },
          });
          // If query returns no items, colony name not in db. Therefore, not taken.
          return !data.getColonyByName?.items.length;
        } catch {
          return this.createError({
            message: formatMessage({ id: 'error.network' }),
          });
        }
      },
    ),
});
