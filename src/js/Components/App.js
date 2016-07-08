import React from 'react';
import QRCode from 'qrcode.react';
import '../../sass/uport.scss';
import Web3 from 'web3';
import Uport from 'uport';

const qrstyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  /* bring your own prefixes */
  transform: 'translate(-50%, -50%)'
}

const App = React.createClass({
  getInitialState() {
    var self = this;
    var qrDisplay = {
      openQr: self.openQr,
      closeQr: self.closeQr
    };
    var web3 = new Web3();
    var uport = new Uport("TestApp", qrDisplay);
    uport.injectSubprovider(web3);

    return {web3: web3};
  },
  openQr(data) {
    var qrImg = (
      <QRCode value={data} size={256} />
    );
    this.setState({qr: qrImg});
  },
  closeQr() {
    this.setState({qr: ""});
  },
  render() {
    var childrenWithWeb3 = React.cloneElement(this.props.children, { web3: this.state.web3 });
    return (
      <div className="connect">
        <div style={qrstyle}>
          {this.state.qr}
        </div>
        {childrenWithWeb3}
      </div>
    )
  }
})

export default App;
