import React from 'react'
import '../../sass/uport.scss'

export default class App extends React.Component {
  render () {
    return (<div className='audittrail'>{this.props.children}</div>)
  }
}

App.propTypes = { children: React.PropTypes.object }
