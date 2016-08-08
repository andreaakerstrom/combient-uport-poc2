import React from 'react';
import '../../sass/uport.scss';
import Web3 from 'web3';
import Uport from 'uport-lib';

const App = React.createClass({
  getInitialState() {
    var self = this;
    var qrDisplay = {
      openQr: self.openQr,
      closeQr: self.closeQr
    };
    var web3 = new Web3();
    var uport = new Uport("TestApp");
    var uportProvider = uport.getUportProvider('https://consensysnet.infura.io:8545');
    web3.setProvider(uportProvider);

    return {web3: web3};
  },
  render() {
    var childrenWithWeb3 = React.cloneElement(this.props.children, { web3: this.state.web3 });
    return (
      <div className="connect">
        {childrenWithWeb3}
      </div>
    )
  }
})

export default App;
