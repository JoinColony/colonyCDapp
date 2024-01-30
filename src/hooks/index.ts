import { useMediaQuery } from 'react-responsive';

import queries from '~styles/queries.css';

export const useMobile = () => {
  const { query850: query } = queries;
  const isMobile = useMediaQuery({ query });
  return isMobile;
};

export const useTablet = () => {
  const { query1024: query } = queries;
  const isTablet = useMediaQuery({ query });
  return isTablet;
};
