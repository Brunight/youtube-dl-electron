import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Info from '../pages/Info';
import CropperPage from '../pages/CropperPage';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/info/:source/:id" component={Info} />
    <Route path="/cropper" component={CropperPage} />
  </Switch>
);

export default Routes;
