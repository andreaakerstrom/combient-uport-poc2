import React from 'react';
import '../../sass/uport.scss';

const App = React.createClass({
  render() {
    return (
      <div className="connect">
        {this.props.children}
      </div>
    )
  }
})

export default App;