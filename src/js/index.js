import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes from './Routes/index'

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('uport')
)
