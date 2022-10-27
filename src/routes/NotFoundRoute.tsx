import React from 'react';
import { Navigate } from 'react-router-dom';

import { NOT_FOUND_ROUTE } from './routeConstants';

const NotFoundRoute = () => <Navigate to={NOT_FOUND_ROUTE} replace />;

export default NotFoundRoute;
