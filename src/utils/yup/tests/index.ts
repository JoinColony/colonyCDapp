import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { TestContext, ValidationError, TestFunction } from 'yup';

import { ContextModule, getContext } from '~context';
import { now } from '~utils/lodash';

import {
  cancelEarly,
  cleanQueryName,
  createUnknownError,
  formatMessage,
} from './helpers';

const apolloClient = getContext(ContextModule.ApolloClient);

/* Map custom query names to actual query names */
export const customQueries: Record<string, string> = {
  GetFullColonyByName: 'getColonyByName',
};

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

    console.error(e);
    return createUnknownError(createError);
  }
}

export interface CustomTestConfig {
  query: DocumentNode;
  isOptional?: boolean;
  circuitBreaker?: boolean | ((value) => boolean);
  debounceInput?: boolean;
  wait?: number;
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
  debounceInput = true,
  wait = 200,
}: CustomTestConfig) {
  if (debounceInput) {
    return yupDebounce(checkIfValueExistsInDB, wait, {
      isOptional,
      circuitBreaker,
    });
  }

  return checkIfValueExistsInDB;

  async function checkIfValueExistsInDB(value) {
    const { createError } = this as TestContext;

    const cancel = cancelEarly(circuitBreaker, value);

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
  }
}

interface YupDebounceOptions {
  isOptional: NonNullable<CustomTestConfig['isOptional']>;
  circuitBreaker: NonNullable<CustomTestConfig['circuitBreaker']>;
}
/**
 * Debounce yup validation test function, inspired by lodash's debounce function.
 * If the function has not been called in over {wait} miliseconds, the test function will be called.
 * Else, the test function will be queued, and only the last function to be queued will be called
 * once {wait} miliseconds has elapsed.
 * Note: lodash debounce is not suitable for yup validation. It will return a cached value on subsequent
 * calls within the wait period, which means that if you make a call that fails immediately followed by a
 * call that should pass, the debounced function will return the cached fail value.
 * @param fn Yup test function.
 * @param wait Time to wait
 * @param options Can be passed options from the CustomTestConfig to return early if a certain condition is met,
 * which can improve performance.
 * @returns Debounced test function.
 */
function yupDebounce(
  fn: TestFunction,
  wait: number,
  options?: YupDebounceOptions,
) {
  let lastCallTime;
  let lastValue;
  let lastReturnValue;
  /*
   * Array to keep track of the number of additions made to the timeout queue.
   */
  let timeouts: any[] = [];

  /* Calculate time since last function call. */
  function shouldInvoke(time) {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : 0;
    return (
      /*
       * If lastCallTime is undefined, this is the first time the function has been called.
       * If timeSinceLastCall is greater than or equal to wait, the delay period has elapsed.
       * If it's negative, system time has moved backwards. If so, just invoke as if delayed period has elapsed.
       */
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0
    );
  }

  /*
   * Debounced test function wrapper. If wait is over, invoke function.
   * Else, queue subsequent calls and only invoke the most recent one.
   */
  function caller(value) {
    /*
     * If input hasn't changed when called, e.g. if the call is the result of another
     * form field changing
     */
    if (lastReturnValue) {
      if (Object.is(value, lastValue)) {
        return lastReturnValue;
      }
    }
    lastValue = value;
    /*
     * Return early if circuitbreaker provided and condition satisfied.
     * Improves performance.
     */
    if (options) {
      const { circuitBreaker, isOptional } = options;

      const cancel = cancelEarly(circuitBreaker, value);

      if (!value || cancel) {
        lastReturnValue = isOptional;
        if (!timeouts.length) {
          return isOptional;
        }
        /* Ensures any remaining timeout doesn't resolve after this one */
        return new Promise((resolve) => {
          setTimeout(resolve, wait, isOptional);
        });
      }
    }
    const time = now();
    const isInvoking = shouldInvoke(time);
    lastCallTime = time;
    if (isInvoking) {
      timeouts = [];
      const result = fn.call(this, value);
      lastReturnValue = result;
      return result;
    }

    /*
     * If we're still waiting, return a promise that will resolve after wait has elapsed.
     * Its resolve value depends on how many timeouts are in the queue.
     * If there's only one left, resolve with the result of the Yup test function.
     * Else, resolve as true and remove one timeout from the queue.
     */
    const result = new Promise((resolve) => {
      const id = setTimeout(() => {
        if (timeouts.length > 1) {
          timeouts.pop();
          resolve(true);
        } else {
          const res = fn.call(this, value);
          res.then((data) => {
            timeouts = [];
            resolve(data);
          });
        }
      }, wait);
      timeouts.push(id);
    });
    lastReturnValue = result;
    return result;
  }

  return caller as TestFunction;
}
