import gql from 'graphql-tag';
import { defineMessages } from 'react-intl';
import { string, object } from 'yup';

import { ContextModule, getContext } from '~context';
import {
  getColonyByName,
  GetColonyByNameQuery,
  GetColonyByNameQueryVariables,
} from '~gql';
import { intl } from '~utils/intl';

const displayName = 'common.CreateColonyWizard.StepColonyNameValidation';

const { formatMessage } = intl;

const MSG = defineMessages({
  keyRequired: {
    id: `${displayName}.keyRequired`,
    defaultMessage: `{key} is a required field`,
  },
  errorDomainTaken: {
    id: `${displayName}.errorDomainTaken`,
    defaultMessage: 'This colony domain name is already taken',
  },
  networkError: {
    id: `${displayName}.errorDomainTaken`,
    defaultMessage: 'There was a problem with the connection. Please try again',
  },
  colonyUniqueURL: {
    id: `${displayName}.colonyUniqueURL`,
    defaultMessage: 'Colony Unique URL',
  },
  colonyName: {
    id: `${displayName}.colonyName`,
    defaultMessage: 'Colony Name',
  },
});

export const { keyRequired } = MSG;

const apolloClient = getContext(ContextModule.ApolloClient);

export const validationSchema = object({
  displayName: string().required(
    // use 'UI' fieldname in error message
    formatMessage(MSG.keyRequired, {
      key: formatMessage(MSG.colonyName),
    }),
  ),
  colonyName: string()
    .required(
      // use 'UI' fieldname in error message
      formatMessage(MSG.keyRequired, {
        key: formatMessage(MSG.colonyUniqueURL),
      }),
    )
    .ensAddress()
    .test(
      'isDomainTaken',
      formatMessage(MSG.errorDomainTaken),
      async function isDomainTaken(name: string) {
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
          return this.createError({ message: formatMessage(MSG.networkError) });
        }
      },
    ),
});
