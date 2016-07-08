import React from 'react';
import {Link} from 'react-router';
import qs from 'qs';
//import Pudding from 'ether-pudding';
//import Status from './environments/development/contracts/Status.sol.js';


const mappingUrl = 'http://chasqui.uport.me/tx/';
var pollingInterval;

const Sign = React.createClass({
  getInitialState: function() {
    var self = this;
    var statusContract = this.props.web3.eth.contract([{"constant":false,"inputs":[{"name":"status","type":"string"}],"name":"updateStatus","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getStatus","outputs":[{"name":"","type":"string"}],"type":"function"}]);
    var status = statusContract.at("0x60dd15dec1732d6c8a6125b21f77d039821e5b93");
    var address = this.props.web3.eth.defaultAccount;
    status.getStatus.call(address, function(err, statusText) {
      self.setState({statusText: statusText});
    });
    return {
      status: status,
      tx: null,
      error: null,
      statusText : null,
    };
  },
  locationHashChanged: function() {
    if(location.hash){
      const params = qs.parse(location.hash.slice(1));
      if (params.tx) {
        clearInterval(pollingInterval);
        this.setState({tx: params.tx})
      }
    }
  },

  componentDidMount: function() {
    window.addEventListener("hashchange", this.locationHashChanged, false);
  },

  setStatus: function(){
    var self = this;
    var statusText=this.refs.statusInput.value;
    console.log("set status:"+statusText);
    this.setState({statusText: this.state.statusText + " (updating)"});

    this.state.status.updateStatus(statusText, function(err, txHash) {
      console.log(txHash)
      self.setState({tx: txHash});
      self.waitForMined(txHash, {blockNumber: null});
    });
  },
  waitForMined: function(txHash, res) {
    var self = this;
    if (res.blockNumber) {
      self.state.status.getStatus.call(self.props.web3.eth.defaultAccount, function(e, r) {
        self.setState({statusText: r});
      });
    }
    else {
      self.props.web3.eth.getTransaction(txHash, function(e, r) {
        self.waitForMined(txHash, r);
      });
    }
  },
  componentDidUpdate: function() {
    if (this.state.tx) {
      $('#qr').hide();
      $('#tx').text(this.state.tx);
      $('#success').show();
    }
    if (this.state.error) {
      clearInterval(pollingInterval)
      $('#qr').hide();
      $('#error').text(this.state.error);
      $('#errorDiv').show();
    }
  },
  render: function() {
    var ethUrl=this.state.uri + "&callback_url=" + window.location.href;
    var uriFull=this.state.uri+"&callback_url="+mappingUrl + this.state.randomStr;

    return (
      <div className="container centered" style={{maxWidth:'400px'}}>
        <Link to="/">
          <img className="main-logo" src="img/uPort-logo.svg" alt="uPort"
            title="uPort Logo"
            style={{maxWidth:'90px',margin: '20px auto 40px',display: 'block'}} />
        </Link>
        <div id="status">
          <h3 id="currentStatus">{this.state.statusText}</h3>
          <br />
          <form action="javascript:void(0);">
              <ol className="fields">
                <li>
                  <label>New Status:</label>
                  <input id="statusInput" ref="statusInput" type="text" placeholder="Status" defaultValue="I'm Happy" />
                </li>
                <li>
                    <button className="btn" onClick={this.setStatus}>Set new status!</button>
                </li>
              </ol>
          </form>
        </div>
        <div id="success" style={{display: 'none'}}>
          <h3>Success! You have set your status</h3>
          <p><strong>Tx:</strong><span id="tx" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
        </div>
        <div id="errorDiv" style={{display: 'none'}}>
          <h3>Error! You have NOT set your status.</h3>
          <p><strong>Error:</strong><span id="error" style={{display: 'inline-block',marginLeft: '10px'}}></span> </p>
        </div>
      </div>
    );
  }
});

export default Sign;
