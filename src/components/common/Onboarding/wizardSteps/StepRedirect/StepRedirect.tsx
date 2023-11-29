import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LANDING_PAGE_ROUTE } from '~routes';

const displayName = 'common.Onboarding.StepRedirect';

const StepRedirect = () => {
  const { state } = useLocation();
  const redirectTo = state?.redirectTo || LANDING_PAGE_ROUTE;
  return <Navigate to={redirectTo} />;
};
StepRedirect.displayName = displayName;

export default StepRedirect;
