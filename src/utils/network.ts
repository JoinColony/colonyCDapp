/* Use the NetworkInformation API to see user's network speed. More info: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation */
const getNetworkInfo = () => {
  // @ts-ignore Property is experimental.
  return window.navigator.connection;
};

const getConnectionType = () => {
  const networkInfo = getNetworkInfo();
  if (networkInfo) {
    return networkInfo.effectiveType;
  }

  return null;
};

export const connectionIs4G = () => {
  const connectionType = getConnectionType();

  // Where we don't have access to the NetworkInformationAPI
  if (!connectionType) {
    return null;
  }

  if (connectionType === '4g') {
    return true;
  }

  // If connection type is either 'slow-2g', '2g', '3g' -- the only remaining options.
  return false;
};
