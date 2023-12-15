export const fetchData = async <T, R = string>(
  url: string,
  cb: (data: T) => R,
  error = `Fetch to ${url} failed.`,
) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data: T = await res.json();
      return cb(data);
    }

    console.error(error, res.status, ': ', res.statusText);
  } catch (e) {
    console.error(error, e);
  }

  return null;
};

export const convertTokenToCLNY = (
  tokenPriceInUSD: number,
  clnyPriceInUSD: number,
) => {
  const USDinCLNY = 1 / clnyPriceInUSD; // 1 USD : x CLNY
  return tokenPriceInUSD * USDinCLNY;
};

export const mapToAPIFormat = (
  mapping: Record<string, string>,
  key: string,
) => {
  if (!(key in mapping)) {
    console.error(`${key} is not a supported currency API input.`);
    return key;
  }

  return mapping[key];
};

export const buildAPIEndpoint = (
  url: URL,
  queryParams: Record<string, string>,
) => {
  Object.keys(queryParams).forEach((key) =>
    url.searchParams.append(key, queryParams[key]),
  );
  return url.href;
};
