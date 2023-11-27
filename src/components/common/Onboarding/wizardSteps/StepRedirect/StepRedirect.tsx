import React from 'react';
import { Navigate } from 'react-router-dom';
import { LANDING_PAGE_ROUTE } from '~routes';

const displayName = 'common.Onboarding.StepRedirect';

// NOTE: we could potentially also have more flexible redirects
// That would be done by passing an initial form value into the wizard that can then be picked up here
const StepRedirect = () => {
  return <Navigate to={LANDING_PAGE_ROUTE} />;
};
StepRedirect.displayName = displayName;

export default StepRedirect;
