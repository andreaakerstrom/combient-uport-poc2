import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../Components/App'
import AuditTrail from '../Components/AuditTrail'

export const routes = (
	<Route path='/' component={App}>
    <IndexRoute component={AuditTrail} />
		<Route component={AuditTrail} path='audittrail'/>
  </Route>
)
