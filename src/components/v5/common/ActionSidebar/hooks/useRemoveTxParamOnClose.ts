import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { TX_SEARCH_PARAM } from '~routes/index.ts';
import { removeQueryParamFromUrl } from '~utils/urls.ts';

export const useRemoveTxParamOnClose = () => {
  const navigate = useNavigate();

  useEffect(
    () => () => {
      navigate(removeQueryParamFromUrl(window.location.href, TX_SEARCH_PARAM), {
        replace: true,
      });
    },
    [navigate],
  );
};
