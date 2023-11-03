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
