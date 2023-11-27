import { useMediaQuery } from 'react-responsive';

import queries from '~styles/queries.css';

const useMobile = () => {
  const { query850: query } = queries;
  const isMobile = useMediaQuery({ query });
  return isMobile;
};

export default useMobile;
