import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from '../components/App';
import Home from '../components/Home';
import Connect from '../components/Connect';


export default (
	<Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="connect" component={Connect} />
  </Route>
);
