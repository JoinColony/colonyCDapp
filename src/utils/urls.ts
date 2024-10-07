import { type OptionalValue } from '~types';

export const getTransactionHashFromPathName = (pathname: string) =>
  pathname.split('/').pop();

export const removeQueryParamFromUrl = (
  url: string,
  paramOrParams: string | string[],
) => {
  const urlObject = new URL(url, 'https://fake.domain');
  const params = Array.isArray(paramOrParams) ? paramOrParams : [paramOrParams];

  params.forEach((param) => urlObject.searchParams.delete(param));

  const [, pathname] = urlObject.toString().split(urlObject.origin);

  return pathname;
};

/**
 * Please use this function sparingly.
 * If you have an option to use useSearchParams, please use that instead.
 *
 * Updates the URL's query parameters and optionally changes the path.
 *
 * (Original behaviour) Only query parameters with truthy values (non-undefined, non-null, non-falsy) will be added to the URL.
 *
 * @param params - An object where each key-value pair represents a query parameter to add or update in the URL.
 * @param path - The optional path to update the URL with. Defaults to the current page's path if not provided.
 *
 * @returns The updated URL with the new query parameters and path.
 *
 * @example
 * // Current URL: localhost:9091/planex?name=joe
 * setQueryParamOnUrl({ params: { name: 'jen' } });
 * // Returns: '/planex?name=jen'
 *
 * @example
 * // Current URL: localhost:9091/planex?name=joe
 * setQueryParamOnUrl({ params: { name: 'jen' }, path: '/wayne' });
 * // Returns: '/wayne?name=jen'
 *
 * @example
 * // Current URL: localhost:9091/planex
 * setQueryParamOnUrl({ params: { name: '', id: '123' } });
 * // Returns: '/planex?id=123' (name is omitted because it's falsy)
 */
export const setQueryParamOnUrl = ({
  params,
  path = window.location.pathname,
}: {
  params: Record<string, OptionalValue<string>>;
  path?: string;
}) => {
  const searchParams = new URLSearchParams(window.location.search);

  Object.keys(params).forEach((param) => {
    const paramValue = params[param];

    if (paramValue) {
      searchParams.set(param, paramValue);
    }
  });

  return `${path}?${searchParams.toString()}`;
};
