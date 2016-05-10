import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from '../Components/App';
import Home from '../Components/Home';
import Connect from '../Components/Connect';


export default (
	<Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="connect" component={Connect} />
  </Route>
);
