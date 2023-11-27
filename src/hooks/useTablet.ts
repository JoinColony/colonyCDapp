import { useMediaQuery } from 'react-responsive';

import queries from '~styles/queries.css';

const useTablet = () => {
  const { query1024: query } = queries;
  const isTablet = useMediaQuery({ query });
  return isTablet;
};

export default useTablet;
