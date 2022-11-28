import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { Schema, TestContext, ValidateOptions, ValidationError } from 'yup';

import { ContextModule, getContext } from '~context';
import { intl } from '~utils/intl';

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
  queryDocument: DocumentNode,
  variables: V,
  createError: TestContext['createError'],
): Promise<Q | ValidationError> {
  try {
    const { data } = await apolloClient.query<Q, V>({
      query: queryDocument,
      variables,
    });
    return data;
  } catch (e) {
    if (e.message.includes('Failed to fetch')) {
      return createError({
        message: formatMessage({ id: 'error.network' }),
      });
    }

    return createUnknownError(createError);
  }
}

interface CustomTestConfig {
  query: DocumentNode;
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
    const { createError } = this as TestContext;

    const cancel =
      typeof circuitBreaker === 'boolean'
        ? circuitBreaker
        : !circuitBreaker(value);

    if (!value || cancel) {
      return isOptional;
    }

    const queryName = (query.definitions[0] as OperationDefinitionNode).name
      ?.value;
    const variableKey = (query.definitions[0] as OperationDefinitionNode)
      .variableDefinitions?.[0].variable.name.value;

    if (!queryName || !variableKey) {
      throw new Error(
        'Query must be a named query and have exactly one named variable.',
      );
    }

    const result = await runQuery(
      query,
      {
        [variableKey]: value,
      },
      createError,
    );

    if (result instanceof ValidationError) {
      return result;
    }

    return !(result as object)[cleanQueryName(queryName)]?.items.length;
  };
}

/* Map custom query names to actual query names */
const customQueries: Record<string, string> = {
  GetFullColonyByName: 'getColonyByName',
};

function cleanQueryName(queryName: string) {
  const customQueryKey = Object.keys(customQueries).find(
    (k) => k === queryName,
  );

  /* If custom query, return actual query name */
  if (customQueryKey) {
    return customQueries[customQueryKey];
  }

  /* Else, convert first letter to lowercase */
  return queryName.substring(0, 1).toLowerCase() + queryName.substring(1);
}

function createUnknownError(createError: TestContext['createError']) {
  return createError({
    message: formatMessage({ id: 'error.unknown' }),
  });
}
