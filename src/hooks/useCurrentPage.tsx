import { useLocation } from 'react-router-dom';

const useCurrentPage = (items) => {
  const { pathname } = useLocation();
  const currentPathname = items.filter((item) => item.linkTo === pathname);
  const id = currentPathname.length ? currentPathname[0].id : 0;

  return id;
};

export default useCurrentPage;
