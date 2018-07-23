import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import NotFound from '../../../Exception/404';
import { getRoutes } from '../../../../utils/utils';

export default class StepForm extends PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <Fragment>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/useradmin/b-school/detail" to="/useradmin/b-school/all-detail" />
          <Route render={NotFound} />
        </Switch>
      </Fragment>
    );
  }
}
