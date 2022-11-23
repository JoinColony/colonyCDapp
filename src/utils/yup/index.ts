import gql from 'graphql-tag';
import { Schema, TestContext, ValidateOptions, ValidationError } from 'yup';

import { ContextModule, getContext } from '~context';
import { intl } from '~utils/intl';

/*
 * Extracts the query name and first variable name from a graphql query.
 */
const QUERY_NAME_REGEX = /{\s*[a-zA-z]*\(/;
const QUERY_VARIABLE_NAME_REGEX = /\$[\w]*/;

const apolloClient = getContext(ContextModule.ApolloClient);
const { formatMessage } = intl({
  'error.unknown': 'There was an error with the request. Please try again.',
});

export const validate =
  <I>(schema: Schema<any>) =>
  async (value: I, options: ValidateOptions = { strict: true }): Promise<I> =>
    schema.validate(value, options);

export const validateSync =
  <I>(schema: Schema<any>) =>
  (value: I, options: ValidateOptions = { strict: true }): I =>
    schema.validateSync(value, options);

/**
 * Run a query inside a TestFunction
 * that returns a network error message in the event the query errors, else the query data.
 * @param query Query to be executed
 * @param variables Query variables
 * @param createError createError function that returns a Validation Error. Taken from yup's TestContext.
 * @returns Query Data or network error message
 */
export async function runQuery<Q, V>(
  query: string,
  variables: V,
  createError: TestContext['createError'],
): Promise<Q | ValidationError> {
  try {
    const { data } = await apolloClient.query<Q, V>({
      query: gql(query),
      variables,
    });
    return data;
  } catch (e) {
    if (e.message.includes('Failed to fetch')) {
      return createError({
        message: formatMessage({ id: 'error.network' }),
      });
    }

    return createError({
      message: formatMessage({ id: 'error.unknown' }),
    });
  }
}

interface CustomTestConfig {
  query: string;
  isOptional?: boolean;
  circuitBreaker?: boolean | ((value) => boolean);
}

/**
 * Generate a custom test function for yup .test.
 * Expects query to take exactly one variable, namely, the value of the input field.
 * @param query Query to be executed
 * @param isOptional Is field required? False by default
 * @param circuitBreaker False by default. If true, will not run test. Can take a test function from a previous test. In this case,
 * will not run if the function resolves to false. Previous tests should therefore assert positively, e.g. isUsernameValid. If it
 * is not valid, do not run this test...
 * @returns yup TestFunction, that runs the provided query using the input value
 * as the query's input variable. Function will return true if there are no results (i.e. value doesn't exist in db);
 * false if there are (value does exist in db); and an appropriate error message if the query errors.
 */
export function createYupTestFromQuery({
  query,
  isOptional = false,
  circuitBreaker = false,
}: CustomTestConfig) {
  return async function checkIfValueExistsInDB(value) {
    const cancel =
      typeof circuitBreaker === 'boolean'
        ? circuitBreaker
        : !circuitBreaker(value);

    if (!value || cancel) {
      return isOptional;
    }

    const queryName = query.match(QUERY_NAME_REGEX)?.[0] ?? ''; // Expect to be defined.
    const variableKey = query.match(QUERY_VARIABLE_NAME_REGEX)?.[0] ?? ''; // Expect to be defined.

    const { createError } = this as TestContext;
    const result = await runQuery(
      query,
      {
        [cleanQueryVariableName(variableKey)]: value,
      },
      createError,
    );

    if (result instanceof ValidationError) {
      return result;
    }

    return !(result as object)[cleanQueryName(queryName)]?.items.length;
  };
}

function cleanQueryName(queryNameMatch: string) {
  /* match prefixed with '{', suffixed with '(' and contains whitespace */
  return queryNameMatch.substring(1, queryNameMatch.length - 1).trim();
}

function cleanQueryVariableName(variableNameMatch: string) {
  /* match is prefixed with '$' */
  return variableNameMatch.substring(1);
}
