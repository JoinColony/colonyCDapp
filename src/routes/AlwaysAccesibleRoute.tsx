import React, { ComponentType } from 'react';
import { RouteProps, useParams } from 'react-router-dom';

import FeedbackWidget from '~shared/FeedbackWidget';
import { RouteComponentProps } from '~root/RouteLayouts';

type routePropsFn = (params: any) => RouteComponentProps;

type Props = {
  component: ComponentType<any>;
  layout: ComponentType<any>;
  routeProps?: RouteComponentProps | routePropsFn;
} & RouteProps;

const AlwaysAccesibleRoute = ({
  routeProps,
  component: Component,
  layout: Layout,
  ...props
}: Props) => {
  const params = useParams();

  const passedDownRouteProps =
    typeof routeProps !== 'function' ? routeProps : routeProps(params);

  return (
    <Layout routeProps={passedDownRouteProps} {...props}>
      <Component routeProps={passedDownRouteProps} {...props} />
      <FeedbackWidget />
    </Layout>
  );
};

export default AlwaysAccesibleRoute;
