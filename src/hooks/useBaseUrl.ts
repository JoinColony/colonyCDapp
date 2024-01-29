import { useMemo } from 'react';

const useBaseUrl = (path?: string) => {
  return useMemo(
    () => new URL(path || '/', window.document.baseURI).href,
    [path],
  );
};

export default useBaseUrl;
